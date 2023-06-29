import { entries } from 'virtual:leblog'

/**
 * @param {string} path
 * @returns {Array<Entry | ChangelogEntry>}
 */
export const load = (path) => {
  const [collection, slug] = path.split('/')

  const _entries = entries[collection]

  if (!_entries) throw new Error(`'${collection}' is not a valid collection. Try one of '${Object.keys(entries).join(`', '`)}'.`)

  if (slug) {
    let entry = _entries.find(entry => entry.path.includes(slug))

    if (!entry) throw new Error(`Could not find the entry '${slug}' in the ${collection} collection.`)

    return entry
  }


  return _entries
}

