<script lang="ts">
  const { onchange, start, title }: { onchange: (value: boolean) => void, start: boolean, title: string } = $props();

  let toggled = $state(start);

  $effect(() => onchange(toggled));
</script>

<div class="outertoggle">
  <span>
    { title }
  </span>
  <span class="separator">

  </span>
  <input type="checkbox" id="toggle" bind:checked={toggled}>
  <label for="toggle" title={toggled ? 'Toggled' : 'Not toggled'}>
    <div class="toggle">
      <div class="innertoggle">
        <div class="togglehandle"></div>
      </div>
    </div>
  </label>
</div>

<style>
  input[type="checkbox"] {
    display: none;
  }
  .outertoggle {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
  }
  .toggle {
    width: 4rem;
    height: 2rem;
    padding: .25rem;
    border-radius: 2rem;
    background-color: var(--bg2);

    transition: background-color .125s ease;
  }
  .innertoggle {
    position: relative;
    width: 100%;
  }
  .togglehandle {
    position: absolute;
    left: 0;
    height: 2rem;
    width: 2rem;

    transition: left .125s ease, background-color .125s ease;

    background-color: var(--lightblue);
    border-radius: 1rem;
  }
  input:checked+label>.toggle {
    & .togglehandle {
      left: 2rem;
      background-color: var(--bg1);
    }
    background-color: var(--green);
  }
  .separator {
    flex: 1;
    height: 0;
    border-bottom: .125rem dashed var(--bg4);
  }
</style>