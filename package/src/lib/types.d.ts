export default entries

declare var entries: Entry[]

type CoreEntry = {
  collection: string
  data: Object<string, any>
  title: string
  slug: string
  raw: string
  is_draft: boolean
  html: string
}

type Entry = CoreEntry & {
  date: Date
  path: string
}

type ChangelogEntry = CoreEntry & {
  version: string | null
  date?: Date
}
