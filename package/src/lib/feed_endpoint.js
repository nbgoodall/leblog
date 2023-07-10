import { feeds } from 'virtual:leblog'

export const GET = ({ url, request }) => {


  // const extension = url.pathname.split('.').pop()
  // console.log("HEY", url, request, {extension})
  //
  // WHICH COLLECTION?!


  // if (extension === 'rss') {
  //   content_type = 'application/rss+xml'
  //   content = feed.rss2()
  // } else if (extension === 'json') {
  //   content_type = 'application/json'
  //   content = feed.json1()
  // } else {
  //   content_type = 'application/atom+xml'
  //   content = feed.atom1()
  // }

  // return new Response(content, { headers: { 'Content-Type': content_type } })

  // console.log("HEY", { feeds })
  return new Response('Hello')

  // return load_feed({ collection: 'posts', url: 'feed.rss' })
}

// export const load_feed = async ({ collection, url }) => {
//   // if (!collection) {
//   //   if (COLLECTION_KEYS.length > 1)
//   //     throw new Error(
//   //       "Can't use `load_feed` with multiple collections, please specify one using `loadFeed`."
//   //     )

//   //   collection = COLLECTION_KEYS[0]
//   // }

//   const feed = new Feed({
//     title: 'Feed',
//     id: url.origin,
//     link: url.origin,
//     copyright: `© ${new Date().getFullYear()}`,
//     generator: 'leblog'
//   })

//   const { [collection]: entries } = entries

//   const [path, extension] = url.pathname.split('.')

//   for (let entry of entries) {
//     feed.addItem({
//       title: entry.title,
//       id: entry.slug,
//       link: `${url.origin + url.origin.endsWith('/') ? '' : '/'}${path}/${entry.slug}`,
//       content: entry.html,
//       date: new Date(entry.date || new Date())
//     })
//   }

//   let content_type, content

//   if (extension === 'rss') {
//     content_type = 'application/rss+xml'
//     content = feed.rss2()
//   } else if (extension === 'json') {
//     content_type = 'application/json'
//     content = feed.json1()
//   } else {
//     content_type = 'application/atom+xml'
//     content = feed.atom1()
//   }

//   return new Response(content, { headers: { 'Content-Type': content_type } })
// }

