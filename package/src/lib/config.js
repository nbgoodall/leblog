import fs from 'fs'
import default_config from './default_config.json'

/**
 * @typedef {object} Config
 * @property {Object<string, string>} collections
 */

let user_config = {}

const user_config_exists = fs.existsSync('leblog.config.js')

if (user_config_exists) {
  const [file_import] = Object.values(import.meta.glob('/leblog.config.js', { eager: true }))

  user_config = file_import.default
}

/** @type {Config} */
export const config = {
  ...default_config,
  ...user_config
}
