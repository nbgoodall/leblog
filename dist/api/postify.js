import fs from 'fs'
import matter from 'gray-matter'
import changelog from 'changelog-parser'

import { dev } from '$app/environment'

import { config } from '../config'

/**
 * This hook creates the postify API.
 *
 * @type {import('@sveltejs/kit').Handle}
 */
export const postify = async ({ event, resolve }) => {
  if (event.url.pathname.match(/^\/postifier\/collections/)) {
    const [collection, slug] = event.url.pathname
      .replace('/postifier/collections/', '')
      .replace('.json', '')
      .toLowerCase()
      .split('/')

    if (collection === 'changelog') {
      return render_changelog()
    } else if (slug) {
      return render_entry({ collection, slug })
    } else {
      return render_collection({ collection })
    }
  }

  return await resolve(event)
}

/**
 * @param {object} params
 * @param {string} params.collection
 */
const render_collection = ({ collection }) => {
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

  return fs.readdirSync(collection_path).filter((filename) => {
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
  if (fs.lstatSync(config.collections.changelog).isDirectory())
    return render_collection({ collection: 'changelog' })

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
