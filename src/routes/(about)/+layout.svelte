<script>
  import Header from "$lib/widgets/header.svelte";

  const { children } = $props();
</script>

<Header />
<main>
  {@render children()}
</main>