<script lang="ts">
  import { page } from "$app/stores";
  import Channelview from "$lib/widgets/channelview.svelte";
  import Guildlist from "$lib/widgets/guildlist.svelte";
  import Icon from "$lib/widgets/icon.svelte";
  import Memberlist from "$lib/widgets/memberlist.svelte";
  import type { PageData } from "./$types";

  let channelid = $page.params.channelid;

  const { data }: { data: PageData } = $props();
  const { channel, guilds, members, userid, admin } = data;
</script>

<svelte:head>
  <title>
    #{channel.name} - Eris
  </title>
</svelte:head>

<main>
  <div class="outerguildlist">
    <Guildlist guilds={guilds} selectedid={channel.guildid} />
  </div>
  <div class="outerchannel">
    <header>
      <span>#{channel.name}</span>
      <button class="showmembers">
        <Icon icon="person"/>
      </button>
    </header>
    <div class="channel">
      <Channelview streamsource={`/api/channel/${channelid}`} userid={userid} admin={admin} />
    </div>
  </div>
  <div class="normalmemberlist">
    <Memberlist members={members} />
  </div>
</main>

<style>
  @media screen and (max-width: 500px) {
    .outerguildlist {
      display: none;
    }
  }

  main {
    display: flex;
    flex-direction: row;
    height: 100vh;
    max-height: 100vh;

    overflow: hidden;
  }
  .outerchannel {
    flex: 1;
    height: 100%;
    max-height: 100%;

    display: flex;
    flex-direction: column;
  }
  .channel {
    display: flex;
    flex-direction: column;

    overflow: auto;
  }
  .normalmemberlist {
    max-width: 10rem;
  }
  header {
    padding: 1rem;
    padding-left: .5rem;
    padding-right: .5rem;
    height: 2rem;
    background-color: var(--bg2);
    font-style: italic;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .showmembers {
    width: 2rem;
    height: 2rem;
    background-color: var(--bg3);
    border: none;
    color: var(--fg1);
    font-size: 1.5rem;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    &:active, &:hover {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
</style>