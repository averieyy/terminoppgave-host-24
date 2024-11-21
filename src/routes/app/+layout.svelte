<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  const { children, data } = $props();
  const { loggedin } = data;

  let stream: EventSource;

  onMount(() => {
    stream = new EventSource('/api/online');
  });

  onDestroy(() => {
    if (stream)
      stream.close();
  })
</script>

{@render children()}