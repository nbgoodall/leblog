export const prerender = true

/** @type {import('./$types').LayoutLoad} */
export const load = async ({ url }) => ({ url: url.toString() })
