import { text } from '@sveltejs/kit'

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  // console.log('HEY', event.url, new URL('http://localhost:5173/blog'))

  // event.route = { id: '/blog' }
  // event.request = new Request(`${event.url.origin}/blog`, event.request)
  // event.url = new URL(`${event.url.origin}/blog`)

  // if (event.url)

  // console.log('HI', event, new URL(`${event.url.origin}/blog.atom`))

  if (event.url.pathname === '/blog.rss') {
    let new_event = {
      ...event,
      request: new Request(`${event.url.origin}/blog.atom`, event.request),
      url: new URL(`${event.url.origin}/blog.atom`),
      route: { id: '/blog.atom' }
    }

    event.request = new Request(`${event.url.origin}/blog`, event.request)
    event.url = new URL(`${event.url.origin}/blog`)
    event.route = { id: '/blog' }

    return await resolve(event)

    // return new Response(null, { status: 303, headers: { location: '/blog.atom' } })
  }

  // event.request.headers.set('referer', 'http://localhost:5173/blog')
  // let new_event = {
  //   ...event,
  //   request: new Request(`${event.url.origin}/blog`),
  //   url: new URL(`${event.url.origin}/blog`),
  //   route: { id: '/blog' }
  // }

  // event.url.replace

  // const { request, ...everything } = new_event

  // const new_event_2 = {
  //   cookies: event.cookies,
  //   fetch: event.fetch,
  //   getClientAddress: event.getClientAddress,
  //   locals: {},
  //   params: {},
  //   platform: undefined,
  //   request: new Request('http://localhost:5173/blog'),
  //   route: { id: '/blog' },
  //   setHeaders: event.setHeaders,
  //   url: new URL('http://localhost:5173/blog'),
  //   isDataRequest: false
  // }
  // console.log('HI', event.request)

  // return text('hello')
  // event.request.headers.set('referer', 'http://localhost:5173/blog')

  const response = await resolve(event)

  // console.log('hey', response)

  return response
}
