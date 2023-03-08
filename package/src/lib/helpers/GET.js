import { load_feed } from './utils.js'

/** @type {import('@sveltejs/kit').RequestHandler} */
export const GET = async ({ url }) => load_feed({ url })
