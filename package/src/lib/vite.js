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

const FEEDS = ['blog/feed.rss', 'random/feed.atom'].map(item => item + '/+server.js')

/** @type {import('vite').ViteDevServer} */
let vite_server

/** @returns {import('vite').Plugin} */
const plugin = () => {
  return {
    name: 'leblog',
    resolveId(id, _, { isEntry }) {
      if (id === virtual_module_id) return resolved_virtual_module_id
    },
    async load(id) {
      if (id === resolved_virtual_module_id) return virtual_import()

      const feed = FEEDS.find(path => id.endsWith(path))
      if (feed) return fs.readFileSync(path.resolve(__dirname, feed), { encoding: 'utf-8' })
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

/** Patch the filesystem reads for custom routes */

const _readDirSync = fs.readdirSync
const _statSync = fs.statSync
const _readFileSync = fs.readFileSync
const _unlinkSync = fs.unlinkSync

fs.readdirSync = (filepath, options) => {
  let results = []

  try {
    results = _readDirSync(filepath, options)
  } catch {}


  const [route_path] = filepath.match(/\/routes.*/) || []

  if (route_path) {
    for (let feed of FEEDS) {
      const overlap = route_overlap(route_path, feed)

      const [filename] = feed.slice(overlap.length).split('/').filter(Boolean)

      if (overlap) {
        if (feed.endsWith(filename)) {
          results.push(options?.withFileTypes ? virtual_file(filename, filepath) : filename)
        } else {
          results.push(options?.withFileTypes ? virtual_directory(filename, filepath) : filename)
        }
      } else if (route_path.endsWith('routes/') && !results.includes(filename)) {
        results.push(options?.withFileTypes ? virtual_directory(filename, filepath) : filename)
      }
    }
  }

  return results
}

fs.statSync = (filepath, options) => {
  try {
    const result = _statSync(filepath, options)
    return result
  } catch (error) {
    const [route_path] = filepath.match(/\/routes.*/) || []

    if (route_path) {
      for (let feed of FEEDS) {
        const overlap = route_overlap(route_path, feed)

        if (overlap) {
          if (feed.endsWith(overlap)) {
            return _statSync(path.resolve(__dirname, 'feed_endpoint.js'), options)
          } else {
            return virtual_directory(path.basename(filepath), filepath)
          }
        }
      }
    }

    throw error
  }
}

fs.readFileSync = (filepath, options) => {
  const feed = FEEDS.find(path => filepath.endsWith(path))
  if (feed) return _readFileSync(path.resolve(__dirname, 'feed_endpoint.js'), options)

  return _readFileSync(filepath, options)
}

fs.unlinkSync = (filepath) => {
  try {
    _unlinkSync(filepath)
  } catch {}
}

/** @param {string} name */
const virtual_file = (name, path) => {
  const dirent = new fs.Dirent(name, fs.constants.UV_DIRENT_FILE)

  if (path) dirent.path = path

  return dirent
}

/** @param {string} name */
const virtual_directory = (name, path) => {
  const dirent = new fs.Dirent(name, fs.constants.UV_DIRENT_DIR)

  if (path) dirent.path = path

  return dirent
}

function route_overlap(a, b, min = 2) {
  if (b.length <= min)
    return ''

  if (a.endsWith(b))
    return b

  return route_overlap(a, b.substring(0, b.length - 1), min)
}

export default plugin
