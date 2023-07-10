import fs from 'fs'
import matter from 'gray-matter'
import changelog from 'changelog-parser'
import { Feed } from 'feed'

import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { gfmFootnote, gfmFootnoteHtml } from 'micromark-extension-gfm-footnote'
// import { compile as mdsvex_compile } from 'mdsvex'
// import { compile as svelte_compile } from 'svelte/compiler'

import { config } from './config.js'
import { dev } from './env.js'

export const load_collections = async () => {
  /** @type {Record<keyof typeof config.collections, any>} */
  let collections = {}

  for (let collection of Object.keys(config.collections)) {
    collections[collection] = await load_collection({ collection })
  }

  return collections
}

/**
 * @param {object} params
 * @param {string} params.collection
 * @returns {Promise<(Entry | ChangelogEntry)[]>}
 */
export const load_collection = async ({ collection } = {}) => {
  if (collection === 'changelog' && fs.lstatSync(config.collections.changelog).isFile())
    return load_changelog()

  const entries = await Promise.all(
    collection_filenames(collection).map((filename) => create_entry({ collection, filename }))
  )

  return entries.reverse()
}

/**
 * @param {object} params
 * @param {Record<keyof typeof config.collections, any} params.collections
 * @param {string[]} params.paths
 * @returns {Promise<Response>} - The XML atom feed
 */
export const create_feeds = ({ collections }) => {
  const collections_with_feeds = Object.keys(collections).filter((name) => !!config.collections[name]?.feed)

  let feeds = {}

  for (let collection of collections_with_feeds) {
    const { feed: path } = config.collections[collection]

    const feed = new Feed({
      title: 'Feed',
      // id: url.origin,
      // link: url.origin,
      copyright: `© ${new Date().getFullYear()}`,
      generator: 'leblog'
    })

    for (let entry of collections[collection]) {
      feed.addItem({
        title: entry.title,
        id: entry.slug,
        // link: `${url.origin + url.origin.endsWith('/') ? '' : '/'}${path}/${entry.slug}`,
        content: entry.html,
        date: new Date(entry.date || new Date())
      })
    }

    const [type] = path.split('.').reverse()

    if (type === 'rss') {
      feeds[path] = feed.rss2()
    } else if (type === 'json') {
      feeds[path] = feed.json1()
    } else {
      feeds[path] = feed.atom1()
    }
  }

  return feeds
}

/**
 * Changelogs can either be regular collections, or a single `CHANGELOG.md` file as per
 * keepachangelog.com.
 *
 * Parsed by https://github.com/ungoldman/changelog-parser.
 */
const load_changelog = () => parse_changelog(config.collections.changelog)

/**
 * @param {string} filePath
 * @returns {Promise<ChangelogEntry[]>}
 */
const parse_changelog = async (filePath) => {
  const { versions, title: _title } = await changelog({ filePath })

  const changelogPromise = versions.map(async (entry) => {
    const slug = entry.title.toLowerCase().replace(/ /g, '')

    return {
      title: entry.title,
      date: entry.date ? new Date(entry.date) : undefined,
      slug,
      data: {},
      collection: 'changelog',
      is_draft: false,
      version: entry.version,
      raw: entry.body,
      html: parse_markdown(entry.body)
    }
  })

  return await Promise.all(changelogPromise)
}

/**
 * @param {string} collection
 */
const collection_filenames = (collection) => {
  return fs
    .readdirSync(get_collection_path(collection))
    .filter((filename) => filename.endsWith('.md'))
    .filter((filename) => {
      const is_draft = filename.match(/^_/)

      return dev ? true : !is_draft
    })
}

/**
 * @param {object} params
 * @param {string} params.collection
 * @param {string} params.filename
 * @returns {Promise<Entry>}
 */
const create_entry = async ({ collection, filename }) => {
  const filepath = `${get_collection_path(collection)}/${filename}`

  const file = fs.readFileSync(filepath, {
    encoding: 'utf-8'
  })

  // const mdsvex = await mdsvex_compile(file)

  // const svelte = svelte_compile(mdsvex.code, { generate: 'ssr' })

  // console.log(svelte.js.code)
  // console.log(await import(`data:text/javascript,${encodeURIComponent(comp)}`))
  // console.log('HEY', svelte.js.code)

  const { data, content, excerpt: _excerpt } = matter(file)

  const [_0, draft, date_string, _1, slug] =
    filename.match(/(_)?(\d{4}-\d{2}-\d{2})(-(.+))?\.md/) || []

  if (!date_string)
    throw new Error(`Invalid filename: ${filename} (must match 'YYYY-MM-DD[-{ slug }].md')`)

  return {
    title: (data.title || slug) + (draft ? ' (draft)' : ''),
    date: new Date(date_string),
    slug,
    collection,
    path: `${date_string}${slug ? `-${slug}` : ''}`,
    data,
    is_draft: !!draft,
    raw: content,
    html: parse_markdown(content)
  }
}

const get_collection_path = (collection) => {
  const value = config.collections[collection]

  return typeof value === 'string' ? value : value.path
}

/** @param {string} markdown */
const parse_markdown = (markdown) =>
  micromark(markdown, {
    allowDangerousHtml: true,
    extensions: [gfm(), gfmFootnote()],
    htmlExtensions: [gfmHtml(), gfmFootnoteHtml()]
  })


