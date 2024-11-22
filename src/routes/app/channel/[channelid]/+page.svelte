<script lang="ts">
  import { page } from "$app/stores";
  import Channelview from "$lib/widgets/channelview.svelte";
  import Guildlist from "$lib/widgets/guildlist.svelte";
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
  <Guildlist guilds={guilds} selectedid={channel.guildid} />
  <div class="channel">
    <Channelview title={channel.name} streamsource={`/api/channel/${channelid}`} userid={userid} admin={admin} />
  </div>
  <Memberlist members={members} />
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  .channel {
    flex: 1;
  }
</style>