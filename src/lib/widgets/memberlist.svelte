<script lang="ts">
  const { members }: { members: { username: string, online: boolean }[] } = $props();

  const onlinemembers = $derived(members.filter(m => m.online));
  const offlinemembers = $derived(members.filter(m => !m.online));
</script>

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

<style>
  .memberlist {
    display: flex;
    flex-direction: column;

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
</style>