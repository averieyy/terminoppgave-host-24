<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { FileContent, Message, TextContent } from "../frontend/types";
  import Icon from "./icon.svelte";
  import { DateReviver } from "../frontend/datereviver";
  import Popup from "./popup.svelte";
  import Messagew from "./messagew.svelte";
  import Messagecontent from "./messagecontent.svelte";

  const { streamsource, userid, admin=false }: { streamsource: string, userid: number, admin: boolean } = $props();

  let messages: Message[] = $state([]);
  let messagelist: HTMLDivElement | undefined = $state();

  let messagewithdates: (Message & { firsttoday: boolean })[] = $derived(messages.map((m,i) => {
    if (!messages[i-1] || m.datetime.toDateString() != messages[i-1].datetime.toDateString()) return { ...m, firsttoday: true }
    return { ...m, firsttoday: false };
  }));

  let scrolling = false;

  let stream: EventSource;

  let editingMessage: Message | undefined = $state();

  onMount(() => {
    stream = new EventSource(streamsource);
    stream.addEventListener('history', ev => {
      const msg = JSON.parse(ev.data, DateReviver) as Message[];

      messages = msg;
    });
    stream.addEventListener('channelmessage', ev => {
      const msg = JSON.parse(ev.data, DateReviver) as Message;
      messages.push(msg);

      messages = messages;
    });
    stream.addEventListener('messagedelete', ev => {
      const { id } = JSON.parse(ev.data) as {id: number};
      
      const deleteindex = messages.findIndex(m => m.id == id);
      messages.splice(deleteindex, 1);

      messages = messages;
    });
    stream.addEventListener('messageedit', ev => {
      const { message } = JSON.parse(ev.data, DateReviver) as {message: Message};

      console.log(message);     
      
      const deleteindex = messages.findIndex(m => m.id == message.id);
      messages[deleteindex] = message;

      messages = messages;
    });
    stream.addEventListener('error', err => {
      console.log('An error occured', err);
    });
    messagelist?.addEventListener('scroll', () => {
      scrolling = !messagelist || (messagelist.scrollTop + messagelist.clientHeight) < messagelist.scrollHeight;
    });
  });

  onDestroy(() => {
    if (stream) {
      stream.close();
    }
  });

  let messageTextContent: TextContent = $state(new TextContent(''));
  let messageFileContent: FileContent[] = $state([]);
  let messageReply: Message | undefined = $state();

  function sendMessage(ev: SubmitEvent) {
    ev.preventDefault();
    if (messageFileContent.length + messageTextContent.content.length == 0) return;
    fetch(`${streamsource}/send`, {
      method: 'POST',
      body: JSON.stringify({
        content: [
          messageTextContent.content ? messageTextContent : undefined,
          ...messageFileContent
        ].filter(c => !!c),
        datetime: Date.now(),
        replyto: messageReply?.id
      })
    });
    messageFileContent = [];
    messageTextContent = new TextContent('');
    messageReply = undefined
  }

  async function deleteMessage (messageid: number) {
    await fetch(`${streamsource}/delete`, {
      method: 'DELETE',
      body: JSON.stringify({
        messageid
      })
    });
  }

  function startEditing (message: Message) {
    editingMessage = message;

    messageFileContent = message.content.filter(c => FileContent.isFileContent(c));
    messageTextContent = message.content.filter(c => TextContent.isTextContent(c))[0] || new TextContent('');
    messageReply = messages.find(m => m.id == message.replyto?.id);
  }

  async function editMessage () {
    if (!editingMessage) return;
    await fetch(`${streamsource}/edit`, {
      method: 'PUT',
      body: JSON.stringify({
        messageid: editingMessage.id,
        messagecontent: [messageTextContent, ...messageFileContent]
      })
    });
    editingMessage = undefined;
    messageFileContent = [];
    messageTextContent = new TextContent('');
    messageReply = undefined;
  }

  function replyto (messageid: number) {
    messageReply = messages.find(m => m.id == messageid);
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

  async function uploadFile() {
    const file = files?.[0];
    
    if (!(file instanceof File) || file.size >= 25165824) return;

    formData.set('file', file);

    const fileresp = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (fileresp.ok) {
      const path: string = (await fileresp.json()).path;

      messageFileContent.push(new FileContent(path, file.name, file.type));

      uploadPopupOpen = false;
      files = undefined;
    
      messageFileContent = messageFileContent;
    }
  }

  function removeFile (path: string) {
    const index = messageFileContent.findIndex(f => f.path == path);
    if (index == -1) return;
    messageFileContent.splice(index, 1);
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
  <div class="messages" bind:this={messagelist}>
    {#each messagewithdates as message}
      {#if message.firsttoday}
        <div class="datedivide">
          {message.datetime.toDateString()}
        </div>
      {/if}
      <Messagew message={message} admin={admin} userid={userid} del={deleteMessage} replyto={replyto} edit={startEditing} />
    {/each}
  </div>
  <div class="messagebar">
    {#if editingMessage}
      <span class="editingmessage">Editing message</span>
    {/if}
    {#if messageReply}
      <div class="reply">
        <Icon icon="reply"/>
        <span class="replyauthor">
          {messageReply.user}
        </span>
        {#if messageReply.content.find(m => TextContent.isTextContent(m))}
          <span class="replycontent">
            {messageReply.content.find(m => TextContent.isTextContent(m))?.content}
          </span>
        {:else}
          <span class="nocontent">No text</span>
        {/if}
        <div class="fullflex"></div>
        <button class="unreply" onclick={() => messageReply = undefined}><Icon icon="close"/></button>
      </div>
    {/if}
    {#if messageFileContent.length != 0}
      <Messagecontent content={messageFileContent} removeFile={removeFile}/>
    {/if}
    <form class="sendmessage" onsubmit={editingMessage ? editMessage : sendMessage}>
      <input type="text" bind:value={messageTextContent.content} placeholder={`Message`} />
      <button type="button" class="inputbtn uploadbtn" onclick={() => uploadPopupOpen = true}><Icon icon='upload'/></button>
      <button type="submit" class="inputbtn sendbtn"><Icon icon='send'/></button>
    </form>
  </div>
</div>

<style>
  .channelview {
    height: 100%;
    max-height: 100%;

    display: flex;
    flex-direction: column;

    background-color: var(--bg1);

    overflow: hidden;
  }
  .messages {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;
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

  .reply {
    display: flex;
    flex-direction: row;
    gap: .5rem;

    color: var(--fg3);

    font-style: italic;
    font-size: 12px;

    & .replyauthor {
      color: var(--blue);
    }

    & .nocontent {
      color: var(--bg4);
    }
  }
  
  .fullflex {
    flex: 1;
  }

  .unreply {
    border: none;
    background-color: var(--bg3);
    font-size: 1rem;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--fg1);
    border-radius: .25rem;

    &:active, &:hover {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  .editingmessage {
    font-style: italic;
    font-size: .8rem;
  }
</style>