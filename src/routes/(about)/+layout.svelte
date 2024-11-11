<script lang="ts">
  import Header from "$lib/widgets/header.svelte";
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<Header />
<main>
  {@render children()}
</main>