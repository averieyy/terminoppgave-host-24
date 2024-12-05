<script lang="ts">
  import { page } from "$app/stores";
  import { shortHand, isLight } from "$lib/frontend/guild";
  import Channelview from "$lib/widgets/channelview.svelte";
  import Guildlist from "$lib/widgets/guildlist.svelte";
  import Icon from "$lib/widgets/icon.svelte";
  import Memberlist from "$lib/widgets/memberlist.svelte";
  import Userpopup from "$lib/widgets/userpopup.svelte";
  import type { PageData } from "./$types";

  let channelid = $page.params.channelid;

  const { data }: { data: PageData } = $props();
  const { channel, guilds, members, userid, admin, guild } = data;

  let memberlistclosed = $state(true);

  let selectedMember: {username: string, pfp: string, bio: string} | null = $state(null);
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
      <div class="guildchannelname">
        <a href="/app/guild/{guild.id}" title="Go back to {guild.name}" class="gobackguild" style="background-color: {guild?.colour}; color: var(--{isLight(guild?.colour) ? 'bg1' : 'fg1'})">
          {shortHand(guild?.name || 'Go back')}
        </a>
        <span class="inbetween">
          <Icon icon="chevron_right"/>
        </span>
        <span>#{channel.name}</span>
      </div>
      <button class="showmembers" onclick={() => memberlistclosed = false}>
        <Icon icon="person"/>
      </button>
    </header>
    <div class="channel">
      <Channelview streamsource={`/api/channel/${channelid}`} userid={userid} admin={admin} />
    </div>
  </div>
  <div class="normalmemberlist">
    <Memberlist members={members} closed={memberlistclosed} toggle={() => memberlistclosed = !memberlistclosed} selectedMember={m => selectedMember = m} />
  </div>
</main>
<Userpopup user={selectedMember} open={!!selectedMember} close={() => selectedMember = null} />

<style>
  @media screen and (max-width: 650px) {
    .outerguildlist {
      display: none !important;
    }
    .showmembers {
      display: flex !important;
    }
  }

  .outerguildlist {
    overflow-y: auto;
    overflow-x: hidden;

    min-width: 4rem;

    display: flex;
    flex-direction: row;
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
    flex: 1;

    display: flex;
    flex-direction: column;

    overflow: auto;
  }
  .normalmemberlist {
    max-width: 16rem;
    min-width: fit-content;
  }
  header {
    padding: 1rem;
    padding-left: .5rem;
    padding-right: .5rem;
    min-height: 2rem;
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

    display: none;
    align-items: center;
    justify-content: center;

    &:active, &:hover {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  .guildchannelname {
    display: flex;
    flex-direction: row;
    gap: .5em;
    align-items: center;

    &>.inbetween {
      font-style: normal;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .gobackguild {
    width: 2rem;
    height: 2rem;
    font-size: .66rem;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: .66rem;
    
    text-decoration: none;
    font-style: normal;

    &:active, &:hover {
      background-color: var(--bg1) !important;
      color: var(--lightblue) !important;
    }
    user-select: none;
  }
</style>