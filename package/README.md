<div align="center">

# leblog

[![npm][npm-image]][npm-url]

Add a blog (or changelog) to any SvelteKit site.

[npm-image]: https://img.shields.io/npm/v/leblog.svg
[npm-url]: https://www.npmjs.com/package/leblog

</div>

## Installation

```bash
npm install leblog
```

## Usage

leblog works by loading your posts through `+page.server.js` files, which you can then render with the included `Entry` component.

### 1. Install the plugin

In `vite.config.js`:

```js
...
import leblog from 'leblog'

export default defineConfig({
  plugins: [leblog(), ...]
})
```

### 2. Write your posts

By default it looks in `posts` in the root of your project for markdown files ([configurable](#configuration-optional)), formatted as `yyyy-mm-dd-{ slug }.md`.

Entries beginning with an underscore (`_`) are drafts and will only be included in development.

### 3. Load your posts

On any page or in any component:

```js
import { load } from 'leblog'

const posts = load('posts') // or `load('posts/${slug}') for a specific noe`
```

And then to render it:

```svelte
<ul>
  {#each posts as post}
    <li>
      <h2>{post.title}</h2>

      {@html post.html}
    </li>
  {/each}
</ul>
```

Each entry will have the following properties:

```ts
export type Entry = {
  collection: string
  data: Object<string, any> // YAML frontmatter
  title: string
  slug: string
  raw: string
  is_draft: boolean
  date?: string // empty in some changelog cases
}
```

In addition, changelog entries have an optional `version` field.

## Configuration (optional)

leblog looks for a `leblog.config.js` file in the root of directory of your project. If it doesn't find one, it will use the following defaults:

```js
export default {
  collections: {
    posts: 'posts'
  }
}
```

`collections` is a an object where the key is the name of the collection and the value is the path to the directory containing the markdown files.

`changelog` is a special key, whose value can either be a path to a directory containing markdown files, or a single markdown file adhering to the [keepachangelog.com](http://keepachangelog.com) standards.

## Atom/RSS feeds

To add an RSS or Atom feed, add a `+server.js` file at your desired route and use the exported `loadFeed` helper. For the [demo blog](https://leblog.dev/blog.atom), this is in `src/routes/blog.atom/+server.js`:

```js
import { loadFeed } from 'leblog'

export const GET = loadFeed('posts')
```

If you only have 1 collection, you can use the exported `GET` helper to infer which one:

```js
export { GET } from 'leblog'
```

## Todo

- [x] Draft posts
- [x] RSS feeds
- [ ] Pagination
- [ ] Code syntax highlighting
- [ ] Authors

## Thanks

- [micromark](https://github.com/micromark/micromark) for the markdown rendering.
- [gray-matter](https://github.com/jonschlinkert/gray-matter) for parsing YAML frontmatter.
- [changelog-parser](https://github.com/ungoldman/changelog-parser) for parsing changelog files.

## License

MIT
