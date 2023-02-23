/**
 * @param {string} collection
 * @returns {import('@sveltejs/kit').Load}
 */
export const loadCollection =
  (collection) =>
  ({ fetch, parent }) =>
    fetch_and_insert_parent({
      fetch,
      parent,
      path: `/leblog/collections/${collection}.json`
    })

/**
 * @param {string} collection
 * @param {string} [slug]
 * @returns {import('@sveltejs/kit').Load}
 */
export const loadEntry =
  (collection, slug) =>
  ({ params, fetch, parent }) =>
    fetch_and_insert_parent({
      fetch,
      parent,
      path: `/leblog/collections/${collection}/${slug || params.slug}.json`
    })

/** @type {import('@sveltejs/kit').Load} */
export const load = ({ params, fetch, parent }) =>
  fetch_and_insert_parent({
    fetch,
    parent,
    path: params.slug ? `/leblog/entry/${params.slug}.json` : '/leblog/entries.json'
  })

/**
 * @param {object} params
 * @param {string} params.path
 * @param {typeof fetch} params.fetch
 * @param {function():Promise<Record<string, unknown>>} params.parent
 */
const fetch_and_insert_parent = async ({ path, fetch, parent }) => {
  const res = await fetch(path)

  const data = await res.json()

  return {
    ...(await parent()),
    ...data
  }
}
