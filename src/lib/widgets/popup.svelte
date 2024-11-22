<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "./icon.svelte";

  let { children, open, title, close }: { children: Snippet, open: boolean, title: string, close: () => void } = $props();
</script>

<div class={`popupback ${open ? 'open' : 'closed'}`}>
  <div class="popup">
    <div class="popuptitle">
      <h2>{title}</h2>
      <button onclick={close} class="closebtn">
        <Icon icon='close'/>
      </button>
    </div>
    <div class="popupbody">
      {@render children()}
    </div>
  </div>
</div>

<style>
  .popupback {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #0000003f;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    &.open {
      height: 100%;
    }

    &.closed {
      height: 0%;
    }
  }
  .popup {
    display: flex;
    flex-direction: column;
    border-radius: .5rem;
    overflow: hidden;

    max-width: 90vw;
  }
  .popuptitle {
    display: flex;
    flex-direction: row;
    padding: 1rem;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg2);
  }
  .popupbody {
    padding: 1rem;
    background-color: var(--bg1);
  }

  h2 {
    margin: 0
  }

  .closebtn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1;
    background-color: var(--bg1);
    color: var(--fg1);
    border: none;
    padding: .5rem;
    border-radius: .5rem;
    font-size: 1.5rem;

    &:hover, &:active {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
</style>