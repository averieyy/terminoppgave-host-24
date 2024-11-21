<script lang="ts">
  import type { FileContent } from "$lib/frontend/types";
  import Icon from "./icon.svelte";

  const { filecontent, remove }: { filecontent: FileContent, remove?: (path: string) => void } = $props();
</script>

<div class="outerfilecontent">
  <div class="messagefile">
    <div class="fileicon">
      <Icon icon="description"/>
    </div>
    <span class="filename">{filecontent.displayname}</span>
    {#if remove}
      <button class="remove">
        <Icon icon='close'/>
      </button>
    {:else}
      <a href={`/api/upload/${filecontent.path}`} download class="download">
        <Icon icon='download'/>
      </a>
    {/if}
  </div>
</div>

<style>
  .messagefile {
    display: flex;
    flex-direction: row;
    align-items: center;
    
    gap: .5rem;
    padding: .5rem;
    
    background-color: var(--bg3);

    flex: 1;

    max-width: 20rem;
    max-height: 20rem;

    & .fileicon, & .download, & .remove {
      width: 2rem;
      height: 2rem;

      border: none;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 1.5rem;
    }

    & .filename {
      flex: 1;
      text-align: center;
    }

    & .download, & .remove {
      border: none;
      background-color: var(--bg2);
      color: var(--fg1);
      text-decoration: none;

      &:hover, &:active {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }
  }
</style>