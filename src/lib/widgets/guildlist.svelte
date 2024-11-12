<script lang="ts">
  import Icon from "./icon.svelte";

  const { guilds, selectedid }: { guilds: { name: string, colour: string, id: number }[], selectedid?: number } = $props();

  function shortHand(text: string): string {
    const words = text.split(' ');
    const initials = words.map(w => w[0]);

    if (initials.length == 1) return text.slice(0,2);
    return initials.slice(0,4).join('');
  }
</script>

<div class="guilds">
  {#each guilds as guild}
    <div class={`guild ${selectedid == guild.id ? 'selected' : ''}`} title={guild.name}>
      <span>
        {shortHand(guild.name)}
      </span>
    </div>
  {/each}
  <div>
    <Icon icon='add'/>
  </div>
</div>

<style>
  .guilds {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: .5rem;
    background-color: var(--bg2);

    
    &>div {
      width: 3rem;
      aspect-ratio: 1 / 1;
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