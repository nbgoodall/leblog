import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import leblog from 'leblog'

export default defineConfig({
	plugins: [leblog(), sveltekit()]
})
