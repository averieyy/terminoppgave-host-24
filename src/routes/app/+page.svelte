<script lang="ts">
  import Guildlist from "$lib/widgets/guildlist.svelte";
    import Logo from "$lib/widgets/logo.svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  const { guilds } = data;
</script>

<div class="outerpage">
  <Guildlist guilds={guilds} selectedid={-2} />
  <main>
    <div class="logo">
      <Logo width={100} height={100}/>
    </div>
    <div class="infobox">
      <h2>
        Welcome to Eris!
      </h2>
      <p>
        You can join or create guilds by clicking on the "+" in the list to the right
      </p>
    </div>
  </main>
</div>

<svelte:head>
  <title>
    Eris
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
  .logo {
    fill: var(--bg4);
  }
</style>