# Changelog

## 0.2.0 - 2023-02-23

### Added

- A `load` function to infer a collection/entry, assuming there's only one defined collection.
- Added an optional second `slug` parameter to `loadEntry`, so you can override the default `params.slug`.
- An exported `handle` alias of `leblog`, so in `hooks.server.js` you can simply: `export { handle } from 'leblog/hooks'`.

## 0.1.0 - 2023-02-22

The first release!
