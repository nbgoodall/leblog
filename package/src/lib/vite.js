let dev = true

/** @returns {import('vite').Plugin} */
const plugin = () => {
  return {
    name: 'leblog',
    resolveId(id) {
      if (id === 'leblog/entries') return 'virtual:leblog/entries'
    },
    load(id) {
      if (id === 'virtual:leblog/entries') return load_import()
    },
    configResolved(config) {
      dev = config.mode === 'development'
    }
  }
}

const load_import = async () => {
  const { load_collections } = await import('./utils.js')

  const collections = await load_collections(dev)

  return `export default ${JSON.stringify(collections)}`
}

export default plugin
