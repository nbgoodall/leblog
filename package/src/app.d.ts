// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
type CoreEntry = {
	collection: string
	data: Object<string, any>
	title: string
	slug: string
	raw: string
	is_draft: boolean
	html: string
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	type RequireAtLeastOne<T> = {
		[K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
	}[keyof T]

	type Entry = CoreEntry & {
		date: Date
		path: string
	}

	type ChangelogEntry = CoreEntry & {
		version: string | null
		date?: Date
	}
}

export { Entry }
