import { Feed } from 'feed'
import fs from 'fs'
import matter from 'gray-matter'
import changelog from 'changelog-parser'

import { dev } from '$app/environment'

import { config } from '../config.js'

const COLLECTION_KEYS = Object.keys(config.collections)

/**
 * @param {object} params
 * @param {string} [params.collection]
 * @returns {Promise<{ [key: string]: (Entry | ChangelogEntry)[] }>}
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

  const [_, draft, date_string, slug] = filename.match(/(_)?(\d{4}-\d{2}-\d{2})-(.+)\.md/) || []

  if (!date_string || !slug)
    throw new Error(`Invalid filename: ${filename} (must match 'YYYY-MM-DD-{ slug }.md')`)

  return {
    title: (data.title || slug) + (draft ? ' (draft)' : ''),
    date: new Date(date_string),
    slug,
    collection,
    path: filepath,
    data,
    is_draft: !!draft,
    raw: content
  }
}

/**
 * @param {object} params
 * @param {string} params.collection
 * @param {URL} params.url
 * @returns {Promise<string>} - The XML atom feed
 */
export const create_feed = async ({ collection, url }) => {
  const feed = new Feed({
    title: 'Feed',
    id: url.origin,

    copyright: '© 2021',
    generator: 'leblog', // optional, default = 'Feed for Node.js'
    feedLinks: {
      json: 'https://example.com/json',
      atom: 'https://example.com/atom'
    }
  })

  const { [collection]: entries } = await load_collection({ collection })

  console.log('HEY', entries)

  for (let entry of entries) {
    feed.addItem({
      title: entry.title,
      id: entry.slug,
      // link: entry.url,
      // description: post.description,
      content: entry.raw,
      date: new Date(entry.date)
      // image: post.image
    })
  }

  return feed.atom1()

  // posts.forEach(post => {
  // });
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
      raw: entry.body
    }
  })

  return await Promise.all(changelogPromise)
}
