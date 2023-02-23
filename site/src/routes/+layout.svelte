<script>
  import '../app.css'

  import { Header, Footer } from '$lib'
</script>

<div class="flex flex-col mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-12 pb-6 prose min-h-screen">
  <Header />

  <div class="flex-1">
    <slot />
  </div>

  <Footer />
</div>
