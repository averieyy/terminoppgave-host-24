<script lang="ts">
  import { goto } from "$app/navigation";
  import { isLight, shortHand } from "$lib/frontend/guild";
  import Guildlist from "$lib/widgets/guildlist.svelte";
  import Notice from "$lib/widgets/notice.svelte";
  import Channels from "$lib/widgets/settings/channels.svelte";
  import Guildprofile from "$lib/widgets/settings/guildprofile.svelte";
  import Invitations from "$lib/widgets/settings/invitations.svelte";
  import Members from "$lib/widgets/settings/members.svelte";
  import Toggle from "$lib/widgets/toggle.svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  let { guild, guildsettings, guilds, members, userid, bannedmembers, channels, invitations } = $state(data);
  
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

  async function leaveGuild() {
    const resp = await fetch('/api/guild/leave', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id
      })
    });
    if (resp.ok) goto('/app');
  }

  async function deleteGuild() {
    const resp = await fetch('/api/guild/delete', {
      method: 'DELETE',
      body: JSON.stringify({
        guildid: guild.id
      })
    });
    if (resp.ok) goto('/app');
  }
</script>

<svelte:head>
  <title>Settings for {guild.name} - Eris</title>
</svelte:head>

<main>
  <div class="outerguildlist">
    <Guildlist guilds={guilds} selectedid={guild.id} />
  </div>
  <div class="maincontent">
    <article class="innermaincontent">
      <h1>
        <a href="/app/guild/{guild.id}" title="Go back to {name}" class="gobackguild" style="background-color: {colour}; color: var(--{isLight(colour) ? 'bg1' : 'fg1'})">
          {shortHand(name || 'Go back')}
        </a>
        Settings for <span>{name || guild.name}</span>
      </h1>
      <Notice
        content="These settings will change how your guild is seen by, and how safe it will be for users."
      />
      <section>
        <h2>Guild profile</h2>
        <Guildprofile colour={colour} description={description} guild={guild} name={name}
          updatecolour={(c: string) => colour = c}
          updatename={(n: string) => name = n}
          updatedescription={(d: string) => description = d}
        />
      </section>
      <section>
        <h2>Settings</h2>
        <Toggle onchange={(value) => discoverable = value} start={guildsettings.discoverable} title="Discoverable"/>
      </section>
      <section>
        <h2>Members</h2>
        <Members guild={guild} banned={bannedmembers} memberlist={members} userid={userid}/>
      </section>
      <section>
        <h2>Channels</h2>
        <Channels channels={channels} guild={guild} />
      </section>
      <section>
        <h2>Invitations</h2>
        <Invitations guild={guild} invitations={invitations} />
      </section>
      <section>
        <h2>Danger</h2>
        <button class="danger" onclick={leaveGuild}>
          Leave
        </button>
        <button class="danger" onclick={deleteGuild}>
          Delete guild
        </button>
      </section>
    </article>
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
  @media screen and (max-width: 650px) {
    .outerguildlist {
      display: none;
    }
  }

  .outerguildlist {
    overflow: auto;
  }
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
    align-items: center;
    
    overflow-y: auto;
  }
  .innermaincontent {
    max-width: 32rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  h1, h2 {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;

    margin: 0;
    border-bottom: .2rem solid var(--lightblue);

    & span {
      color: var(--lightblue);
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
    position: fixed;
    padding: 1rem;
    bottom: 0;
    left: 4rem;
    width: calc(100% - 6rem);
    
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
  .gobackguild {
    margin-bottom: .25rem;
    width: 2rem;
    height: 2rem;
    text-decoration: none;
    font-size: .66rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .66rem;
    &:active, &:hover {
      background-color: var(--bg2) !important;
      color: var(--lightblue) !important;
    }
  }
</style>