<script lang="ts">
    import type { Snippet } from "svelte";
    import Icon from "./icon.svelte";

  const { question, children }: { question: string, children: Snippet } = $props();

  let open: boolean = $state(false);
</script>

<div class={`mainq ${open ? 'open' : 'closed'}`}>
  <button class="header" onclick={() => open = !open}>
    <h3>
      {question}
    </h3>
    <div class="icon">
      <Icon icon="chevron_right"/>
    </div>
  </button>
  <div class="body">
    {@render children()}
  </div>
</div>

<style>
  .header, .body {
    padding: 1rem;
    border-radius: .75rem;
    display: flex;
    
    /* Cuz button */
    border: none;
    color: var(--fg1);
  }
  .header {
    background-color: var(--bg4);

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .body {
    flex-direction: column;
    gap: .5rem;
  }
  .closed>.body {
    display: none;
  }
  .mainq {
    background-color: var(--bg3);
    border-radius: .75rem;
    display: flex;
    flex-direction: column;
  }
  h3 {
    margin: 0;
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: rotate .125s ease;
    font-size: 1.5rem;
  }
  .open .icon {
    rotate: 90deg;
  }
  .closed .icon {
    rotate: 0deg;
  }
</style>