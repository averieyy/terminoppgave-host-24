<script lang="ts">
  import { goto } from '$app/navigation';
  import Guildlist from '$lib/widgets/guildlist.svelte';
  import Icon from '$lib/widgets/icon.svelte';
  import Popup from '$lib/widgets/popup.svelte';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const { guild, guilds, channels, admin } = data;

  let createChannelPopupOpen: boolean = $state(false);

  let newchannelname: string = $state('');
  let newchannelerror: string = $state('');

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
</script>

<Popup title="Create channel" open={createChannelPopupOpen} close={() => createChannelPopupOpen = false}>
  <form class="createchannelform" onsubmit={createChannel}>
    <input type="text" bind:value={newchannelname}>
    <input type="submit" value="Create channel">
  </form>
</Popup>
<div class="outerpage">
  <Guildlist guilds={guilds} selectedid={guild.id} />
  <main>
    <div class="header">
      <h1>
        {guild.name}
      </h1>
    </div>
    <div class="maincontent">
      <div class="channellist">
        <h2>Channels</h2>
        {#each channels as channel}
          <a class="channelcard" href={`/app/channel/${channel.id}/`}>
            <span>#{channel.name}</span>
            <Icon icon='arrow_forward'/>
          </a>
        {/each}
        {#if admin}
          <button class="channelcard" onclick={() => createChannelPopupOpen = true}>
            <span>Create new channel</span>
            <Icon icon='add'/>
          </button>
        {/if}
      </div>
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
    display: flex;
    flex-direction: column;
  }
  .header {
    padding: 1rem;
    background-color: var(--bg2);

    & * {
      margin: 0;
      font-size: 1.5rem;
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
</style>