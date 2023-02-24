<script>
  import { Changelog } from '$lib'

  /** @type {import('./$types').PageData} */
  export let data

  let write_text = `---
title: my epic post
---

the title says it all`

  let load_text = `export { load } from 'leblog'`

  let render_text = `<script>
  import { Entry } from 'leblog'

  /** @type {import('./$types').PageData} */
  export let data
<\/script>

<ul>
  {#each data.posts as entry}
    <li>
      <h2>{entry.title}</h2>

      <Entry {entry} />
    </li>
  {/each}
</ul>`
</script>

<svelte:head>
  <title>leblog • add a blog (or changelog) to any SvelteKit site</title>
</svelte:head>

<p>leblog is made to quickly add a blog (or blog<em>s</em>) to new and existing SvelteKit sites.</p>

<p>Its raison d'être is that I (<a href="https://nbgoodall.com" target="_blank" rel="noreferrer">Nick</a>) wanted to keep changelogs for my SvelteKit projects without the fanfare of signing up for something or adding boilerplate.</p>

<p>It is not:</p>

<ul>
  <li>A fully-featured CMS like Strapi, Ghost or Tina.</li>
  <li>A replacement for Substack.</li>
</ul>

<h2>quick start</h2>

<pre>npm install leblog</pre>

<h3>1. write</h3>

<p>In <code>src/posts</code> write markdown files with <code>yyyy-mm-dd-{"{"}slug{"}"}.md</code>-formatted filenames.</p>

<pre>{ write_text }</pre>

<h3>2. load</h3>

<p>In <code>+page.server.js</code>:</p>

<pre>{ load_text }</pre>

<h3>3. render</h3>

<p>In its sibling <code>+page.svelte</code>:</p>

<pre>{ render_text }</pre>

<p>Et voila! Full documentation is on <a href="https://github.com/nbgoodall/leblog" target="_blank" rel="noreferrer">github</a>, and you can see it in action on the <a href="/blog">demo page</a>. Single-file changelogs also work, like this one (<a href="https://github.com/nbgoodall/leblog/blob/main/package/CHANGELOG.md" target="_blank" rel="noreferrer">source</a>):</p>


<h2 class="relative flex items-center justify-center -mb-12">
  <div class="absolute h-px w-full bg-gray-100"></div>

  <div class="bg-white relative px-3 font-normal">changelog</div>
</h2>

<Changelog entries={ data.changelog} />