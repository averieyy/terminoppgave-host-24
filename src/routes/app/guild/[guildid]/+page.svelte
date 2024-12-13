<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Guildlist from '$lib/widgets/guildlist.svelte';
  import Icon from '$lib/widgets/icon.svelte';
  import Memberlist from '$lib/widgets/memberlist.svelte';
  import Popup from '$lib/widgets/popup.svelte';
  import Userpopup from '$lib/widgets/userpopup.svelte';
  import { onMount } from 'svelte';

  const { data } = $props();
  const { guild, guilds, admin, channels, members } = $derived(data); // To make it so that you can go from one guild page to another. <https://github.com/sveltejs/kit/issues/1497>

  let memberlistclosed = $state(false);

  let createChannelPopupOpen: boolean = $state(false);
  let createInvitePopupOpen: boolean = $state(false);

  let newchannelname: string = $state('');
  let newchannelerror: string = $state('');
  let newchannelok: boolean = $derived(!newchannelname.match(/[^a-z0-9-_]/) && newchannelname.length < 32);

  let inviteUUID: string = $state('');
  
  let pageError: string = $state('');

  $effect(() => {
    createChannelPopupOpen;
    newchannelerror = '';
    newchannelname = '';
  });

  async function createChannel () {
    if (!newchannelok) {
      newchannelerror = 'Channel name can only include lowercase english letters, numbers, dashes and underscores';
      return;
    }
    const resp = await fetch('/api/channel/create', {
      method: 'POST',
      body: JSON.stringify({
        name: newchannelname,
        guildid: guild.id
      })
    });

    if (!resp.ok) {
      if (resp.status == 403) goto(`/app/login?redirect=${$page.url.pathname}`);
      newchannelerror = (await resp.json()).message || 'An error occured while trying to create channel.';
    }
    else {
      const { id } = await resp.json();

      goto(`/app/channel/${id}`);
    }
  }

  async function createInvitation() {
    if (!admin) return;

    const resp = await fetch('/api/guild/invite', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id
      })
    });

    if (!resp.ok) {
      if (resp.status == 403) goto(`/app/login?redirect=${$page.url.pathname}`);
      else pageError = (await resp.json()).message;
    }
    else {
      inviteUUID = (await resp.json()).uuid;
      createInvitePopupOpen = true;
    }
  }

  async function leaveGuild() {
    const resp = await fetch('/api/guild/leave', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id
      })
    });
    if (resp.ok) goto('/app');
    else {
      if (resp.status == 403) goto(`/app/login?redirect=${$page.url.pathname}`);
      else pageError = (await resp.json()).message;
    }
  }

  onMount(() => {
    memberlistclosed = window.innerWidth <= 650;
  });

  let selectedUser: {username: string, pfp: string, bio: string} | null = $state(null);
</script>

<svelte:head>
  <title>{guild.name} - Eris</title>
</svelte:head>

{#if admin}
  <Popup title="Create channel" open={createChannelPopupOpen} close={() => createChannelPopupOpen = false}>
    {#if newchannelerror}
      <p class="error">
        {newchannelerror}
      </p>
    {/if}
    <form class="createchannelform" onsubmit={createChannel}>
      <input type="text" bind:value={newchannelname} class="{newchannelok ? 'good' : 'bad'}">
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
      <div class="headerbar">
        {#if admin}
          <button onclick={createInvitation}>
            Invite
          </button>
          <a href={`/app/guild/${guild.id}/settings`}>
            <Icon icon="settings"/>
          </a>
        {:else}
          <button onclick={leaveGuild}>
            Leave guild
          </button>
        {/if}
        <button class="showmemberlist" onclick={() => memberlistclosed = false}>
          <Icon icon="person"/>
        </button>
      </div>
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
  <Memberlist members={members} closed={memberlistclosed} toggle={() => memberlistclosed = !memberlistclosed} selectedMember={m => selectedUser = m} />
</div>
<Userpopup open={!!selectedUser} user={selectedUser} close={() => selectedUser = null} />

<style>
  @media screen and (max-width: 650px) {
    .showmemberlist {
      display: flex !important;
    }
  }
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
    padding-left: .5rem;
    padding-right: .5rem;
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
  .header button {
    border: none;
    background-color: var(--bg1);
    color: var(--fg1);
    padding: .5rem;

    &:active, &:hover {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  .headerbar {
    display: flex;
    flex-direction: row;
    gap: .5rem;

    & a, & .showmemberlist {
      padding: 0;
      color: var(--fg1);
      background-color: var(--bg1);
      
      text-decoration: none;
      font-size: 1.25rem;
      
      width: 2rem;
      height: 2rem;

      align-items: center;
      justify-content: center;

      &:hover, &:active {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }

    &>a {
      display: flex;
    }
    &>.showmemberlist {
      display: none;
    }
  }
  .maincontent {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    align-items: center;
    flex: 1;

    overflow-y: auto;
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
    & input[type="text"] {
      padding-bottom: .25rem;
      border-bottom: .25rem solid var(--bg2);

      &.bad {
        border-color: var(--red);
      }
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
  .error {
    color: var(--red);
    font-style: italic;
  }
</style>