import fs from 'fs'
import default_config from './default_config.json' assert { type: 'json' }

/**
 * @typedef {object} Config
 * @property {RequireAtLeastOne<Object<string, string>>} collections
 */

let user_config = {}

const user_config_exists = fs.existsSync('leblog.config.js')

if (user_config_exists) {
  const config_js = fs.readFileSync('leblog.config.js', { encoding: 'utf-8' })

  const js_import = await import(`data:text/javascript,${config_js}`)

  user_config = js_import.default
}

/** @type {Config} */
export const config = {
  ...default_config,
  ...user_config
}
