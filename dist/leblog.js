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
 * @returns {import('@sveltejs/kit').Load}
 */
export const loadEntry =
  (collection) =>
  ({ params, fetch, parent }) =>
    fetch_and_insert_parent({
      fetch,
      parent,
      path: `/leblog/collections/${collection}/${params.slug}.json`
    })

/**
 * @param {object} params
 * @param {string} params.path
 * @param {typeof fetch} params.fetch
 * @param {function():Promise<object>} params.parent
 */
const fetch_and_insert_parent = async ({ path, fetch, parent }) => {
  const res = await fetch(path)

  const data = await res.json()

  return {
    ...(await parent()),
    ...data
  }
}
