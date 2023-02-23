<script>
  import { Entry } from 'leblog/entry'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<svelte:head>
  <title>{ data.entry.title } • leblog</title>
</svelte:head>

<article>
  <h2 class="text-4xl flex justify-between items-center">
    <span class="border-b border-transparent">{ data.entry.title }</span>

    <span class="text-gray-400 text-2xl font-light">{ new Date(data.entry.date).toDateString().toLowerCase() }</span>
  </h2>

  <Entry entry={data.entry} />
</article>