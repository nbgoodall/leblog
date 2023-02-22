<script>
  import SvelteMarkdown from 'svelte-markdown'

  /** @type {Entry} */
  export let entry
</script>

<SvelteMarkdown source={ entry.raw } />
