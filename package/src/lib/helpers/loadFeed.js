import { create_feed } from './utils'

/**
 * @param {string} collection
 * @returns {import('@sveltejs/kit').ServerLoad}
 */
export const loadFeed =
  (collection) =>
  async ({ request, url }) => {
    const feed = await create_feed({ collection, url })

    return new Response(feed) //, { headers: { 'Content-Type': 'application/atom+xml' } })
  }
