<script>
  import { load } from 'leblog'

  const posts = load('posts')
</script>

<svelte:head>
  <title>demo blog • leblog</title>
</svelte:head>

<p>
  Welcome to le demo. This is a collection of posts in the
  <code
    ><a
      href="https://github.com/nbgoodall/leblog/blob/main/website/src/posts"
      target="_blank"
      rel="noreferrer"
      >src/posts</a
    ></code
  >
  folder, and it comes with its very own <a href="/blog.atom" target="_blank">Atom feed</a> (RSS and
  JSON also work).!
</p>

<ul class="!list-none !pl-0">
  {#each posts as entry}
    <li class="!pl-0">
      <h2 class="text-4xl flex justify-between items-center">
        <a
          href="/blog/{ entry.path }"
          class="!no-underline font-bold border-b border-transparent hover:border-black transition-colors"
          data-sveltekit-noscroll
          >{ entry.title }</a
        >

        <span class="text-gray-400 text-2xl font-light"
          >{ new Date(entry.date).toDateString().toLowerCase() }</span
        >
      </h2>

      {#if entry.data.categories.length}
      <ul class="flex list-none pl-0 space-x-2">
        {#each entry.data.categories as category}
        <li class="bg-gray-100 rounded-full px-2.5">{category}</li>
        {/each}
      </ul>
      {/if} {@html entry.html}
    </li>
  {/each}
</ul>
