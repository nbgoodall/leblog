// import fs from 'node:fs'
// import { compile } from 'mdsvex'
// import { compile as svelte_compile } from 'svelte/compiler'
import { load_collection } from './load.js'
// import { readdir } from 'node:fs/promises'

// const _readdirSync = fs.readdirSync
// const _statSync = fs.statSync
// const _readFileSync = fs.readFileSync

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

// export { load, loadCollection, loadEntry, loadFeed } from './helpers'
// export { default as Entry } from './Entry.svelte'

/**
 * 1. Define an API that responds to all /leblog requests
 * 2. 'Hook' into SvelteKit's `hooks.server.js`
 */

/** @returns {import('vite').Plugin} */
const plugin = () => {
  return {
    name: 'leblog',
    resolveId(id) {
      if (id.match(/leblog\/.+/)) return `virtual:${id}`
    },
    load(id) {
      const match = id.match(/virtual:leblog\/(.+)/)

      if (match) return collection_import(match[1])
    }
  }
}

/** @param {string} path */
export const load = (path) => {

}

/** @param {string} collection */
const collection_import = async (collection) => {
  const entries = await load_collection({ collection })

  return `export default ${JSON.stringify(entries)}`
}

export default plugin
