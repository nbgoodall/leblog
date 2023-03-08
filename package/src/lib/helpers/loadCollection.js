import { load_collection } from './utils.js'

/**
 * @param {string} collection
 * @returns {import('@sveltejs/kit').ServerLoad}
 */
export const loadCollection =
  (collection) =>
  async ({ parent }) => ({
    ...(await parent()),
    ...(await load_collection({ collection }))
  })
