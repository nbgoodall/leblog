<script>
  import { Entry } from 'leblog'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<svelte:head>
  <title>{ data.entry.title } • leblog</title>
</svelte:head>

<article>
  <h2 class="text-4xl flex justify-between items-center">
    <span class="border-b border-transparent">{ data.entry.title }</span>

    <span class="text-gray-400 text-2xl font-light"
      >{ new Date(data.entry.date).toDateString().toLowerCase() }</span
    >
  </h2>

  {#if data.entry.data.categories.length}
  <ul class="flex list-none pl-0 space-x-2">
    {#each data.entry.data.categories as category}
    <li class="bg-gray-100 rounded-full px-2.5">{category}</li>
    {/each}
  </ul>
  {/if}

  <Entry entry="{data.entry}" />
</article>
