// import fs from 'node:fs'
// import { compile } from 'mdsvex'
// import { compile as svelte_compile } from 'svelte/compiler'
// import { load_collection } from './load.js'
// import { readdir } from 'node:fs/promises'
//

import entries from 'leblog/entries'

// const _readdirSync = fs.readdirSync
// const _statSync = fs.statSync
// const _readFileSync = fs.readFileSync
//
// import { page } from '$app/stores'

/**
 * @param {import('node:fs').PathLike} filepath
 * @param {Parameters<typeof import('node:fs').readdirSync>[1]} options
 */
// fs.readdirSync = function (filepath, options) {
//   /** @type {unknown[]} */
//   const paths = _readdirSync(filepath, options)

//   if (!filepath.toString().includes('routes')) return paths

//   // console.log('hey', filepath, paths)

//   if (filepath.toString() == '/Users/nick/projects/leblog/website/src/routes') {
//     paths.push({
//       name: 'leblog',
//       isFile: () => false,
//       isDirectory: () => true,
//       isBlockDevice: () => false,
//       isFIFO: () => false,
//       isCharacterDevice: () => false,
//       isSocket: () => false,
//       isSymbolicLink: () => false
//     })
//   }
//   // console.log('hi', paths)

//   if (filepath.toString() == '/Users/nick/projects/leblog/website/src/routes/leblog') {
//     console.log('FILES', _readdirSync('./api'))
//     // paths.push({
//     //   name: 'leblog',
//     //   isFile: () => true,
//     //   isDirectory: () => false,
//     //   isBlockDevice: () => false,
//     //   isFIFO: () => false,
//     //   isCharacterDevice: () => false,
//     //   isSocket: () => false,
//     //   isSymbolicLink: () => false
//     // })

//     // console.log('hi', paths)
//   }

//   return paths
// }

/**
 * @param {string} filepath
 * @param {Parameters<import('node:fs').StatSyncFn>[1]} options
 */
// fs.statSync = function (filepath, options) {
//   if (!filepath.includes('routes')) {
//     return _statSync(filepath, options)
//   }

//   // try {
//   const result = _statSync(filepath, options)

//   // console.log('statSync', result)
//   return result
//   // } catch (error) {
//   //   // everything internal to houdini should assume posix paths
//   //   filepath = path.posixify(filepath.toString())

//   //   const mock = virtual_file(path.basename(filepath), { withFileTypes: true })

//   //   // always fake the root +layout.server.js and +layout.svelte
//   //   if (
//   //     filepath.endsWith(path.join('routes', '+layout.svelte')) ||
//   //     filepath.endsWith(path.join('routes', '+layout.svelte')) ||
//   //     filepath.endsWith(path.join('routes', '+layout.server.js')) ||
//   //     filepath.endsWith(path.join('routes', '+layout.server.js'))
//   //   ) {
//   //     return mock
//   //   }

//   //   // we want to fake +layout.js if there is a +layout.svelte
//   //   else if (filepath.endsWith('+layout.js')) {
//   //     return mock
//   //   }

//   //   // we want to fake +page.js if there is a +page.svelte
//   //   else if (filepath.endsWith('+page.js')) {
//   //     return mock
//   //   }

//   //   // if we got this far we didn't fake the file
//   //   throw error
//   // }
// }

let dev = true

/** @returns {import('vite').Plugin} */
const plugin = () => {
  return {
    name: 'leblog',
    resolveId(id) {
      if (id === 'leblog/entries') return 'virtual:leblog/entries'
    },
    load(id) {
      if (id === 'virtual:leblog/entries') return entries_import()
    },
    configResolved(config) {
      dev = config.mode === 'development'
    }
  }
}

const entries_import = async () => {
  const { load_collections } = await import('./load.js')

  const collections = await load_collections(dev)

  return `export default ${JSON.stringify(collections)}`
}

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


export default plugin
