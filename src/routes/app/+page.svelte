<script lang="ts">
  import Guildlist from "$lib/widgets/guildlist.svelte";
    import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const { guilds } = data;
</script>

<div class="outerpage">
  <Guildlist guilds={guilds} />
  <main>
    <div class="infobox">
      <h2>
        Welcome to roundtalk!
      </h2>
      <p>
        You can join or create guilds by clicking on the "+" in the list to the right
      </p>
    </div>
  </main>
</div>

<svelte:head>
  <title>
    Roundtalk
  </title>
</svelte:head>

<style>
  .outerpage {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  main {
    background-color: var(--bg1);
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .5rem;

    & * {
      color: var(--bg3);
      font-style: italic;
      margin: 0;
      text-align: center;
    }
  }
  .infobox {
    width: 50%;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>