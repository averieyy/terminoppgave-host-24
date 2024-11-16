<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Guildlist from '$lib/widgets/guildlist.svelte';
  import Icon from '$lib/widgets/icon.svelte';
  import Memberlist from '$lib/widgets/memberlist.svelte';
  import Popup from '$lib/widgets/popup.svelte';

  const { data } = $props();

  const { guild, guilds, admin, channels, members } = $derived(data); // To make it so that you can go from one guild page to another. <https://github.com/sveltejs/kit/issues/1497>

  let createChannelPopupOpen: boolean = $state(false);
  let createInvitePopupOpen: boolean = $state(false);

  let newchannelname: string = $state('');
  let newchannelerror: string = $state('');

  let inviteUUID: string = $state('');

  async function createChannel () {
    const response = await fetch('/api/channel/create', {
      method: 'POST',
      body: JSON.stringify({
        name: newchannelname,
        guildid: guild.id
      })
    });

    if (!response.ok) {
      newchannelerror = (await response.json()).message || 'An error occured while trying to create channel.';
    }
    else {
      const { id } = await response.json();

      goto(`/app/channel/${id}`);
    }
  }

  async function createInvitation() {
    if (!admin) return;

    const response = await fetch('/api/guild/invite', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id
      })
    });

    if (!response.ok) {

    }
    else {
      inviteUUID = (await response.json()).uuid;
      createInvitePopupOpen = true;
    }
  }
</script>

{#if admin}
  <Popup title="Create channel" open={createChannelPopupOpen} close={() => createChannelPopupOpen = false}>
    <form class="createchannelform" onsubmit={createChannel}>
      <input type="text" bind:value={newchannelname}>
      <input type="submit" value="Create channel">
    </form>
  </Popup>
  <Popup title="New invitation" open={createInvitePopupOpen} close={() => createInvitePopupOpen = false}>
    <div class="newinvite">
      <span>This is your sparkling new invite link. Share it with your friends to invite them.</span>
      <code>{$page.url.origin}/app/invite/{inviteUUID}</code>
    </div>
  </Popup>
{/if}
<div class="outerpage">
  <Guildlist guilds={guilds} selectedid={guild.id} />
  <main>
    <div class="header">
      <h1>
        {guild.name}
      </h1>
      {#if admin}
        <div class="adminbar">
          <button onclick={createInvitation}>
            Create invitation link
          </button>
          <a href={`/app/guild/${guild.id}/settings`}>
            <Icon icon="settings"/>
          </a>
        </div>
      {/if}
    </div>
    <div class="maincontent">
      <div class="channellist">
        <h2>Channels</h2>
        {#each channels as channel}
          <a class="channelcard" href={`/app/channel/${channel.id}/`}>
            <span>#{channel.name}</span>
            <div class="icon">
              <Icon icon='arrow_forward'/>
            </div>
          </a>
        {/each}
        {#if admin}
          <button class="channelcard" onclick={() => createChannelPopupOpen = true}>
            <span>Create new channel</span>
            <div class="icon">
              <Icon icon='add'/>
            </div>
          </button>
        {/if}
      </div>
    </div>
  </main>
  <Memberlist members={members} />
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
    display: flex;
    flex-direction: column;
  }
  .header {
    padding: 1rem;
    height: 2rem;

    background-color: var(--bg2);

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;


    & h1 {
      margin: 0;
      font-size: 1.5rem;
    }
  }
  .adminbar {
    display: flex;
    flex-direction: row;
    gap: .5rem;

    & a {
      color: var(--fg1);
      background-color: var(--bg1);
      
      text-decoration: none;
      font-size: 1.25rem;
      
      width: 2rem;
      height: 2rem;
      
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover, &:active {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }
    & button {
      border: none;
      background-color: var(--bg1);
      color: var(--fg1);
      padding: .5rem;

      &:active, &:hover {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }
  }
  .maincontent {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
  .channellist {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    width: 100%;
    gap: .5rem;
  }
  .channelcard {
    padding: 1rem;
    border-radius: .75rem;
    background-color: var(--bg2);

    color: inherit;
    text-decoration: none;
    
    border: none;
    
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    &:hover, &:active {
      color: var(--bg1);
      background-color: var(--lightblue);
    }
  }
  .createchannelform {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    & * {
      padding: .5rem;
      border: none;
      background-color: var(--bg2);
      color: var(--fg1);
    }
  }
  .newinvite {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  code {
    padding: .5rem;
    background-color: var(--bg2);
  }
  .icon {
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>