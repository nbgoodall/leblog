import { loadFeed } from 'leblog'

export const prerender = true

export const GET = loadFeed('posts')
