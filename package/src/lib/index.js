import { collections } from 'virtual:leblog'

/**
 * @param {string} path
 * @returns {Array<Entry | ChangelogEntry>}
 */
export const load = (path) => {
  const [collection, slug] = path.split('/')

  const entries = collections[collection]

  if (!entries) throw new Error(`'${collection}' is not a valid collection. Try one of '${Object.keys(entries).join(`', '`)}'.`)

  if (slug) {
    let entry = entries.find(entry => entry.path.includes(slug))

    if (!entry) throw new Error(`Could not find the entry '${slug}' in the ${collection} collection.`)

    return entry
  }


  return entries
}
