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

leblog works by mounting an API with a single endpoint, `/api/blog`, which returns a list of blog posts. You can then use this API to fetch blog posts and display them however you like.

### 1. Write your posts

By default leblog looks in `src/posts` for markdown files ([configurable](#configuration-optional)), formatted as `yyyy-mm-dd-{ slug }.md`.

### 2. Mount the API

In `src/hooks.server.js`:

```js
import { leblog } from 'leblog/hooks'

export const handle = leblog
```

Or by sequencing it with other hooks:

```js
import { leblog } from 'leblog/hooks'
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(some_other_hook, leblog)
```

Or simply:

```js
export { leblog as handle } from 'leblog/hooks'
```

### 2. Load your posts

In any load function, e.g. `+page.js`:

```js
import { loadCollection } from 'leblog'

export const load = loadCollection('posts') // or whatever you've named it
```

And to load a single post in a sub-route (e.g. `[slug]/+page.js`):

```js
import { loadEntry } from 'leblog'

export const load = loadEntry('posts')
```

In this case leblog will use the `slug` param to find the specific entry in the `posts` collection.

### 3. Render your posts

In the neighboring `+page.svelte`, `data` will be populated with the name of the collection (e.g. `posts`):

```svelte
<script>
  import { Entry } from 'leblog'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<ul>
  {#each data.posts as entry}
    <li>
      <a href="/{entry.slug}">{entry.title}</a>

      <Entry {entry} />
    </li>
  {/each}
</ul>
```

Or for a single entry:

```svelte
<script>
  import { Entry } from 'leblog'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<h1>{data.entry.title}</h1>

<Entry entry={data.entry} />
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

```json
{
  "collections": {
    "posts": "src/posts"
  }
}
```

`collections` is a an object where the key is the name of the collection and the value is the path to the directory containing the markdown files.

`changelog` is a special key, whose value can either be a path to a directory containing markdown files, or a single markdown file adhering to the [keepachangelog.com](http://keepachangelog.com) standards.

## Thanks

- [svelte-markdown](https://github.com/pablo-abc/svelte-markdown) for the markdown rendering.
- [gray-matter](https://github.com/jonschlinkert/gray-matter) for parsing YAML frontmatter.
- [changelog-parser](https://github.com/ungoldman/changelog-parser) for parsing changelog files.

## License

MIT
