import fs from 'fs'
import matter from 'gray-matter'
import changelog from 'changelog-parser'

import { dev } from '$app/environment'

import { config } from './config.js'

const COLLECTION_KEYS = Object.keys(config.collections)

/**
 * This hook creates the leblog API.
 *
 * @type {import('@sveltejs/kit').Handle}
 */
export const leblog = async ({ event, resolve }) => {
  // Specific entries/entry
  if (event.url.pathname.match(/^\/leblog\/collections/)) {
    const [collection, slug] = event.url.pathname
      .replace('/leblog/collections/', '')
      .replace(/\.\w+/, '')
      .toLowerCase()
      .split('/')

    return slug ? render_entry({ collection, slug }) : render_collection({ collection })
  }
  // Single collection, if there's only 1
  else if (event.url.pathname.match(/^\/leblog\/entries/)) {
    if (COLLECTION_KEYS.length > 1)
      throw new Error(
        "Can't use `load` with multiple collections, please specify one using `loadCollection`."
      )

    return render_collection({ collection: COLLECTION_KEYS[0] })
  }
  // Single entry, if there's only 1 collection
  else if (event.url.pathname.match(/^\/leblog\/entry\/\w+/)) {
    if (COLLECTION_KEYS.length > 1)
      throw new Error(
        "Can't use `load` with multiple collections, please specify one using `loadEntry`."
      )

    const slug = event.url.pathname.replace('/leblog/entry/', '').replace(/\.\w+/, '').toLowerCase()

    return render_entry({ collection: COLLECTION_KEYS[0], slug })
  }

  return await resolve(event)
}

export const handle = leblog

/**
 * @param {object} params
 * @param {string} params.collection
 */
const render_collection = ({ collection }) => {
  if (collection === 'changelog' && fs.lstatSync(config.collections.changelog).isFile())
    return render_changelog()

  const entries = collection_filenames(collection).map((filename) =>
    create_entry({ collection, filename })
  )

  const data = JSON.stringify({
    [collection]: entries.reverse()
  })

  return new Response(data)
}

/**
 * @param {object} params
 * @param {string} params.collection
 * @param {string} params.slug
 */
const render_entry = ({ collection, slug }) => {
  const filename = collection_filenames(collection).find((filename) =>
    filename.endsWith(`${slug}.md`)
  )

  if (filename) {
    const data = JSON.stringify({
      entry: create_entry({ collection, filename })
    })

    return new Response(data)
  }

  return new Response(`File not found: ${slug} (from collection '${collection}')`, { status: 404 })
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
 * Changelogs can either be regular collections, or a single `CHANGELOG.md` file as per
 * keepachangelog.com.
 *
 * Parsed by https://github.com/ungoldman/changelog-parser.
 */

const render_changelog = async () => {
  const data = JSON.stringify({
    changelog: await parse_changelog(config.collections.changelog)
  })

  return new Response(data)
}

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

export default leblog
