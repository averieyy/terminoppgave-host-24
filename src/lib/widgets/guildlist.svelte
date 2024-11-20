<script lang="ts">
  import Icon from "./icon.svelte";
  import Popup from "./popup.svelte";
  import { isLight, shortHand } from "$lib/frontend/guild";

  const { guilds, selectedid }: { guilds: { name: string, colour: string, id: number }[], selectedid?: number } = $props();

  let addpopupopen: boolean = $state(false);
</script>

<Popup open={addpopupopen} title="Add guild" close={() => addpopupopen = false}>
  <div class="addguildpopup">
    <a href="/app">
      <span>Join a guild</span>
      <div class="icon">
        <Icon icon="arrow_forward" />
      </div>
    </a>
    <a href="/app/guild/create">
      <span>Create a guild</span>
      <div class="icon">
        <Icon icon="arrow_forward" />
      </div>
    </a>
  </div>
</Popup>
<div class="guilds">
  <a href="/app" class={`homebutton ${selectedid == -2 && 'selected'}`}>
    <Icon icon="home"/>
  </a>
  {#each guilds as guild}
    <a
      class={`guild ${selectedid == guild.id ? 'selected' : ''}`}
      style={`background-color: ${guild.colour}; color: ${isLight(guild.colour) ? 'var(--bg1)' : 'var(--fg1)'};`}
      title={guild.name}
      href={`/app/guild/${guild.id}`}>
      <span>
        {shortHand(guild.name)}
      </span>
    </a>
  {/each}
  <a href="/app/guild/discover" class={selectedid == -1 ? 'selected' : ''} style="background-color: var(--lightblue); color: var(--bg1);">
    <div class="icon">
      <Icon icon='explore'/>
    </div>
  </a>
  <button type="button" onclick={() => addpopupopen = true}>
    <div class="icon">
      <Icon icon='add'/>
    </div>
  </button>
</div>

<style>
  .addguildpopup {
    width: 500px;
    display: flex;
    flex-direction: column;

    gap: 1rem;

    &>a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-radius: .5rem;
      background-color: var(--bg2);

      /* Cuz <a> tag */
      color: inherit;
      text-decoration: none;

      &:active, &:hover {
        background-color: var(--lightblue);
        color: var(--bg1);
      }

      user-select: none;
    }
  }
  .guilds {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: .5rem;
    background-color: var(--bg2);

    &>button {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
    
    &>a,button {
      width: 3rem;
      aspect-ratio: 1 / 1;
      border: none;
      border-radius: 1rem;
      
      display: flex;
      justify-content: center;
      align-items: center;
      
      user-select: none;
      cursor: pointer;

      text-decoration: none;
  
      &:not(:hover, :active, .selected) {
        background-color: var(--bg1) !important;
        color: var(--fg1) !important;
      }
    }
  }
  .icon {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .homebutton {
    background-color: var(--lightblue);
    color: var(--bg1);
    font-size: 1.5rem;
  }
</style>