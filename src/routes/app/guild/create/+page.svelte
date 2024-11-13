<script lang="ts">
  import { goto } from "$app/navigation";
  import { shortHand } from "$lib/frontend/guild";
  import Colourpicker from "$lib/widgets/colourpicker.svelte";


  let name: string = $state('');
  let description: string = $state('');
  let colour: string = $state('');
  let errorMessage = $state('');

  async function submit () {
    const response = await fetch('/api/guild/create', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        colour
      })
    });
    if (!response.ok) {
      errorMessage = (await response.json()).message || 'An error occured while trying to create guild';
      return;
    }
    else {
      const id = (await response.json()).id;
      goto(`/app/guild/${id}/`);
    }
  }

</script>

<div class="outerpage">
  <main>
    <div class="guildform">
      <h2>
        Create new guild
      </h2>
      <div class="innerguildform">
        {#if errorMessage}
          <span class="errormessage">
            {errorMessage}
          </span>
        {/if}
        <input type="text" placeholder="Name" bind:value={name}>
        <textarea bind:value={description} placeholder="Description"></textarea>
        <div class="coloursection">
          <Colourpicker changeColourCallback={c => colour = c}/>
          <div class="preview" style={`background-color: ${colour};`}>
            <span>
              {shortHand(name)}
            </span>
          </div>
        </div>
      </div>
      <button disabled={!name} onclick={submit}>Create guild</button>
    </div>
  </main>
</div>

<style>
  main {
    display: flex;
    flex-direction: column;
    max-width: 500px;
    width: 100%;
    background-color: var(--bg2);
  }
  .outerpage {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 2rem;
    padding-right: 2rem;
    height: 100%;

    background-color: var(--bg1);
  }
  .guildform {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;

    & * {
      margin: 0;
    }
  }
  .innerguildform {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  input, button, textarea {
    border: none;
    background-color: var(--bg1);
    padding: .5rem;
    color: var(--fg1);
  }

  textarea {
    resize: vertical;
  }
  button {
    background-color: var(--bg3);

    &:disabled {
      font-style: italic;
      background-color: var(--bg1);
      color: var(--bg4);
    }
  }
  .coloursection {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
  }
  .preview {
    background-color: var(--bg1);
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;

    color: var(--bg1);

    user-select: none;
  }
  .errormessage {
    color: var(--red);
  }
</style>