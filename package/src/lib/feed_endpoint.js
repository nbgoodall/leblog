import { feeds } from 'virtual:leblog'

export const prerender = true

const CONTENT_TYPES = {
  rss: 'application/rss+xml',
  json: 'application/json',
  atom: 'application/atom+xml'
}

export const GET = ({ url }) => {
  const feed = feeds[url.pathname.replace(/^\/*/, '')]

  const [extension] = url.pathname.split('.').reverse()

  return new Response(feed, { headers: { 'Content-Type': CONTENT_TYPES[extension] } })
}
