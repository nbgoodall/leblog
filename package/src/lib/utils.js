// import { Feed } from 'feed'
import fs from 'fs'
import matter from 'gray-matter'
import changelog from 'changelog-parser'

import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { gfmFootnote, gfmFootnoteHtml } from 'micromark-extension-gfm-footnote'
// import { compile as mdsvex_compile } from 'mdsvex'
// import { compile as svelte_compile } from 'svelte/compiler'

import { config } from './config.js'
import { dev } from './env'

const COLLECTION_KEYS = Object.keys(config.collections)

export const load_collections = async () => {
  /** @type {Record<keyof typeof config.collections, any>} */
  let collections = {}

  for (let collection of COLLECTION_KEYS) {
    collections[collection] = await load_collection({ collection })
  }

  return collections
}

/**
 * @param {object} params
 * @param {string} [params.collection]
 * @returns {Promise<(Entry | ChangelogEntry)[]>}
 */
export const load_collection = async ({ collection } = {}) => {
  if (!collection) {
    if (COLLECTION_KEYS.length > 1)
      throw new Error(
        "Can't use `load` with multiple collections, please specify one using `loadCollection`."
      )

    collection = COLLECTION_KEYS[0]
  }

  if (collection === 'changelog' && fs.lstatSync(config.collections.changelog).isFile())
    return load_changelog()

  const entries = await Promise.all(
    collection_filenames(collection).map((filename) => create_entry({ collection, filename }))
  )

  return entries.reverse()
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
  const collection_path = config.collections[collection]

  return fs
    .readdirSync(collection_path)
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
  const filepath = `${config.collections[collection]}/${filename}`

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

/** @param {string} markdown */
const parse_markdown = (markdown) =>
  micromark(markdown, {
    allowDangerousHtml: true,
    extensions: [gfm(), gfmFootnote()],
    htmlExtensions: [gfmHtml(), gfmFootnoteHtml()]
  })
