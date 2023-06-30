import fs from 'node:fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { set_dev } from './env'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const virtual_module_id = 'virtual:leblog'
const resolved_virtual_module_id = '\0' + virtual_module_id

/** @returns {import('vite').Plugin} */
const plugin = () => {
  return {
    name: 'leblog',
    resolveId(id) {
      if (id === virtual_module_id) return resolved_virtual_module_id
    },
    load(id) {
      if (id === resolved_virtual_module_id) return virtual_import()

      // if (is_leblog_import(id)) {
      //   const file = fs.readFileSync(path.join(__dirname, 'routes', id, '/+page.svelte'), { encoding: 'utf-8' })

      //   return compile(file, { generate: 'ssr' , hydratable: true }).js.code
      // }
    },
    async configureServer(server) {
      const { handler } = await import('../build/handler.js')

      server.middlewares.use((req, res, next) => {
        if (is_leblog_route(req.originalUrl)) {
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

const is_leblog_import = (filepath) => {
  return fs.existsSync(path.resolve(__dirname, 'routes') + filepath)
}

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

const is_leblog_route = (filepath) => {
  // let match = filepath.match(/routes\/(.+)/)

  // if (!match) return

  const leblog_path = path.join(__dirname, '../src/routes', filepath)
  if (fs.existsSync(leblog_path)) return leblog_path

  const app_path = path.join(__dirname, '../build/client', filepath)
  if (fs.existsSync(app_path)) return app_path
}

export default plugin
