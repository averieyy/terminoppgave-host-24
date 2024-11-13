<script lang="ts">
  import { page } from "$app/stores";
  import Channelview from "$lib/widgets/channelview.svelte";
  import Guildlist from "$lib/widgets/guildlist.svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  let channelid = $page.params.channelid;
  const { channel, guilds } = data;

</script>

<svelte:head>
  <title>
    #{channel.name} - Roundtalk
  </title>
</svelte:head>

<main>
  <Guildlist guilds={guilds} selectedid={channel.guildid} />
  <div class="channel">
    <Channelview title={channel.name} streamsource={`/api/channel/${channelid}`}/>
  </div>
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