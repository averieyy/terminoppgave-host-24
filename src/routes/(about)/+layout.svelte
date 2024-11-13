<script lang="ts">
  import Header from "$lib/widgets/header.svelte";
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<div class="body">
  <Header />
  <main>
    {@render children()}
  </main>
</div>

<style>
  .body {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  main {
    background-color: var(--bg1);
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>