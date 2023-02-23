<script>
  import { Changelog } from '$lib'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<div class="flex items-center flex-col">
  <h1 class="text-5xl"><em>leblog</em></h1>

  <p class="mt-0 text-lg">Add a blog (or changelog) to any SvelteKit site.</p>

  <ul class="flex !list-none !pl-0 font-header text-2xl !mt-0">
    <li><a href="https://github.com/nbgoodall/leblog" target="_blank" rel="noreferrer" class="no-underline border-b">Docs</a></li>
  </ul>
</div>


<div class="relative flex items-center justify-center -mb-6">
  <div class="absolute h-px w-full bg-gray-100"></div>

  <h2 class="bg-white relative px-3 m-0 font-normal">
    Changelog
  </h2>
</div>

<Changelog entries={ data.changelog} />

<div class="text-center">
  <small>Made with ❤️ by <a href="https://nbgoodall.com">nbgoodall</a></small>
</div>