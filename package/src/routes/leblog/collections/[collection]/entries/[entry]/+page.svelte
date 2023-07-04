<script>
  import { page } from '$app/stores'

  /** @type {import('./$types').PageData} */
  export let data

  $: entry = data.collections[$page.params.collection].find(entry => entry.slug === $page.params.entry)
</script>

<h2 class="text-3xl">{$page.params.entry}</h2>

<div class="w-full whitespace-pre mt-6 focus:outline-none border p-3 rounded" contenteditable>{entry.raw}
</div>