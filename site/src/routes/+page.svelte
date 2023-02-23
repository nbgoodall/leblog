<script>
  import { Changelog } from '$lib'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<div class="flex items-center flex-col">
  <h1 class="text-5xl"><em>leblog</em></h1>

  <p class="mt-0 text-lg">Add a blog (or changelog) to any SvelteKit site.</p>
</div>


<div class="relative flex items-center justify-center">
  <div class="absolute h-px w-full bg-gray-100"></div>

  <h2 class="bg-white relative px-3 m-0 font-normal">Changelog</h2>
</div>

<Changelog entries={ data.changelog} />
