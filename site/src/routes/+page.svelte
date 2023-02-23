<script>
  import { Changelog } from '$lib'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<svelte:head>
  <title>leblog • add a blog (or changelog) to any SvelteKit site</title>
</svelte:head>

<h2 class="relative flex items-center justify-center -mb-12">
  <div class="absolute h-px w-full bg-gray-100"></div>

  <div class="bg-white relative px-3 font-normal">changelog</div>
</h2>

<Changelog entries={ data.changelog} />