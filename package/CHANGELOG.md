# Changelog

## 0.4.0 - 2023-02-24

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
