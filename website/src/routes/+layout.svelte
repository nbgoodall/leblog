<script>
  import '../app.css'

  import { Header, Footer } from '$lib'
  import { Transition } from 'slender-ui'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<div class="flex flex-col mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-12 pb-6 prose">
  <Header />

  <Transition
    key={ data.url }
    from={{ y: 5, duration: 150, delay: 150 }}
    to={{ y: -5, duration: 150 }}
  >
    <slot />
  </Transition>

  <Footer />
</div>

<style lang="postcss">
  :global(.slender-transition > div) {
    @apply !max-h-full !h-auto;
  }
</style>