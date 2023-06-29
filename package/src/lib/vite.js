let dev = true

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
    },
    configResolved(config) {
      dev = config.mode === 'development'
    },
    config() {
      return {
        optimizeDeps: { exclude: ['virtual:leblog'] },
      }
    }
  }
}

const virtual_import = async () => {
  const { load_collections } = await import('./utils.js')

  const collections = await load_collections({ dev })

  return `export const entries = ${JSON.stringify(collections)}`
}

export default plugin
