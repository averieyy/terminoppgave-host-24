<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

  let redirectLocation = $page.url.searchParams.get('redirect');

  let username: string = $state('');
  let password: string = $state('');

  let detailError: boolean = $state(false);
  let errorMessage = $state('');

  function logIn() {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then(async resp => {
      if (resp.ok) {
        goto(redirectLocation || '/app/channel/12');
      }
      else {
        username = '';
        password = '';
        detailError = true;
        errorMessage = await resp.text() || 'An error occured when trying to log in';
      }
    });
  }
</script>

<main>
  <form class="loginform" onsubmit={logIn}>
    <h2>Log in</h2>
    {#if errorMessage !== ''}
      <span class="errormessage">{errorMessage}</span>
    {/if}
    <input class={`${detailError && 'error'} inputform`} placeholder="Username" type="text" bind:value={username} />
    <input placeholder="Password (not in use)" type="password" bind:value={password} />
    <button onclick={logIn}>Log in</button>
  </form>
</main>

<style>
  h2 {
    all: unset;
    border-bottom: 2px solid var(--fg1);
  }
  main {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-direction: column;
  }
  .loginform {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: 1rem;
    background-color: var(--bg3);
  }
  input, button {
    background-color: var(--bg4);
    border: none;
    color: var(--fg1);
    padding: .5rem;
  }
  .errormessage {
    color: var(--red);
    font-size: 90%;
    font-style: italic;
  }
</style>