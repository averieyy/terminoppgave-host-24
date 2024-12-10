<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let redirectLocation = $page.url.searchParams.get('redirect');

  let username: string = $state('');
  let password: string = $state('');

  let userNameError: boolean = $derived(username.length > 16 || username.length <3 || !!username.match(/[^a-z0-9\-\_]/));
  let errorMessage = $state('');

  function logIn() {
    if (userNameError) {
      errorMessage = 'Username invalid';
      return;
    }
    if (!password || password.length < 8) {
      errorMessage = 'Password shorter than 8 characters';
      return;
    }
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then(async resp => {
      if (resp.ok) {
        goto(redirectLocation || '/app');
      }
      else if (resp.status !== 500) {
        username = '';
        password = '';
        errorMessage = (await resp.json()).message || 'An error occured when trying to log in';
      }
    });
  }
</script>

<svelte:head>
  <title>Login - Eris</title>
</svelte:head>

<main>
  <form class="loginform" onsubmit={logIn}>
    <h2>Log in</h2>
    {#if errorMessage !== ''}
      <span class="errormessage">{errorMessage}</span>
    {/if}
    <input class={`${userNameError && 'error'} inputform`} placeholder="Username" type="text" bind:value={username} />
    <input placeholder="Password" type="password" bind:value={password} />
    <input type="submit" value="Log in">
  </form>
  <a class="switchmode" href="/app/register?redirect={redirectLocation || '/app'}">Need a user? Register</a>
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

    gap: .5rem;
  }
  .loginform {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: 1rem;
    background-color: var(--bg3);
  }
  input {
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
  .switchmode {
    color: var(--fg3);
    font-style: italic;
    text-decoration: none;

    &:hover, &:active {
      text-decoration: underline;
    }
  }
</style>