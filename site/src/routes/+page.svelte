<script>
  import { Entry } from 'leblog'
  /** @type {import('./$types').PageData} */
  export let data

  // console.log('hello', data)
</script>

<h1>leblog</h1>

<ul class="!list-none !pl-0">
  {#each data.changelog as entry}
    <li class="!pl-0">
      <h2 class="text-4xl">
        <!-- <a href="/{ post.slug }" class="no-underline" data-sveltekit-noscroll>{ post.title }</a> -->
      </h2>

      <Entry {entry} />
    </li>

{/each}

</ul>