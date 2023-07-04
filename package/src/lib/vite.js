import fs from 'node:fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { set_dev } from './env.js'
import { config } from './config.js'

import chokidar from 'chokidar'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const virtual_module_id = 'virtual:leblog'
const resolved_virtual_module_id = '\0' + virtual_module_id

/** @type {import('vite').ViteDevServer} */
let vite_server

/** @returns {import('vite').Plugin} */
const plugin = () => {
  return {
    name: 'leblog',
    resolveId(id) {
      if (id === virtual_module_id) return resolved_virtual_module_id
    },
    load(id) {
      if (id === resolved_virtual_module_id) return virtual_import()
    },
    async configureServer(server) {
      vite_server = server

      /** @ts-ignore */
      const { handler } = await import('../dist/server/handler.js')

      server.middlewares.use((req, res, next) => {
        if (req.originalUrl.startsWith('/leblog')) {
          handler(req, res, next)
        } else {
          next()
        }
      })
    },
    configResolved(config) {
      set_dev(config.mode === 'development')
    },
    config() {
      return {
        optimizeDeps: { exclude: [virtual_module_id] },
      }
    }
  }
}

const virtual_import = async () => {
  const { load_collections } = await import('./utils.js')

  const collections = await load_collections()

  return `export const entries = ${JSON.stringify(collections)}`
}

/** Invalidate the entries when they change */
const files_to_watch = Object.values(config.collections)
const watcher = chokidar.watch(files_to_watch)

watcher.on('change', () => {
  const virtual_module = vite_server.moduleGraph.getModuleById(resolved_virtual_module_id)

  vite_server.moduleGraph.invalidateModule(virtual_module)
})

/** Patch the filesystem reads... */

// const _readDirSync = fs.readdirSync
// const _statSync = fs.statSync
// const _readFileSync = fs.readFileSync

// fs.readdirSync = (filepath, options) => {
//   const leblog_path = leblog_route(filepath)
//   if (leblog_path) return _readDirSync(leblog_path, options)

//   let results = _readDirSync(filepath, options)

//   if (filepath.endsWith('routes')) {
//     results.push(..._readDirSync(path.resolve(__dirname, 'routes'), options))
//   }

//   return results
// }

// fs.statSync = (filepath, options) => {
//   const leblog_path = leblog_route(filepath)
//   if (leblog_path) return _statSync(leblog_path, options)

//   let results = _statSync(filepath, options)

//   return results
// }

// fs.readFileSync = (filepath, options) => {
//   const leblog_path = leblog_route(filepath)
//   if (leblog_path) return _readFileSync(leblog_path, options)

//   return _readFileSync(filepath, options)
// }

export default plugin
