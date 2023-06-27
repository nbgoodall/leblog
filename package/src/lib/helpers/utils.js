import { Feed } from 'feed'
import fs from 'fs'
import matter from 'gray-matter'
import changelog from 'changelog-parser'

import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { gfmFootnote, gfmFootnoteHtml } from 'micromark-extension-gfm-footnote'

import { dev } from '$app/environment'

import { config } from '../config.js'

const COLLECTION_KEYS = Object.keys(config.collections)

/**
 * @param {object} params
 * @param {string} params.collection
 * @returns {Promise<{ [key: string]: (Entry | ChangelogEntry)[] }>}
 */
export const load_collection = async ({ collection }) => {
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

  return {
    [collection]: entries.reverse()
  }
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

/**
 * @param {object} params
 * @param {string} [params.collection]
 * @param {URL} params.url
 * @returns {Promise<Response>} - The XML atom feed
 */
export const load_feed = async ({ collection, url }) => {
  if (!collection) {
    if (COLLECTION_KEYS.length > 1)
      throw new Error(
        "Can't use `load_feed` with multiple collections, please specify one using `loadFeed`."
      )

    collection = COLLECTION_KEYS[0]
  }

  const feed = new Feed({
    title: 'Feed',
    id: url.origin,
    link: url.origin,
    copyright: `© ${new Date().getFullYear()}`,
    generator: 'leblog'
  })

  const { [collection]: entries } = await load_collection({ collection })

  const [path, extension] = url.pathname.split('.')

  for (let entry of entries) {
    feed.addItem({
      title: entry.title,
      id: entry.slug,
      link: `${url.origin + url.origin.endsWith('/') ? '' : '/'}${path}/${entry.slug}`,
      content: entry.html,
      date: new Date(entry.date || new Date())
    })
  }

  let content_type, content

  if (extension === 'rss') {
    content_type = 'application/rss+xml'
    content = feed.rss2()
  } else if (extension === 'json') {
    content_type = 'application/json'
    content = feed.json1()
  } else {
    content_type = 'application/atom+xml'
    content = feed.atom1()
  }

  return new Response(content, { headers: { 'Content-Type': content_type } })
}

/**
 * Changelogs can either be regular collections, or a single `CHANGELOG.md` file as per
 * keepachangelog.com.
 *
 * Parsed by https://github.com/ungoldman/changelog-parser.
 */
const load_changelog = async () => ({
  changelog: await parse_changelog(config.collections.changelog)
})

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

/** @param {string} markdown */
const parse_markdown = (markdown) =>
  micromark(markdown, {
    allowDangerousHtml: true,
    extensions: [gfm(), gfmFootnote()],
    htmlExtensions: [gfmHtml(), gfmFootnoteHtml()]
  })
