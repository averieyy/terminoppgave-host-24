<script lang="ts">
  const defaultColours: string[] = [
    '#81a1c1',
    '#5e81ac',
    '#8fbcbb',
    '#88c0d0',
    '#bf616a',
    '#d08770',
    '#ebcb8b',
    '#a3be8c',
    '#b48ead',
  ];

  const { changeColourCallback, colour }: { changeColourCallback: (colour: string) => void, colour?: string } = $props();

  let selectedColour: string = $state(colour || defaultColours[0]);

  $effect(() => {
    changeColourCallback(selectedColour);
  })
</script>

<div class="colourpicker">
  <div class="defaultcolours">
    {#each defaultColours as colour}
      <button type="button"
        aria-label={colour}
        onclick={() => selectedColour = colour}
        style={`background-color: ${colour};`}>
      </button>
    {/each}
  </div>
  <input type="text" bind:value={selectedColour} placeholder='#'>
</div>

<style>
  .colourpicker {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex: 1;
  }
  .defaultcolours {
    display: flex;
    flex-direction: row;
    gap: .5rem;
    justify-content: center;
    flex-wrap: wrap;

    & button {
      border: none;
      border-radius: .25rem;
      width: 2rem;
      aspect-ratio: 3 / 2;
      padding: 0;
    }
  }
  input {
    background-color: var(--bg1);
    border: none;
    color: var(--fg1);
    padding: .5rem;
  }
</style>