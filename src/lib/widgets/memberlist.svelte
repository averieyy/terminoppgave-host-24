<script lang="ts">
  import Icon from "./icon.svelte";

  let { members, closed, toggle, selectedMember }: { members: { username: string, online: boolean, pfp?: string }[], closed: boolean, toggle: () => void, selectedMember?: (m: {username: string, pfp: string }) => void } = $props();

  const onlinemembers = $derived(members.filter(m => m.online));
  const offlinemembers = $derived(members.filter(m => !m.online));
</script>

<div class={`memberlistsidebar ${closed ? 'closed' : 'open'}`}>
  <div class="closebararea">
    <button class="closesidebar" onclick={toggle} title={closed ? 'Open' : 'Close'}>
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
      <button class="member online" onclick={() => selectedMember && selectedMember({...member, pfp: member.pfp || ''})}>
        <div class="onlineicon"
          style={member.pfp && `background-image: url('/api/upload/${member.pfp}');`}>
          <div></div>
        </div>
        <span>
          {member.username}
        </span>
      </button>
    {/each}
    {#if offlinemembers.length > 0}
      <div class="memberlistsubheader">
        Offline
      </div>
      {#each offlinemembers as member}
        <button class="member offline" onclick={() => selectedMember && selectedMember({...member, pfp: member.pfp || ''})}>
          <div class="offlineicon"
            style={member.pfp && `background-image: url('/api/upload/${member.pfp}');`}>
            <div></div>
          </div>
          <span>
            {member.username}
          </span>
        </button>
      {/each}
    {/if}
  </div>
</div>

<style>
  @media screen and (max-width: 560px) {
    .closed>.closebararea {
      width: 0;
    }

    .memberlistsidebar {
      position: fixed;
      background-color: var(--bg2);
      height: 100%;
      right: 0;
    }
  }

  .memberlist {
    display: flex;
    flex-direction: column;
    flex: 1;
    
    overflow-y: auto;

    transition: width .125s ease;

    width: 12rem;
    overflow: hidden;
  }
  .member {
    padding: .5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    border: none;
    background-color: inherit;
    font: inherit;
    color: var(--fg1);

    &>span {
      text-overflow: ellipsis;
      text-align: start;
      overflow: hidden;
    }

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

    /* PFP */
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    
    aspect-ratio: 1 / 1;
    min-width: 1.5rem;
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
    
    background-color: var(--bg3);
    color: var(--fg1);
    
    font-size: 1.25rem;
    border: none;

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