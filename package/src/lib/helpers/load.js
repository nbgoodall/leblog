import { load_entry, load_collection } from './utils.js'

/** @type {import('@sveltejs/kit').ServerLoad} */
export const load = async ({ params, parent }) => ({
  ...(await parent()),
  ...(await (params.slug ? load_entry({ slug: params.slug }) : load_collection()))
})
