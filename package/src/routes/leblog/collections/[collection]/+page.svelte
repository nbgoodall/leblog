<script>
  import { page } from '$app/stores'
  /** @type {import('./$types').PageData} */
  export let data

  $: entries = data.collections[$page.params.collection]
</script>

<h2 class="text-3xl">{$page.params.collection}</h2>


<ul role="list" class="divide-y divide-gray-200 mt-3 max-w-2xl">
  {#each entries as entry }
    <li class="py-4">
      <a href="/leblog/collections/{$page.params.collection}/entries/{entry.slug}">
      <h3 class="text-xl">{entry.title}</h3>

      <p class="text-gray-600 text-sm mt-2">{entry.raw.slice(0, 150)}&hellip;</p>
    </a>
    </li>
  {/each}
</ul>