import { config } from '$lib/config'
import { load_collections } from '$lib/utils'

/** @type {import('./$types').PageServerLoad} */
export const load = () => {

  // console.log("HEI", config, process.cwd())
  return {
    entry: 'hello'
  }
}