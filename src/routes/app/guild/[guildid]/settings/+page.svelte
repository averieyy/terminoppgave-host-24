<script lang="ts">
  import { goto } from "$app/navigation";
  import { isLight, shortHand } from "$lib/frontend/guild";
  import Colourpicker from "$lib/widgets/colourpicker.svelte";
  import Guildlist from "$lib/widgets/guildlist.svelte";
  import Icon from "$lib/widgets/icon.svelte";
  import Popup from "$lib/widgets/popup.svelte";
  import Toggle from "$lib/widgets/toggle.svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  let { guild, guildsettings, guilds, members, userid, bannedmembers, channels } = $state(data);
  
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
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id
      })
    });
    if (resp.ok) goto('/app');
  }

  async function toggleAdmin (userid: number, admin: boolean) {
    const oldmembers = $state.snapshot(members);
    members = members.map(m => {return {...m, administrator: m.id == userid ? !admin : m.administrator}});
    const resp = await fetch(admin ? '/api/guild/demote' : '/api/guild/promote', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        memberid: userid
      })
    });
    if (!resp.ok) {
      // Revert back
      members = oldmembers;
    }
  }

  async function kickUser (userid: number) {
    const oldmembers = $state.snapshot(members);
    const memberindex = members.findIndex(m => m.id == userid);
    members = members.toSpliced(memberindex,1);
    const resp = await fetch('/api/guild/kick', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        userid
      })
    });
    if (!resp.ok) {
      members = oldmembers;
    }
  }

  async function banUser (userid: number) {
    const oldmembers = $state.snapshot(members);
    const oldbannedmembers = $state.snapshot(bannedmembers);
    const memberindex = members.findIndex(m => m.id == userid);
    const user = members.find(m => m.id == userid);
    if (!user || memberindex == -1) return;
    members = members.toSpliced(memberindex,1);
    bannedmembers.push(user);
    const resp = await fetch('/api/guild/ban', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        userid
      })
    });
    if (!resp.ok) {
      members = oldmembers;
      bannedmembers = oldbannedmembers;
    }
  }

  async function unbanUser (userid: number) {
    const oldmembers = $state.snapshot(members);
    const userindex = bannedmembers.findIndex(b => b.id == userid);
    if (userindex === -1) return;
    bannedmembers = bannedmembers.toSpliced(userindex, 1);
    const resp = await fetch('/api/guild/unban', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        userid
      })
    });
    if (!resp.ok) {
      members = oldmembers;
    }
  }
  
  // Channel logic
  let createChannelPopupOpen: boolean = $state(false);
  let newchannelname: string = $state('');

  function createChannel () {

  }

  function deleteChannel (channelid: number) {

  }
</script>

<svelte:head>
  <title>Settings for {guild.name} - Eris</title>
</svelte:head>

<Popup title="Create channel" open={createChannelPopupOpen} close={() => createChannelPopupOpen = false}>
  <form class="createchannelform" onsubmit={createChannel}>
    <input type="text" bind:value={newchannelname}>
    <input type="submit" value="Create channel">
  </form>
</Popup>
<main>
  <div class="outerguildlist">
    <Guildlist guilds={guilds} selectedid={guild.id} />
  </div>
  <div class="maincontent">
    <h1>
      <a href="/app/guild/{guild.id}" title="Go back to {guild.name}" class="gobackguild" style="background-color: {guild?.colour}; color: var(--{isLight(guild?.colour) ? 'bg1' : 'fg1'})">
        {shortHand(guild?.name || 'Go back')}
      </a>
      Settings for <span>{name || guild.name}</span>
    </h1>
    <section>
      <h2>Guild profile</h2>
      <div class="profileeditor">
        <div class="guildprofile">
          <input type="text" bind:value={name} placeholder="Name">
          <textarea bind:value={description}></textarea>
          <Colourpicker colour={colour} changeColourCallback={c => colour = c} />
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
      <h2>Members</h2>
      <div class="memberslist">
        {#each members as member}
          <div class="memberentry">
            {member.username}
            <div class="membereditbuttons">
              {#if !member.administrator}
                <button class="membereditbutton" onclick={() => kickUser(member.id)} title="Kick member">
                  <Icon icon="person_remove"/>
                </button>
                <button class="membereditbutton" onclick={() => banUser(member.id)} title="Ban member">
                  <Icon icon="block"/>
                </button>
                <button class="membereditbutton" onclick={() => toggleAdmin(member.id, false)} title="Promote member">
                  <Icon icon="add_moderator"/>
                </button>
              {:else if member.id !== userid}
                <button class="membereditbutton" onclick={() => toggleAdmin(member.id, true)} title="Demote member">
                  <Icon icon="remove_moderator"/>
                </button>  
              {/if}
            </div>
          </div>
        {/each}
      </div>
      {#if bannedmembers.length !== 0}
        <h3>Banned members</h3>
        <div class="memberslist">
          {#each bannedmembers as member}
            <div class="memberentry">
              {member.username}
              <div class="membereditbuttons">
                <button class="membereditbutton" onclick={() => unbanUser(member.id)} title="Unban member">
                  <Icon icon="person_add"/>
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>
    <section>
      <h2>Channels</h2>
      <div class="channels">
        {#each channels as channel}
          <div class="channellistentry">
            <span class="channelname">
              #{channel.name}
            </span>
            <div class="channeloptions">
              <button class="deletechannel" onclick={() => deleteChannel(channel.id)} title="Delete channel">
                <Icon icon="delete" />
              </button>
            </div>
          </div>
        {/each}
        <button class="channellistentry createchannel" onclick={() => createChannelPopupOpen = true} title="Create channel">
          <Icon icon="add" />
        </button>
      </div>
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
  @media screen and (max-width: 560px) {
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
    gap: 1rem;

    overflow-y: auto;
  }
  h1, h2, h3 {
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
  h3 {
    border-width: .1rem;
    margin: .375rem;
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
  .memberslist {
    display: flex;
    flex-direction: column;

    &>* {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: .5rem;
      height: 2rem;
    }

    &>:nth-child(odd) {
      background-color: var(--bg2);
    }
    &>:nth-child(even) {
      background-color: var(--bg3);
    }
  }
  .membereditbuttons {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
  .membereditbutton {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;
    
    border: none;
    background-color: var(--bg1);
    border-radius: .25rem;
    color: var(--fg1);

    font-size: 1.5rem;

    &:active, &:hover {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  .gobackguild {
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
  .channels {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .channellistentry {
    padding: .5rem;
    background-color: var(--bg2);
    height: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .channeloptions {
    display: flex;
    flex-direction: row;
    gap: .5rem;

    &>* {
      background-color: var(--bg1);
      border: none;
      height: 2rem;
      width: 2rem;
      color: var(--fg1);
      font-size: 1.5rem;
    }
  }
  .deletechannel {
    &:active, &:hover {
      background-color: var(--red);
      color: var(--bg1);
    }
  }
  .createchannel {
    box-sizing: content-box;
    border: none;
    padding: .5rem;
    color: var(--fg1);
    justify-content: center;

    font-size: 1.5rem;

    &:active, &:hover {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
</style>