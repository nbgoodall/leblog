// import { Feed } from 'feed'
import fs from 'fs'
import matter from 'gray-matter'
import changelog from 'changelog-parser'

import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { gfmFootnote, gfmFootnoteHtml } from 'micromark-extension-gfm-footnote'

// import { dev } from '$app/environment'

const dev = true

import { config } from './config.js'

const COLLECTION_KEYS = Object.keys(config.collections)

/** @param {string} collection */
export const load = async (collection) => {
  // fetch(`/leblog`)
  // get entries from server-side
  // turn them into components client-side
  // return
  // const event = await fetch('https://occasionly.io/events/8a305572-13d7-4e78-b2fc-804e39b574d1')

  // console.log('event', await res.json())
  //
  // const post = _readFileSync('../website/src/posts/2023-02-23-introduction.md', {
  //   encoding: 'utf-8'
  // })

  // const compiled = await compile(post, { highlight: false })

  // const component = svelte_compile(compiled?.code, { generate: 'ssr' })

  // console.log(component.js.code)

  // return component.js.code

  // const res = await import('../../website/src/posts/2023-02-23-introduction.md')

  // console.log('hello', res)
  //
  const entries = await load_collection({ collection })

  return `export default ${JSON.stringify(entries)}`
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

  const entries = collection_filenames(collection).map((filename) =>
    create_entry({ collection, filename })
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
 * @param {object} params
 * @param {string} [params.collection]
 * @param {string} params.slug
 */
export const load_entry = async ({ collection, slug }) => {
  if (!collection) {
    if (COLLECTION_KEYS.length > 1)
      throw new Error(
        "Can't use `load` with multiple collections, please specify one using `loadEntry`."
      )

    collection = COLLECTION_KEYS[0]
  }

  const filename = collection_filenames(collection).find((filename) =>
    filename.endsWith(`${slug}.md`)
  )

  if (filename) {
    return {
      entry: create_entry({ collection, filename })
    }
  }

  throw new Error(`File not found: ${slug} (from collection '${collection}')`)
}

/** @param {string} collection */
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
 * @returns {Entry}
 */
const create_entry = ({ collection, filename }) => {
  const filepath = `${config.collections[collection]}/${filename}`

  const file = fs.readFileSync(filepath, {
    encoding: 'utf-8'
  })

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
