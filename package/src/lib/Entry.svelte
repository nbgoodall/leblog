<script>
  import SvelteMarkdown from 'svelte-markdown'

  /** @type {Entry} */
  export let entry

  $: console.log('hey', entry.html)
</script>

{@html entry.html}
