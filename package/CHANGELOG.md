# Changelog

## 0.5.0 - 2023-03-08

### Added

- You can now create Atom and RSS feeds! To do so, export a `GET` request handler from a page's `+server.js`:

```js
import { loadFeed } from 'leblog'

export const GET = loadFeed('posts')
```

- Entries now contain an `html` field with — you guessed it! — the entry's HTML.

## 0.4.3 - 2023-03-07

### Fixed

- `@sveltejs/kit` and `svelte` dependencies are now set correctly.

## 0.4.2 - 2023-02-24

### Changed

- `Entry` is now exported from `leblog` instead of `leblog/entry` (conditional exports ftw).

## 0.3.1 - 2023-02-23

### Changed

- `loadCollection`, `loadEntry` and `load` now run on the server in `+page.server.js` endpoints, removing the need for a handle hook.
- The `Entry` component is now exported from `leblog/entry`.

### Fixed

- Only markdown files (`.md`) are now considered entries.

### Removed

- The `leblog` hook, which is replaced by the aforementioned load functions.

## 0.2.0 - 2023-02-23

### Added

- A `load` function to infer a collection/entry, assuming there's only one defined collection.
- Added an optional second `slug` parameter to `loadEntry`, so you can override the default `params.slug`.
- An exported `handle` alias of `leblog`, so in `hooks.server.js` you can simply: `export { handle } from 'leblog/hooks'`.

## 0.1.0 - 2023-02-22

The first release!
