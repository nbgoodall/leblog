import { load_collections } from '$lib/utils'

/** @type {import('./$types').LayoutServerLoad} */
export const load = async () => ({ collections: await load_collections() })