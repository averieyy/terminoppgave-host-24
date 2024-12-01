<script lang="ts">
  import { goto } from "$app/navigation";
  import Guildlist from "$lib/widgets/guildlist.svelte";
  import Icon from "$lib/widgets/icon.svelte";

  const { data } = $props();

  let { username } = $state(data.user);
  let editingUsername = $state(false);
  let usernamefeild: HTMLInputElement | undefined = $state();
  let oldusername = data.user.username;
  let usernameError: boolean = $state(false);

  $effect(() => {    
    if (!editingUsername) {
      if (oldusername == username) return;
      // POST new username

      fetch('/api/user/name', {
        method: 'PUT',
        body: JSON.stringify({
          username
        })
      }).then(r => {
        if (!r.ok) {
          username = oldusername
          usernameError = true;
        }
        else oldusername = $state.snapshot(username);
      });
    }
  });

  async function logout() {
    const resp = await fetch('/api/user/logout', {
      method: 'POST'
    });
    if (resp.ok) {
      goto('/app/login');
    }
  }
</script>

<div class="outercontent">
  <Guildlist guilds={data.guilds}/>
  <main>
    <div class="outersettings">
      <section id="apparance">
        <h1>Settings</h1>
        <form class="valuefeild" onsubmit={() => editingUsername = !editingUsername}>
          {#if editingUsername}
            <input bind:this={usernamefeild} type="text" bind:value={username} maxlength={16}>
          {:else}
            <span class="valuedisplay {usernameError && 'errorvalue'}">{username}</span>
          {/if}
          <button type="submit" class="iconbutton">
            <Icon icon={editingUsername ? 'done' : 'edit'} />
          </button>
        </form>
      </section>
      <section id="danger">
        <h2>Danger</h2>
        <button type="button" onclick={logout}>
          <span>
            Log out
            <span class="icon">
              <Icon icon="logout"/>
            </span>
          </span>
        </button>
      </section>
    </div>
  </main>
</div>

<style lang="scss">
  .outercontent {
    height: 100%;
    display: flex;
    flex-direction: row;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background-color: var(--bg2);
    border: none;
    color: var(--fg1);

    &:hover, &:active {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
    border-radius: .25rem;
  }
  .iconbutton {
    font-size: 1.5rem;
    
    height: 2.5rem;
    width: 2.5rem;
  }
  main {
    background-color: var(--bg1);
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .outersettings {
    flex: 1;
    max-width: 500px;

    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  h1 {
    margin: 0;
    padding-left: .25rem;
    border-bottom: solid .125rem var(--lightblue);
  }
  section {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .valuefeild {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
  }
  input[type="text"], .valuedisplay {
    display: flex;
    box-sizing: border-box;
    border: none;
    padding: .5rem;
    height: 2.5rem;
    align-items: center;
    flex: 1;

    border-top: .25rem solid var(--bg2);
    border-bottom: .25rem solid var(--bg2);

    border-radius: .25rem;

    background-color: var(--bg2);
    color: var(--fg1);
    font-family: var(--font);
    font-size: 1rem;

    font-size: .9rem;

    overflow-x: auto;
  }
  input[type="text"] {
    border-bottom-color: var(--lightblue);
  }
  .errorvalue {
    border-bottom-color: var(--red) !important;
  }
  #danger {
    display: flex;
    flex-direction: column;
    >button {
      background-color: var(--red);
      height: 2.5rem;

      >span {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .5rem;
        font-size: 1rem;
        font-weight: bold;

        >.icon {
          font-size: 1.25rem;
          display: flex;
        }
      }
      &:active, &:hover {
        background-color: var(--bg2);
        color: var(--red);
      }
    }
  }
  h2 {
    font-size: 1.25rem;
    border-bottom: .125rem solid var(--lightblue);
    padding-left: .25rem;
    margin: 0;
  }
</style>