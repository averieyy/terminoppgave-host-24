<script lang="ts">
  import { FileContent, type messagecontent, type TextContent } from "$lib/frontend/types";
  import Filecontent from "./filecontent.svelte";
  import Icon from "./icon.svelte";
  import Textfile from "./textfile.svelte";

  const { content, removeFile }: { content: messagecontent[], removeFile?: (path: string) => void } = $props();

  let textfilepreviews: Promise<{[key: string]: string}> = $derived.by(async () => {
    const returnable: {[key:string]: string} = {};

    for (let c of content) {
      if (c.type !== 'file' || !FileContent.isTextFileContent(c)) continue;
      
      const path = (c as FileContent).path;

      const resp = await fetch(`/api/upload/${path}`);
      if (!resp.ok) returnable[path] = 'An error occured while trying to fetch file';
      else returnable[path] = await resp.text();
    }

    return returnable;
  });
</script>

{#if content.length > 0}
  <div class="messagecontent">
    {#each content as messageContent}
      {#if messageContent.type == "text"}
        <span class="content">{(messageContent as TextContent).content}</span>
      {:else if messageContent.type == "file"}
        {#if (messageContent as FileContent).mime.startsWith("image/")}
          <div class="imageattachment">
            <img class="messageimage" src={`/api/upload/${(messageContent as FileContent).path}`} alt="User-contributed">              
            {#if removeFile}
              <button onclick={() => removeFile((messageContent as FileContent).path)}>
                <Icon icon="close"/>
              </button>
            {/if}
          </div>
        {:else if FileContent.isTextFileContent(messageContent)}
          {#await textfilepreviews}
            <Textfile textfile={messageContent as FileContent} preview={'Loading...'} remove={removeFile}/>
          {:then textfileprevs}
            <Textfile textfile={messageContent as FileContent} preview={textfileprevs[(messageContent as FileContent).path]} remove={removeFile}/>
          {/await}
        {:else}
          <Filecontent filecontent={messageContent as FileContent} remove={removeFile}/>
        {/if}
      {/if}
    {/each}
  </div>
{/if}

<style>
  .messageimage {
    width: 100%;
  }
  .imageattachment {
    display: flex;
    flex-direction: row;
    width: fit-content;
    gap: .5rem;

    & button {
      width: 2rem;
      height: 2rem;
      font-size: 1.5rem;
      border: none;
      background-color: var(--bg1);
      color: var(--fg1);

      &:hover, &:active {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }
  }

  .messagecontent {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    width: 100%;
    max-width: 20rem;
  }

  .content {
    width: fit-content;
    max-width: fit-content;
  }
</style>