<script lang="ts">
  import Logo from "./logo.svelte";

  const { loggedin }: { loggedin: boolean } = $props();
</script>

<header>
  <a class="eris" href="/">
    <Logo width={32} height={32}/>
    Eris
  </a>
  <div class="outerbuttons">
    {#if !loggedin}
      <a class="button" href="/app/login">Login</a>
      <a class="button" href="/app/register">Register</a>
    {:else}
        <a class="button" href="/app">Enter</a>
    {/if}
  </div>
</header>

<style>
  a.eris {
    border: none;
    background-color: var(--bg2);
    color: var(--fg1);

    text-decoration: none;
    font-size: medium;
    font-style: normal;
    font-weight: bold;

    margin: 0;
    display: flex;
    flex-direction: row;
    gap: .5rem;
    align-items: center;
    fill: var(--fg1);
    padding: 1rem;

    cursor: default;

    &:active, &:hover {
      background-color: var(--lightblue);
      fill: var(--bg1);
      color: var(--bg1);
    }
  }
  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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
  .outerbuttons {
    padding: .5rem;
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
</style>