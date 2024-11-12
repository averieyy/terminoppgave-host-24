<script lang="ts">
  import Icon from "./icon.svelte";
  import Popup from "./popup.svelte";

  const { guilds, selectedid }: { guilds: { name: string, colour: string, id: number }[], selectedid?: number } = $props();

  let addpopupopen: boolean = $state(false);

  function shortHand(text: string): string {
    const words = text.split(' ');
    const initials = words.map(w => w[0]);

    if (initials.length == 1) return text.slice(0,2);
    return initials.slice(0,4).join('');
  }
</script>

<Popup open={addpopupopen} title="Add server" close={() => addpopupopen = false}>
  <div class="addguildpopup">
    <div>
      <span>Join a server</span>
      <Icon icon="arrow_forward" />
    </div>
    <div>
      <span>Create a server</span>
      <Icon icon="arrow_forward" />
    </div>
  </div>
</Popup>
<div class="guilds">
  {#each guilds as guild}
    <div class={`guild ${selectedid == guild.id ? 'selected' : ''}`} title={guild.name}>
      <span>
        {shortHand(guild.name)}
      </span>
    </div>
  {/each}
  <button type="button" onclick={() => addpopupopen = true}>
    <Icon icon='add'/>
  </button>
</div>

<style>
  .addguildpopup {
    width: 500px;
    display: flex;
    flex-direction: column;

    gap: 1rem;

    &>div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-radius: .5rem;
      background-color: var(--bg2);

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

    
    &>div,button {
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
  
      &:hover, &:active, &.selected {
        color: var(--bg1);
        background-color: var(--lightblue);
      }
    }
  }
</style>