<script>
  import { page } from '$app/stores'

  const links = [
    {
      url: '/',
      title: 'Home'
    },
    {
      url: '/blog',
      title: 'Demo'
    },
    {
      url: 'https://github.com/nbgoodall/leblog',
      title: 'Docs',
      target: "_blank"
    }
  ]
</script>

<div class="flex items-center flex-col">
  <h1 class="text-5xl"><em>leblog</em></h1>

  <p class="mt-0 text-lg">Add a blog (or changelog) to any SvelteKit site.</p>

  <ul class="flex !list-none !pl-0 font-header text-2xl !mt-0 space-x-6">
    {#each links as link}
      {@const is_active = link.url === $page.url.pathname }

      <li class="flex items-center space-x-1">
        <a
          data-sveltekit-noscroll
          target={ link.target }
          class:!border-black={ is_active }
          href={ link.url }
        >{ link.title }</a>

        {#if link.target === "_blank"}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-400"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style lang="postcss">
  li a {
    @apply no-underline border-b border-gray-100 transition-colors;
  }

  li a:hover {
    @apply border-black;
  }
</style>