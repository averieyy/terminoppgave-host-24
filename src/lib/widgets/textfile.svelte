<script lang="ts">
  import type { FileContent } from "$lib/frontend/types";
  import Icon from "./icon.svelte";

  const { textfile, remove, preview }: { textfile: FileContent, remove?: (path: string) => void, preview: string } = $props();

  let expanded: boolean = $state(false);
</script>

<div class="textfile">
  <div class="fileinfo">
    <span class="icon">
      <Icon icon="description"/>
    </span>
    <span>
      {textfile.displayname}
    </span>
    <div class="expandbtns">
      <button class={`expand ${expanded ? 'open' : 'closed'}`} onclick={() => expanded = !expanded} title="expand">
        <span class="icon">
          <Icon icon={expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}/>
        </span>
      </button>
      {#if remove}
        <button onclick={() => remove(textfile.path)} class="remove">
          <span class="icon">
            <Icon icon="close"/>
          </span>
        </button>
      {/if}
    </div>
  </div>
  <div class={`preview ${expanded ? 'open' : 'closed'}`} aria-hidden={!expanded}>
    <code><pre class="previewtext">{preview.slice(0,1000)}</pre></code>
  </div>
</div>

<style>
  .textfile {
    background-color: var(--bg3);
    padding: .5rem;
    display: flex;
    flex-direction: column;

    &, & * {
      max-width: inherit;
      max-height: 20rem;
  
      box-sizing: border-box;
    }
  }
  .fileinfo {
    display: flex;
    flex-direction: row;
    gap: .5rem;
    align-items: center;
    justify-content: space-between;
  }
  .expand {
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    color: var(--fg1);

    background-color: var(--bg2);

    &:active, &:hover {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  .icon {
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  .preview {
    overflow: hidden;
    height: fit-content;

    font-size: 80%;

    padding: .5rem;
    background-color: var(--bg2);
    margin-top: .5rem;
    overflow: hidden;

    &.closed {
      display: none;
    }
    & * {
      max-width: inherit;
      min-width: 0;
    }
  }
  pre {
    overflow-x: auto;
    overflow-y: auto;
    margin: 0;
    min-width: 5rem;
    max-width: 100%;
  }
  .expandbtns {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
  .remove {
    padding: 0;
    border: none;
    width: 2rem;
    height: 2rem;
    background-color: var(--bg2);
    color: var(--fg1);

    &:active, &:hover {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
</style>