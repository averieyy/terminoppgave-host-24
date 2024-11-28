<script lang="ts">
    import Icon from "../icon.svelte";

  interface member {
    username: string;
    administrator?: boolean;
    id: number;
  }

  const { memberlist, banned, userid, guild }: { memberlist: member[], banned: member[], userid: number, guild: { id: number } } = $props();
  let members = $state(memberlist);
  let bannedmembers = $state(banned);


  async function toggleAdmin (userid: number, admin: boolean) {
    const oldmembers = $state.snapshot(members);
    members = members.map(m => {return {...m, administrator: m.id == userid ? !admin : m.administrator}});
    const resp = await fetch(admin ? '/api/guild/demote' : '/api/guild/promote', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        memberid: userid
      })
    });
    if (!resp.ok) {
      // Revert back
      members = oldmembers;
    }
  }

  async function kickUser (userid: number) {
    const oldmembers = $state.snapshot(members);
    const memberindex = members.findIndex(m => m.id == userid);
    members = members.toSpliced(memberindex,1);
    const resp = await fetch('/api/guild/kick', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        userid
      })
    });
    if (!resp.ok) {
      members = oldmembers;
    }
  }

  async function banUser (userid: number) {
    const oldmembers = $state.snapshot(members);
    const oldbannedmembers = $state.snapshot(bannedmembers);
    const memberindex = members.findIndex(m => m.id == userid);
    const user = members.find(m => m.id == userid);
    if (!user || memberindex == -1) return;
    members = members.toSpliced(memberindex,1);
    bannedmembers.push(user);
    const resp = await fetch('/api/guild/ban', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        userid
      })
    });
    if (!resp.ok) {
      members = oldmembers;
      bannedmembers = oldbannedmembers;
    }
  }

  async function unbanUser (userid: number) {
    const oldmembers = $state.snapshot(members);
    const userindex = bannedmembers.findIndex(b => b.id == userid);
    if (userindex === -1) return;
    bannedmembers = bannedmembers.toSpliced(userindex, 1);
    const resp = await fetch('/api/guild/unban', {
      method: 'POST',
      body: JSON.stringify({
        guildid: guild.id,
        userid
      })
    });
    if (!resp.ok) {
      members = oldmembers;
    }
  }
</script>

<div class="memberslist">
  {#each members as member}
    <div class="memberentry">
      {member.username}
      <div class="membereditbuttons">
        {#if !member.administrator}
          <button class="membereditbutton" onclick={() => kickUser(member.id)} title="Kick member">
            <Icon icon="person_remove"/>
          </button>
          <button class="membereditbutton" onclick={() => banUser(member.id)} title="Ban member">
            <Icon icon="block"/>
          </button>
          <button class="membereditbutton" onclick={() => toggleAdmin(member.id, false)} title="Promote member">
            <Icon icon="add_moderator"/>
          </button>
        {:else if member.id !== userid}
          <button class="membereditbutton" onclick={() => toggleAdmin(member.id, true)} title="Demote member">
            <Icon icon="remove_moderator"/>
          </button>  
        {/if}
      </div>
    </div>
  {/each}
</div>
{#if bannedmembers.length !== 0}
  <h3>Banned members</h3>
  <div class="memberslist">
    {#each bannedmembers as member}
      <div class="memberentry">
        {member.username}
        <div class="membereditbuttons">
          <button class="membereditbutton" onclick={() => unbanUser(member.id)} title="Unban member">
            <Icon icon="person_add"/>
          </button>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .memberslist {
    display: flex;
    flex-direction: column;

    &>* {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: .5rem;
      height: 2rem;
    }

    &>:nth-child(odd) {
      background-color: var(--bg2);
    }
    &>:nth-child(even) {
      background-color: var(--bg3);
    }
  }
  .membereditbuttons {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
  .membereditbutton {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;
    
    border: none;
    background-color: var(--bg1);
    border-radius: .25rem;
    color: var(--fg1);

    font-size: 1.5rem;

    &:active, &:hover {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  h3 {
    border-width: .1rem;
    margin: .375rem;

    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;

    margin: 0;
    border-bottom: .2rem solid var(--lightblue);
  }
</style>