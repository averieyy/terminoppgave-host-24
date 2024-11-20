<script lang="ts">
  import { onMount } from "svelte";
  import { FileContent, ImageContent, TextContent, TextFileContent, type Message } from "../frontend/types";
  import Icon from "./icon.svelte";
  import { DateReviver } from "../frontend/datereviver";
  import Popup from "./popup.svelte";

  const { streamsource, title }: { streamsource: string, title: string } = $props();

  let messages: Message[] = $state([]);
  let messagelist: HTMLDivElement | undefined = $state();

  let messagewithdates: (Message & { firsttoday: boolean })[] = $derived(messages.map((m,i) => {
    if (!messages[i-1] || m.datetime.toDateString() != messages[i-1].datetime.toDateString()) return { ...m, firsttoday: true }
    return { ...m, firsttoday: false };
  }));

  let scrolling = false;

  onMount(() => {
    const stream = new EventSource(streamsource);
    stream.addEventListener('history', ev => {
      const msg = JSON.parse(ev.data, DateReviver) as Message[];
      
      messages = msg;
    });
    stream.addEventListener('channelmessage', ev => {
      const msg = JSON.parse(ev.data, DateReviver) as Message;
      messages.push(msg);

      messages = messages;
    });
    stream.addEventListener('error', err => {
      console.log('An error occured', err);
    });
    messagelist?.addEventListener('scroll', () => {
      scrolling = !messagelist || (messagelist.scrollTop + messagelist.clientHeight) < messagelist.scrollHeight;
    });
  });

  let messageTextContent: TextContent = $state(new TextContent(''));
  let messageFileContent: FileContent[] = $state([]);
  let messageImageContent: ImageContent[] = $state([]);
  let messageTextFileContent: TextFileContent[] = $state([]);

  function sendMessage(ev: SubmitEvent) {
    ev.preventDefault();
    if (messageFileContent.length + messageTextFileContent.length + messageImageContent.length + messageTextContent.content.length == 0) return;
    fetch(`${streamsource}/send`, {
      method: 'POST',
      body: JSON.stringify({
        content: [
          messageTextContent.content ? messageTextContent : undefined,
          ...messageTextFileContent,
          ...messageFileContent,
          ...messageImageContent,
        ].filter(c => !!c),
        datetime: Date.now(),
      })
    });
    messageFileContent = [];
    messageImageContent = [];
    messageTextFileContent = [];
    messageTextContent = new TextContent('');
  }

  function scrollDown() {
    scrolling = false;
    messagelist?.scroll({ left: 0, top: messagelist.scrollHeight, behavior: 'instant' })
  }

  $effect(() => {

    messages;

    if (!scrolling) {
      
      scrollDown();
    }
  });

  let uploadPopupOpen = $state(false);
  let uploadform: HTMLFormElement | undefined = $state();
  let formData: FormData = $derived(new FormData(uploadform));
  let files: FileList | undefined = $state();

  $inspect(files);

  async function uploadFile() {
    const file = files?.[0];
    
    if (!(file instanceof File) || file.size >= 25165824) return;

    const isImage = file.type.startsWith('image/');
    const isTextFile = file.type == 'text/plain';

    formData.set('file', file);

    const fileresp = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (fileresp.ok) {
      const path: string = (await fileresp.json()).path;

      if (isImage) messageImageContent.push(new ImageContent(path))
      else if (isTextFile)
        messageTextFileContent.push(
          new TextFileContent(
            path,
            file.name,
            (await file.text()).slice(0, 50)
          )
        );
      else messageFileContent.push(new FileContent(path, file.name));

      uploadPopupOpen = false;
      files = undefined;
    
      if (isImage) messageImageContent = messageImageContent;
      else if (isTextFile) messageTextFileContent = messageTextFileContent;
      else messageFileContent = messageFileContent;
    }
  }

  function removeFile (path: string) {
    const index = messageFileContent.findIndex(f => f.path == path);
    if (index == -1) return;
    messageFileContent.splice(index, 1);
  }

  function removeImage (path: string) {
    const index = messageImageContent.findIndex(f => f.path == path);
    if (index == -1) return;
    messageImageContent.splice(index, 1);
  }
</script>

