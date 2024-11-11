<script lang="ts">
  import { onMount, untrack } from "svelte";
  import type { Message } from "../frontend/types";
  import Icon from "./icon.svelte";
  import { DateReviver } from "../frontend/datereviver";

  const { streamsource }: { streamsource: string } = $props();

  let messages: Message[] = $state([]);
  let messagelist: HTMLDivElement | undefined = $state();

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
      if (!scrolling) console.log('autoscroll');
    });
  });

  let messageContent: string = $state('');

  function sendMessage(ev: SubmitEvent) {
    ev.preventDefault();
    if (!messageContent) return;
    fetch(`${streamsource}/send`, {
      method: 'POST',
      body: JSON.stringify({
        content: messageContent,
        datetime: Date.now(),
      })
    });
    messageContent = '';
  }

  function scrollDown() {
    scrolling = false;
    messagelist?.scroll({ left: 0, top: messagelist.scrollHeight, behavior: 'instant' })
  }

  $effect(() => {
    console.log('scrolling');

    messages;

    if (!scrolling) {
      
      scrollDown();
    }
  })
</script>

<div class="channelview">
  <div class="messages" bind:this={messagelist}>
    {#each messages as message}
      <div class="message">
        <span class="time">{message.datetime.getHours().toString().padStart(2,'0')}:{message.datetime.getMinutes().toString().padStart(2, '0')}</span>
        <span class="sender">{message.user}</span>
        <span class="content">{message.content}</span>
      </div>
    {/each}
  </div>
  <form class="sendmessage" onsubmit={sendMessage}>
    <input type="text" bind:value={messageContent} placeholder={`Message`} />
    <button class="inputbtn uploadbtn"><Icon icon='upload'/></button>
    <button class="inputbtn sendbtn"><Icon icon='send'/></button>
  </form>
</div>

<style>
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
    background-color: var(--bg2);
    flex-direction: row;

    padding: 1rem;
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
  }
</style>