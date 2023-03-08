<script>
  import { Entry } from 'leblog'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<svelte:head>
  <title>demo blog • leblog</title>
</svelte:head>

<ul class="!list-none !pl-0">
  {#each data.posts as entry}
  <li class="!pl-0">
    <h2 class="text-4xl flex justify-between items-center">
      <a
        href="/blog/{ entry.slug }"
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
    {/if}

    <Entry {entry} />
  </li>
  {/each}
</ul>
