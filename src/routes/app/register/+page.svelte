<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let redirectLocation = $page.url.searchParams.get('redirect');

  let username: string = $state('');
  let password: string = $state('');

  let userNameError: boolean = $derived(username.length > 0 && (username.length > 16 || !!username.match(/[^a-z0-9\-\_]/)));
  let errorMessage = $state('');

  function register() {
    if (username.length < 3 || username.length > 16) {
      errorMessage = 'Your username has to be between 3 and 16 characters long';
      return;
    }
    if (userNameError) {
      errorMessage = 'Your username can only be lowercase english letters (a-z), numbers, dashes and underscores.';
      return;
    }
    if (password.length < 8) {
      errorMessage = 'Password shorter than 8 characters';
      return;
    }
    fetch('/api/register', {
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
        errorMessage = (await resp.json()).message || 'An error occured when trying to register';
      }
    });
  }
</script>

<svelte:head>
  <title>Register - Eris</title>
</svelte:head>

<main>
  <form class="loginform" onsubmit={register}>
    <h2>Register</h2>
    {#if errorMessage !== ''}
      <span class="errormessage">{errorMessage}</span>
    {/if}
    <input class="{userNameError && 'error'} inputform" placeholder="Username" type="text" bind:value={username} />
    <input placeholder="Password" type="password" bind:value={password} />
    <input type="submit" value="Register">
  </form>
  <a class="switchmode" href="/app/login?redirect={redirectLocation || '/app'}">Already have a user? Log in</a>
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
.error {
  border-bottom: .25rem solid var(--red);
  padding-bottom: .25rem;
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