<script lang="ts">
  import Guildlist from '$lib/widgets/guildlist.svelte';
  import Icon from '$lib/widgets/icon.svelte';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const { guild, guilds, channels } = data;
</script>

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
  }
  .channelcard {
    padding: 1rem;
    border-radius: .75rem;
    background-color: var(--bg2);

    color: inherit;
    text-decoration: none;
    
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
</style>