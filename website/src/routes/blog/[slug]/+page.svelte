<script>
  import { page } from '$app/stores'

  import { load } from 'leblog'

  const entry = load(`posts/${$page.params.slug}`)
</script>

<svelte:head>
  <title>{ entry.title } • leblog</title>
</svelte:head>

<article>
  <h2 class="text-4xl flex justify-between items-center">
    <span class="border-b border-transparent">{ entry.title }</span>

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

  {@html entry.html}
</article>

