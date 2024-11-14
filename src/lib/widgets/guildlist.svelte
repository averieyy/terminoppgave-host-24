<script lang="ts">
  import Icon from "./icon.svelte";
  import Popup from "./popup.svelte";
  import { shortHand } from "$lib/frontend/guild";

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
  {#each guilds as guild}
    <a
      class={`guild ${selectedid == guild.id ? 'selected' : ''}`}
      style={`background-color: ${selectedid == guild.id && guild.colour};`}
      title={guild.name}
      href={`/app/guild/${guild.id}`}>
      <span>
        {shortHand(guild.name)}
      </span>
    </a>
  {/each}
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

    
    &>a,button {
      width: 3rem;
      aspect-ratio: 1 / 1;
      border: none;
      border-radius: 1rem;
      background-color: var(--bg1);
      
      display: flex;
      justify-content: center;
      align-items: center;
      
      user-select: none;

      color: var(--fg1);
      text-decoration: none;
  
      &:hover, &:active, &.selected {
        color: var(--bg1);
        background-color: var(--lightblue);
      }
    }
  }
  .icon {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>