<script lang="ts">
  import Header from "$lib/widgets/header.svelte";
  import type { Snippet } from "svelte";
    import type { LayoutData } from "./$types";

  const { children, data }: { children: Snippet, data: LayoutData } = $props();
  const { loggedin } = data;
</script>

<div class="body">
  <Header loggedin />
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