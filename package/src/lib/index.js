import fs from 'node:fs'
import { compile } from 'mdsvex'
import { compile as svelte_compile } from 'svelte/compiler'

const _readdirSync = fs.readdirSync
const _readFileSync = fs.readFileSync

/**
 * @param {import('node:fs').PathLike} filepath
 * @param {Parameters<typeof import('node:fs').readdirSync>[1]} options
 */
fs.readdirSync = function (filepath, options) {
  /** @type {unknown[]} */
  const paths = _readdirSync(filepath, options)

  if (!filepath.toString().includes('routes')) return paths

  // console.log('hey', filepath, paths)

  if (filepath.toString() == '/Users/nick/projects/leblog/website/src/routes') {
    paths.push({
      name: 'leblog',
      isFile: () => true,
      isDirectory: () => false,
      isBlockDevice: () => false,
      isFIFO: () => false,
      isCharacterDevice: () => false,
      isSocket: () => false,
      isSymbolicLink: () => false
    })

    // console.log('hi', paths)
  }

  return paths
}

// export { load, loadCollection, loadEntry, loadFeed } from './helpers'
// export { default as Entry } from './Entry.svelte'

/**
 * 1. Define an API that responds to all /leblog requests
 * 2. 'Hook' into SvelteKit's `hooks.server.js`
 */

/** @returns {import('vite').Plugin} */
const leblog = () => {
  return {
    name: 'leblog',
    resolveId(id) {
      if (id === 'leblog/posts') return 'virtual:leblog/posts'
    },
    load(id) {
      if (id === 'virtual:leblog/posts') return load('posts')
    }
  }
}

/** @param {string} collection */
export const load = async (collection) => {
  // fetch(`/leblog`)
  // get entries from server-side
  // turn them into components client-side
  // return
  //
  //
  const post = _readFileSync('../website/src/posts/2023-02-23-introduction.md', {
    encoding: 'utf-8'
  })

  const compiled = await compile(post, { highlight: false })

  const component = svelte_compile(compiled?.code, { generate: 'ssr' })

  console.log(component.js.code)

  return component.js.code

  // const res = await import('../../website/src/posts/2023-02-23-introduction.md')

  // console.log('hello', res)

  /** @type {any[]} */
  const posts = []

  return `export default []`
}

export { load as leblog }

export default leblog

// export default function myPlugin() {
//   const virtualModuleId = 'virtual:my-module'
//   const resolvedVirtualModuleId = '\0' + virtualModuleId

//   return {
//     name: 'my-plugin', // required, will show up in warnings and errors
//     resolveId(id) {
//       if (id === virtualModuleId) {
//         return resolvedVirtualModuleId
//       }
//     },
//     load(id) {
//       if (id === resolvedVirtualModuleId) {
//         return `export const msg = "from virtual module"`
//       }
//     },
//   }
// }
