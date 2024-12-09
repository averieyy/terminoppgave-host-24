<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { shortHand } from "$lib/frontend/guild";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  const { guild, uuid } = data;

  let errorMessage = $state('');

  async function accept() {
    const resp = await fetch('/api/guild/join', {
      method: 'POST',
      body: JSON.stringify({
        uuid
      })
    });

    if (!resp.ok) {
      if (resp.status == 403) goto(`/app/login?redirect=${$page.url.pathname}`);
      errorMessage = (await resp.json()).message || 'An error occured while trying to join.';
    }
    else {
      goto(`/app/guild/${guild.id}`);
    }
  }
</script>

<svelte:head>
  <title>Join {guild.name} - Eris</title>
</svelte:head>

<main>
  <div class="invitebody">
    <span>You've been invited to join</span>
    <div class="outerpreview">
      <div class="preview" style={`background-color: ${guild.colour};`}>
        {shortHand(guild.name)}
      </div>
    </div>
    <h2>
      {guild.name}
    </h2>
    <button onclick={accept}>Accept invitation</button>
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg1);
  }
  .invitebody {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    background-color: var(--bg2);
    padding: 1rem;

    max-width: 300px;

    & * {
      text-align: center;
    }
  }
  .outerpreview {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .preview {
    width: 6rem;
    height: 6rem;
    background-color: var(--lightblue);
    color: var(--bg1);
    border-radius: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;

    user-select: none;

    font-size: 2rem;
  }
  h2 {
    margin: 0;
  }
  button {
    border: none;
    padding: .5rem;
    background-color: var(--bg3);
    color: var(--fg1);

    &:hover, &:active {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
</style>