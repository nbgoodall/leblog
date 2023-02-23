<script>
  import { Changelog } from '$lib'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<h2 class="relative flex items-center justify-center -mb-12">
  <div class="absolute h-px w-full bg-gray-100"></div>

  <!-- <h2 class="bg-white relative px-3 mb-0 font-normal"> -->
    <div class="bg-white relative px-3 font-normal">Changelog</div>
  <!-- </h2> -->
</h2>

<Changelog entries={ data.changelog} />