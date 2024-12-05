<script lang="ts">
    import Icon from "./icon.svelte";

  const { open, user, close }: { open: boolean, user: { username: string, pfp: string, bio: string } | null, close: () => void } = $props();

  let popupBack: HTMLDivElement | undefined = $state(); // For closing by clickng on the background
</script>

{#if user}
  <div class="userpopupback {open ? 'open' : 'closed'}"
    bind:this={popupBack}
    aria-hidden={!open}
    onclick={e => e.target == popupBack && close()}>
    <div class="userpopup">
      <div class="header">
        <button class="closebtn" onclick={close}>
          <Icon icon="close"/>
        </button>
      </div>
      <div class="pfpname">
        <div class="pfp">
          {#if user.pfp}
            <img src={user.pfp ? `/api/upload/${user.pfp}` : '/'} alt="{user.username}'s pfp">
          {:else}
            <div class="empty">
              <Icon icon=""/>
            </div>
          {/if}
        </div>
        <div class="name">
          <h2>
            {user.username}
          </h2>
        </div>
      </div>
      <span class="line"></span>
        <p>
          {user.bio}
        </p>
    </div>
  </div>
{/if}

<style>
  .userpopupback {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    z-index: 1;

    background-color: #0000005f;

    overflow: hidden;

    &.closed {
      height: 0%;
    }
    &.open {
      height: 100%;
    }

    align-items: center;
    justify-content: center;
  }

  .userpopup {
    display: flex;
    flex-direction: column;
    max-width: 90%;
    width: 30rem;
    box-sizing: border-box;
    background-color: var(--bg2);
    border-radius: .5rem;
    overflow: hidden;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 1rem;
    box-sizing: border-box;
    height: 5rem;
    background-color: var(--bg1);
  }

  .closebtn {
    width: 2rem;
    height: 2rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    border: none;
    background-color: transparent;
    color: var(--fg1);
    border-radius: .25rem;

    &:active, &:hover {
      background-color: var(--red);
      color: var(--bg1);
    }
  }

  .pfpname {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
    min-height: 4rem;
    box-sizing: border-box;
    background-color: var(--bg2);
    position: relative;
  }

  .pfp {
    display: flex;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: 50%;
    border: .25rem solid var(--bg1);
    position: absolute;
    top: -2.5rem;

    width: 5rem;
    height: 5rem;

    &>* {
      object-fit: cover;
      width: 100%;
      height: 100%;
      object-position: 50% 50%;
      background-color: var(--bg1);
    }
  }
  .name {
    flex: 1;
    margin-left: 7rem;
    overflow: hidden;
    
    &>* {
      margin: 0;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  span.line {
    display: flex;
    background: linear-gradient(.25turn, var(--lightblue), transparent);
    height: 2px;
    margin-left: 1rem;
    margin-right: 1rem;
  }
  p {
    padding: 1rem;
    margin: 0;
    background-color: var(--bg3);
    border-radius: .25rem;
  }
</style>