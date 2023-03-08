import { load_feed } from './utils'

/**
 * @param {string} collection
 * @returns {import('@sveltejs/kit').ServerLoad}
 */
export const loadFeed =
  (collection) =>
  ({ url }) =>
    load_feed({ collection, url })
