<script lang="ts">
    import { goto, onNavigate } from "$app/navigation";
    import { isLight, shortHand } from "$lib/frontend/guild";
    import Colourpicker from "$lib/widgets/colourpicker.svelte";
  import Guildlist from "$lib/widgets/guildlist.svelte";
    import Toggle from "$lib/widgets/toggle.svelte";
import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  let { guild, guildsettings, guilds } = $state(data);
  
  let { name, colour, description } = $state(guild);
  let { discoverable } = $state(guildsettings);

  let unsavedChanges = $derived(
    name != guild.name ||
    colour != guild.colour ||
    description != guild.description ||
    discoverable != guildsettings.discoverable
  );

  async function save () {
    guild.colour = colour;
    guild.description = description;
    guild.name = name;
    guildsettings.discoverable = discoverable;

    await fetch('/api/guild/settings', {
      method: 'PUT',
      body: JSON.stringify({
        guildid: guild.id,
        guild,
        guildsettings
      })
    });
  }

  onNavigate(() => {
    if (unsavedChanges) {
      save();
    }
  });

  async function leaveGuild() {
    const resp = await fetch('/api/guild/leave', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id
      })
    });
    if (resp.ok) goto('/app');
  }
</script>

<main>
  <Guildlist guilds={guilds} selectedid={guild.id} />
  <div class="maincontent">
    <h1>Settings for <span>{name || guild.name}</span></h1>
    <section>
      <h2>Guild profile</h2>
      <div class="profileeditor">
        <div class="guildprofile">
          <input type="text" bind:value={name} placeholder="Name">
          <textarea bind:value={description}></textarea>
          <Colourpicker changeColourCallback={c => colour = c} />
        </div>
        <div class="outerpreview">
          <div class="preview" style={`background-color: ${colour}; color: ${isLight(colour) ? 'var(--bg1)' : 'var(--fg1)'};`}>
            <span>
              {shortHand(name || guild.name)}
            </span>
          </div>
        </div>
      </div>
    </section>
    <section>
      <h2>Settings</h2>
      <Toggle onchange={(value) => discoverable = value} start={guildsettings.discoverable} title="Discoverable"/>
    </section>
    <section>
      <h2>Danger</h2>
      <button class="danger" onclick={leaveGuild}>
        Leave
      </button>
    </section>
    <div class={`unsavedpopup ${unsavedChanges ? 'open' : 'closed'}`}>
      <div class="unsaved">
        <button onclick={save}>
          Save
        </button>
        <span>
          You have unsaved changes
        </span>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  .maincontent {
    flex: 1;
    background-color: var(--bg1);
    padding: 1rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    overflow: hidden;

    position: relative;
  }
  h1, h2 {
    margin: 0;
    border-bottom: .2rem solid var(--lightblue);

    & span {
      color: var(--lightblue);
    }
  }
  .guildprofile {
    flex: 1;
  }
  .profileeditor {
    background-color: var(--bg2);
    padding: 1rem;

    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .outerpreview {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .preview {
    width: 7.5rem;
    height: 7.5rem;

    overflow: hidden;

    border-radius: 2.5rem;
    background-color: var(--bg1);

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;

    user-select: none;
  }
  .guildprofile {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    &>input, &>textarea {
      background-color: var(--bg1);
      border: none;
      color: var(--fg1);
      padding: .5rem;
      resize: vertical;
      margin: 0;
    }
  }
  section {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  h2 {
    border-width: .125rem;
    margin: .5rem;
  }
  .unsavedpopup {
    position: absolute;
    padding: 1rem;
    bottom: 0;
    left: 0;
    width: calc(100% - 2rem);

    
    transition: translate .125s ease;
    
    &.open {
      translate: 0 0%;
    }

    &.closed {
      translate: 0 100%;
    }
  }
  .unsaved {
    background-color: var(--bg2);
    padding: 1rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;

    &>button {
      border: none;
      padding: .5rem;
      font: inherit;

      background-color: var(--bg1);
      color: var(--fg1);

      &:hover, &:active {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }
    &>span {
      flex: 1;
      text-align: center;
    }
  }
  .danger {
    padding: .5rem;
    background-color: var(--red);
    color: var(--fg1);
    border: none;
    font-weight: bold;

    &:hover, &:active {
      background-color: var(--bg2);
      color: var(--red);
    }
  }
</style>