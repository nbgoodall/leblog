import { load_entry } from './utils.js'

/**
 * @param {string} collection
 * @param {string} [slug]
 * @returns {import('@sveltejs/kit').ServerLoad}
 */
export const loadEntry =
  (collection, slug) =>
  async ({ params, parent }) => ({
    ...(await parent()),
    ...(await load_entry({ collection, slug: slug || params.slug || '' }))
  })
