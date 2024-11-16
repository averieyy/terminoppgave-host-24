<script lang="ts">
  import { goto } from "$app/navigation";
    import { isLight, shortHand } from "$lib/frontend/guild.js";
  import Guildlist from "$lib/widgets/guildlist.svelte";

  const { data } = $props();
  const { guilds, discoverableguilds } = $state(data);

  async function join (guildid: number) {
    const resp = await fetch('/api/guild/join/discovery', {
      method: 'POST',
      body: JSON.stringify({
        guildid
      })
    });
    if (resp.ok) goto(`/app/guild/${guildid}`);
  }
</script>

<svelte:head>
  <title>Discover - Roundtalk</title>
</svelte:head>
<div class="outerpage">
  <Guildlist guilds={guilds} selectedid={-1}/>
  <main>
    <h1>
      Discover guilds
    </h1>
    <div class="guilds">
      {#if discoverableguilds.length != 0}
        {#each discoverableguilds as guild}
          <div class="guild">
            <div class="outerpreview">
              <div class="preview" style={`background-color: ${guild.colour}; color: ${isLight(guild.colour) ? 'var(--bg1)' : 'var(--fg1)'}`}>
                <span>{shortHand(guild.name)}</span>
              </div>
            </div>
            <div class="aboutguild">
              <h2>{guild.name}</h2>
              <p>{guild.description}</p>
              <button onclick={() => join(guild.id)}>Join guild</button>
            </div>
          </div>
        {/each}
      {:else}
        <span class="noguilds">No discoverable guilds</span>
      {/if}
    </div>
  </main>
</div>

<style>
  .outerpage {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  main {
    flex: 1;
    background-color: var(--bg1);
    padding: 1rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .guilds {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  .guild {
    display: flex;
    flex-direction: row;
    padding: 1rem;
    background-color: var(--bg2);
    max-width: 500px;
    gap: 1rem;
  }
  .aboutguild {
    flex: 1;

    display: flex;
    flex-direction: column;
    
    & button {
      background-color: var(--bg1);
      border: none;
      padding: .5rem;
      color: var(--fg1);

      &:hover, &:active {
        background-color: var(--green);
        color: var(--bg1);
      }
    }
  }
  .outerpreview {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .preview {
    width: 6rem;
    height: 6rem;
    background-color: var(--bg1);
    border-radius: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 2rem;
    user-select: none;
  }
  h1, h2 {
    margin: 0;
  }
  .noguilds {
    text-align: center;
    font-style: italic;
    color: var(--fg3);
    padding: 1rem;
  }
</style>