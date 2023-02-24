<script>
  import { page } from '$app/stores'

  const links = [
    {
      url: '/',
      title: 'home'
    },
    {
      url: '/blog',
      title: 'demo'
    },
    {
      url: 'https://github.com/nbgoodall/leblog',
      title: 'docs',
      target: "_blank"
    }
  ]
</script>

<div class="flex items-center flex-col">
  <h1 class="text-5xl"><em>leblog</em></h1>

  <p class="mt-0 text-lg">add a blog (or changelog) to any SvelteKit site</p>

  <ul class="flex !list-none !pl-0 font-header text-2xl !mt-0 space-x-6">
    {#each links as link}
      {@const is_active = link.url === $page.url.pathname || ($page.url.pathname.startsWith(link.url) && link.url !== '/') }

      <li class="flex items-center space-x-1">
        <a
          data-sveltekit-noscroll
          target={ link.target }
          class:!decoration-black={ is_active }
          href={ link.url }
        >{ link.title }</a>
      </li>
    {/each}
  </ul>
</div>

<style lang="postcss">
  li a {
    @apply decoration-gray-100 underline-offset-8;
  }

  li a:hover {
    @apply decoration-black underline;
  }
</style>