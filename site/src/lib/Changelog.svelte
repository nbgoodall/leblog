<script>
  import { Entry } from 'leblog/entry'

  /** @type {import('leblog').Entry[]} */
  export let entries = []
</script>

<ul class="!list-none !pl-0">
  {#each entries as entry}
    <li class="!pl-0">
      <h2 class="text-4xl flex justify-between items-center">
        <span>{ entry.version }</span>

        <span class="text-gray-400 text-2xl font-light">{ new Date(entry.date).toDateString().toLowerCase() }</span>
      </h2>

      <Entry {entry} />
    </li>
  {/each}
</ul>