<script lang="ts">
    import Icon from "./icon.svelte";

  const { members }: { members: { username: string, online: boolean }[] } = $props();

  const onlinemembers = $derived(members.filter(m => m.online));
  const offlinemembers = $derived(members.filter(m => !m.online));

  let closed = $state(false);
</script>

<div class={`memberlistsidebar ${closed ? 'closed' : 'open'}`}>
  <div class="closebararea">
    <button class="closesidebar" onclick={() => closed = !closed} title={closed ? 'Open' : 'Close'}>
      <span>
        <Icon icon="chevron_right"/>
      </span>
    </button>
  </div>
  <div class="memberlist">
    <div class="memberlistsubheader">
      Online
    </div>
    {#each onlinemembers as member}
      <div class="member online">
        <div class="onlineicon">
          <div></div>
        </div>
        {member.username}
      </div>
    {/each}
    {#if offlinemembers.length > 0}
      <div class="memberlistsubheader">
        Offline
      </div>
      {#each offlinemembers as member}
        <div class="member offline">
          <div class="offlineicon">
            <div></div>
          </div>
          {member.username}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .memberlist {
    display: flex;
    flex-direction: column;
    flex: 1;
    
    overflow-y: auto;

    transition: width .125s ease;

    width: 10rem;
  }
  .member {
    padding: .5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;

    &.offline {
      font-style: italic;
      color: var(--fg3);
    }

    &:hover {
      background-color: var(--bg1);
    }

    user-select: none;
  }
  .onlineicon, .offlineicon {
    background-color: var(--bg1);
    
    aspect-ratio: 1 / 1;
    width: 1.5rem;
    border: 2px solid var(--bg2);
    border-radius: 100%;

    display: flex;
    align-items: flex-end;
    justify-content: flex-end;

    &>div {
      width: .5rem;
      aspect-ratio: 1 / 1;
      border-radius: 100%;
    }
  }
  .onlineicon>div {
    background-color: var(--lightblue);
  }
  .offlineicon>div {
    background-color: var(--bg1);
    border: .125rem solid var(--bg3);
    width: .25rem;
  }
  .memberlistsubheader {
    margin: .5rem;
    margin-top: 1rem;
    margin-bottom: .25rem;
    padding-left: .5rem;
    border-bottom: .125rem solid var(--lightblue);
  }
  .memberlistsidebar {
    display: flex;
    flex-direction: column;

    overflow: hidden;

    align-items: flex-end;
    min-width: fit-content;
  }
  .closesidebar {
    height: 2rem;
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: var(--bg1);
    color: var(--fg1);
    border-radius: .5rem;
    font-size: 1.25rem;

    & * {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: rotate .125s ease;
    }

    &:hover, &:active {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  .closebararea {
    height: 4rem;
    width: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .closed>.memberlist {
    width: 0;
  }
  .open .closesidebar * {
    rotate: 0deg;
  }
  .closed .closesidebar * {
    rotate: 180deg;
  }
</style>