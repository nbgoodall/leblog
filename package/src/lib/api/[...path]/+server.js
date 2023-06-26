/** @type {import('@sveltejs/kit').ServerLoad} */
export const GET = ({ params }) => {
  console.log(params.path)

  return {}
}
