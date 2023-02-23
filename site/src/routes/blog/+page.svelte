<script>
  import { Entry } from 'leblog'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<ul class="!list-none !pl-0">
  {#each data.posts as entry}
    <li class="!pl-0">
      <h2 class="text-4xl flex justify-between items-center">
        <span>{ entry.title }</span>

        <span class="text-gray-400 text-2xl font-light">{ new Date(entry.date).toDateString() }</span>
      </h2>

      <Entry {entry} />
    </li>
  {/each}
</ul>