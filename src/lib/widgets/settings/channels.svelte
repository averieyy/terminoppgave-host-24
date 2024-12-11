<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Icon from "../icon.svelte";
  import Popup from "../popup.svelte";

  const { channels, guild }: { channels: {guildid: number, id: number, name: string}[], guild: {id: number} } = $props();

  let chans = $state(channels);

  let createChannelMode: 'create' | 'closed' | 'edit' = $state('closed');
  let newchannelname: string = $state('');
  let editingChannel: number | undefined = $state();

  let channelnameok: boolean = $derived(!newchannelname.match(/[^a-z0-9-_]/) && newchannelname.length < 32);

  let pageError: string = $state('');

  async function createChannel () {
    if (!channelnameok) return;
    const resp = await fetch('/api/channel/create', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        name: newchannelname
      })
    });
    if (resp.ok) {
      const { id } = await resp.json();
      channels.push({guildid: guild.id, name: newchannelname, id});
      newchannelname = '';
      createChannelMode = 'closed';
    }
    if (!resp.ok) {
      if (resp.status == 403) goto(`/app/login?redirect=${$page.url.pathname}`);
      else pageError = (await resp.json()).message;
    }
  }

  async function deleteChannel (channelid: number) {
    const oldchannels = $state.snapshot(channels);
    const index = channels.findIndex(c => c.id == channelid);
    if (index == -1) return;

    channels.splice(index, 1);

    const resp = await fetch('/api/channel/delete', {
      method: 'DELETE',
      body: JSON.stringify({
        channelid,
        guildid: guild.id
      })
    });
    if (!resp.ok) {
      chans = oldchannels;
      if (resp.status == 403) goto(`/app/login?redirect=${$page.url.pathname}`);
      pageError = (await resp.json()).message;
    }
  }

  async function editChannel () {
    if (!channelnameok) return;
    const oldchannels = $state.snapshot(channels);
    const index = channels.findIndex(c => c.id == editingChannel);
    if (index == -1) return;
    
    channels[index].name = newchannelname;

    const resp = await fetch('/api/channel/edit', {
      method: 'PUT',
      body: JSON.stringify({
        channelid: editingChannel,
        name: newchannelname,
        guildid: guild.id
      })
    });
    if (!resp.ok) {
      chans = oldchannels;
      if (resp.status == 403) goto(`/app/login?redirect=${$page.url.pathname}`);
      pageError = (await resp.json()).message;
    }
    else {
      createChannelMode = 'closed';
      editingChannel = undefined;
    }
  }
</script>

<Popup title="{createChannelMode == 'create' ? 'Create' : 'Edit'} channel" open={createChannelMode !== 'closed'} close={() => createChannelMode = 'closed'}>
  <form class="createchannelform" onsubmit={editingChannel && createChannelMode == 'edit' ? editChannel : createChannel}>
    <input type="text" bind:value={newchannelname} class="{channelnameok ? 'good' : 'bad'}">
    <input type="submit" value="{createChannelMode == 'create' ? 'Create' : 'Edit'} channel">
  </form>
</Popup>
<Popup title="An error occured" open={!!pageError} close={() => pageError = ''}>
  <p>{pageError}</p>
</Popup>
<div class="channels">
  {#each chans as channel}
    <div class="channellistentry">
      <span class="channelname">
        #{channel.name}
      </span>
      <div class="channeloptions">
        <button class="editchannel" onclick={() => {
          editingChannel = channel.id;
          newchannelname = channel.name;
          createChannelMode = 'edit';
        }} title="Change name">
          <Icon icon="edit" />
        </button>
        <button class="deletechannel" onclick={() => deleteChannel(channel.id)} title="Delete channel">
          <Icon icon="delete" />
        </button>
      </div>
    </div>
  {/each}
  <button class="channellistentry createchannel" onclick={() => createChannelMode = 'create'} title="Create channel">
    <Icon icon="add" />
  </button>
</div>

<style>
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
      padding: 0;
      color: var(--fg1);
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .deletechannel {
    &:active, &:hover {
      background-color: var(--red);
      color: var(--bg1);
    }
  }
  .editchannel {
    &:active, &:hover {
      background-color: var(--lightblue);
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
  .createchannelform {
    display: flex;
    flex-direction: column;

    gap: .5rem;

    &>input {
      padding: .5rem;
      background-color: var(--bg2);
      color: var(--fg1);
      border: none;

      &[type="text"] {
        border-bottom: .25rem solid var(--bg2);
        padding-bottom: .25rem;

        &.bad {
          border-color: var(--red);
        }
      }
    
      &[type="submit"] {
        &:hover, &:active {
          background-color: var(--lightblue);
          color: var(--bg1);
        }
      }
    }
  }
</style>