<Popup open={uploadPopupOpen} title="Upload file" close={() => uploadPopupOpen = false}>
  <form bind:this={uploadform} onsubmit={uploadFile} class="uploadform">
    <input type="file" name="file" id="uploadfile" bind:files={files}>
    <label for="uploadfile">
      <Icon icon='upload_file'/>
      {#if !files || files.length == 0}
        <span class="uploadsub">Choose file</span>
      {:else}
        {#each files as file}
          <span class="uploadsub">{file.name}</span>
        {/each}
      {/if}
    </label>
    <input type="submit" value="Upload">
  </form>
</Popup>
<div class="channelview">
  <div class="header">
    <span>#{title}</span>
  </div>
  <div class="messages" bind:this={messagelist}>
    {#each messagewithdates as message}
      {#if message.firsttoday}
        <div class="datedivide">
          {message.datetime.toDateString()}
        </div>
      {/if}
      <div class="message">
        <span class="time">{message.datetime.getHours().toString().padStart(2,'0')}:{message.datetime.getMinutes().toString().padStart(2, '0')}</span>
        <span class="sender">{message.user}</span>
        <div class="messagecontent">
          {#each message.content as messageContent}
            {#if messageContent.type == "text"}
              <span class="content">{(messageContent as TextContent).content}</span>
            {:else if messageContent.type == "file"}
              <div class="outerfilecontent">
                <div class="messagefile">
                  <div class="fileicon">
                    <Icon icon="description"/>
                  </div>
                  <span class="filename">{(messageContent as FileContent).displayname}</span>
                  <a href={`/api/upload/${(messageContent as FileContent).path}`} download class="download">
                    <Icon icon='download'/>
                  </a>
                </div>
              </div>
            {:else if messageContent.type == "image"}
              <img class="messageimage" src={`/api/upload/${(messageContent as ImageContent).path}`} alt="User-contributed">              
            {:else if messageContent.type == "textfile"}
              <div class="outerfilecontent">
                <div class="messagefile">
                  <div class="fileicon">
                    <Icon icon="description"/>
                  </div>
                  <span class="filename">{(messageContent as TextFileContent).displayname}</span>
                  <a href={`/api/upload/${(messageContent as TextFileContent).path}`} download class="download">
                    <Icon icon='download'/>
                  </a>
                </div>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
  <div class="messagebar">
    {#if messageFileContent.length + messageImageContent.length != 0}
      <div class="files">
        {#each messageFileContent as fileContent}
          <div class="messagefile">
            <div class="fileicon">
              <Icon icon='description'/>
            </div>
            <span class="filename">
              {fileContent.displayname}
            </span>
            <button class="remove" onclick={() => removeFile(fileContent.path)}>
              <Icon icon='close'/>
            </button>
          </div>
        {/each}
        {#each messageImageContent as imageContent}
          <div class="imageattachment">
            <img class="messageimage" src={`/api/upload/${imageContent.path}`} alt="User-contributed">
            <button class="remove" onclick={() => removeImage(imageContent.path)}>
              <Icon icon='close'/>
            </button>
          </div>
        {/each}
      </div>
    {/if}
    <form class="sendmessage" onsubmit={sendMessage}>
      <input type="text" bind:value={messageTextContent.content} placeholder={`Message`} />
      <button type="button" class="inputbtn uploadbtn" onclick={() => uploadPopupOpen = true}><Icon icon='upload'/></button>
      <button type="submit" class="inputbtn sendbtn"><Icon icon='send'/></button>
    </form>
  </div>
</div>

<style>
  @media (max-width: 600px) {
    .time {
      display: none;
    }
  }

  .channelview {
    height: 100%;
    max-height: 100%;

    display: flex;
    flex-direction: column;

    background-color: var(--bg1);
  }

  .messages {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
  }

  .message {
    display: flex;
    flex-direction: row;
    gap: .5rem;
    padding: .5rem;
    background-color: var(--bg1);

    font-size: 16px;

    &:hover {
      background-color: var(--bg2);
    }
  }

  .sender {
    color: var(--lightblue);
  }

  .time {
    color: var(--bg4);
    font-style: italic;
    font-family: 'Jetbrains Mono', monospace;
  }

  .sendmessage {
    display: flex;
    flex-direction: row;

    gap: .5rem;
    
    & input {
      padding: .5rem;
      background-color: var(--bg3);
      color: var(--fg1);
      border: none;
      border-radius: .5rem;
      flex: 1;
    }

    & .inputbtn {
      aspect-ratio: 1 / 1;
      border: none;
      background-color: var(--bg3);
      color: var(--fg1);
      border-radius: .5rem;

      padding: 0;
      
      display: flex;
      justify-content: center;
      align-items: center;
    }
    & button {
      font-size: 1.5rem;

      &:hover, &:active {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }
  }
  .header {
    padding: 1rem;
    padding-left: .5rem;
    padding-right: .5rem;
    height: 2rem;
    background-color: var(--bg2);
    font-style: italic;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .datedivide {
    display: flex;
    flex-direction: column;

    margin: .5rem;
    padding: .5rem;
    margin-bottom: .125rem;
    
    border-bottom: .125rem solid var(--bg4);
    
    color: var(--bg4);
    font-style: italic;
    text-align: center;
    font-size: .75rem;
  }
  .uploadform {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    min-width: 250px;

    & label {
      aspect-ratio: 2 / 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--bg2);

      font-size: 3rem;
      gap: .5rem;

      user-select: none;

      & .uploadsub {
        font-size: .9rem;
        font-style: italic;
        color: var(--fg3);
      }
    }

    & input {
      padding: .5rem;
      border: none;
      background-color: var(--bg2);
      color: var(--fg1);

      &[type="file"] {
        display: none;
      }
    }
  }
  .messagebar {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    background-color: var(--bg2);
    padding: 1rem;
  }
  .files {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .messagefile {
    display: flex;
    flex-direction: row;
    align-items: center;
    
    gap: .5rem;
    padding: .5rem;
    
    background-color: var(--bg3);

    flex: 1;

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
  .messagecontent {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex: 1;

    max-width: 20rem;
    width: 100%;

    &>* {
      max-width: 20rem;
      max-height: 20rem;
    }
  }
  .messageimage {
    max-width: 20rem;
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
</style>