<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "../icon.svelte";
  import Popup from "../popup.svelte";

  const { guild, invitations }: { guild: {id: number}, invitations: {uuid: string, customlink: string}[] } = $props();

  let invites = $derived(invitations.map(i => {return {...i, link: `${$page.url.origin}/app/invite/${i.customlink || i.uuid}`}}));

  let invitemode: 'closed' | 'choose' | 'custom' | 'random' | 'displaylink' = $state('closed');
  let invitelinkresponse: Promise<string | undefined> | undefined = $state();

  $effect(() => {
    if (invitemode == 'random') {
      invitelinkresponse = fetch('/api/guild/invite', {
        method: 'POST',
        body: JSON.stringify({
          guildid: guild.id
        })
      }).then(async r => {
        if (!r.ok) return;
        return (await r.json())['uuid'];
      });
      invitemode = 'displaylink';
    }
  });

  let customlinkcontent = $state('');
  let customlinkerror = $state('');

  $effect(() => {
    customlinkcontent;
    customlinkerror = '';
  });

  function createCustomLink () {
    if (customlinkcontent.match(/[^a-z0-9-_]/)) {
      customlinkerror = 'Custom links can only include lowercase english letters (a-z), dashes (-), and underscores (_)';
      return;
    }
    invitelinkresponse = fetch('/api/guild/invite/custom', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        custom: customlinkcontent
      })
    }).then(async r => {
      if (!r.ok) return;
      return (await r.json())['custom'] as string;
    });
    invitemode = 'displaylink';
  }
</script>

<Popup title="Create invite" open={invitemode != 'closed'} close={() => invitemode = 'closed'}>
  <div class="innerinvitepopup">
    {#if invitemode == 'choose'}
      <div class="chooseinvitemode">
        <button onclick={() => invitemode = 'custom'}>
          Custom
        </button>
        <button onclick={() => invitemode = 'random'}>
          Random
        </button>
      </div>
    {:else if invitemode == 'custom'}
      <div class="outercustomlink">
        <span>{customlinkerror}</span>
        <form class="customlinkarea" onsubmit={createCustomLink}>
          <input type="text" placeholder="Custom link" bind:value={customlinkcontent}>
          <input type="submit" value="Create link">
        </form>
      </div>
    {:else if invitemode == 'displaylink'}
      <div class="invitecontent">
        <span>This is your sparkling new invite link. Share it with your friends to invite them.</span>
        <code class="invitelink">
          {#await invitelinkresponse}
            Loading link...
          {:then endlink}
            {$page.url.origin + '/app/invite/' + endlink}
          {/await}
        </code>
      </div>
    {/if}
  </div>
</Popup>
<div class="invitations">
  {#each invites as invite}
    <div class="inviteentry">
      <div class="inviteinfo">
        <a href={invite.link} class="invitelink link">
          /invite/{(invite.customlink || invite.uuid).slice(0,19)}
        </a>
      </div>
      <div class="inviteactions">
        <button class="deleteinvite">
          <Icon icon="delete"/>
        </button>
      </div>
    </div>
  {/each}
  <button class="addinvitation" onclick={() => invitemode = 'choose'}>
    <Icon icon="add"/>
  </button>
</div>

<style>
  .invitations {
    display: flex;
    flex-direction: column;
    &>* {
      box-sizing: border-box;
      height: 3rem;
      padding: .5rem;
      background-color: var(--bg2);
      border: none;
      color: var(--fg1);
      display: flex;
      align-items: center;
      flex-direction: row;
    }
  }
  .addinvitation {
    font-size: 1.5rem;
    justify-content: center;

    &:hover, &:active {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  .invitelink {
    padding: .5rem;
    background-color: var(--bg2);
  }
  .invitecontent {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .outercustomlink {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    &>span {
      color: var(--red);
      max-width: 20rem;
      text-align: center;
    }

    &>form {
      display: flex;
      flex-direction: column;
      gap: .5rem;

      &>* {
        padding: .5rem;
        border: none;
        background-color: var(--bg2);
        color: var(--fg1);
      }
      &>[type="submit"] {
        &:hover, &:active {
          background-color: var(--lightblue);
          color: var(--bg1);
        }
      }
    }
  }
  .chooseinvitemode {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    &>button {
      padding: .5rem;
      border: none;
      background-color: var(--bg2);
      color: var(--fg1);
      &:hover, &:active {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }
  }
  .innerinvitepopup {
    min-width: 16rem;
  }
  .invitelink {
    font-family: var(--monospaced);
    font-size: .9rem;
    background-color: inherit;
  }
  .inviteentry {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &:nth-child(even) {
      background-color: var(--bg3);
    }
  }
  .inviteactions {
    display: flex;
    flex-direction: row;
  }
  .deleteinvite {
    display: flex;
    background-color: var(--bg4);
    border: none;
    font-size: 1.5rem;
    padding: 0;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    color: var(--fg1);
    
    &:hover, &:active {
      background-color: var(--red);
      color: var(--bg1);
    }
  }
</style>