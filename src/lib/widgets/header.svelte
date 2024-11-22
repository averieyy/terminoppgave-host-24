<script lang="ts">
  const { loggedin }: { loggedin: boolean } = $props();
</script>

<header>
  <h1>Eris</h1>
  {#if !loggedin}
    <div class="loginregister">
      <a class="button" href="/app/login">Login</a>
      <a class="button" href="/app/register">Register</a>
    </div>
  {:else}
    <a class="button" href="/app">Enter</a>
  {/if}
</header>

<style>
  h1 {
    font-size: medium;
    font-style: normal;
    margin: 0;
  }
  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
  }
  .loginregister {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;

  }
  .button {
    color: var(--fg1);
    text-decoration: none;
    padding: .75rem;
    background-color: var(--bg1);
    border-radius: .5rem;

    &:hover, &:active {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
</style>