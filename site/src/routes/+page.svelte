<script>
  import { Changelog } from '$lib'

  /** @type {import('./$types').PageData} */
  export let data
</script>


<div class="relative flex items-center justify-center -mb-6">
  <div class="absolute h-px w-full bg-gray-100"></div>

  <h2 class="bg-white relative px-3 m-0 font-normal">
    Changelog
  </h2>
</div>

<Changelog entries={ data.changelog} />