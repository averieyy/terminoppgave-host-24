<script lang="ts">
  import { onMount } from "svelte";
  import type { Message } from "../types";
  import Icon from "../icon.svelte";

  export let streamsource: string;

  let messages: Message[] = [];

  onMount(() => {
    const stream = new EventSource(streamsource);
    stream.addEventListener('channelmessage', ev => {
      const msg = JSON.parse(ev.data) as Message;      
      messages.push(msg);

      messages = messages;
    });
  });

  let messageContent: string;

  function sendMessage() {
    fetch(`${streamsource}/send`, {
      method: 'POST',
      body: JSON.stringify({
        content: messageContent,
      })
    });
    messageContent = '';
  }
</script>

<div class="channelview">
  <div class="messages">
    {#each messages as message}
      <div class="message">
        <span class="sender">{message.user}</span>
        <span class="content">{message.content}</span>
      </div>
    {/each}
  </div>
  <form class="sendmessage" on:submit={sendMessage}>
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
    background-color: var(--bg2);

    font-size: 16px;

    &:hover {
      background-color: var(--bg3);
    }
  }

  .sender {
    color: var(--lightblue);
  }

  .sendmessage {
    display: flex;
    background-color: var(--bg3);
    flex-direction: row;

    padding: 1rem;
    gap: .5rem;
    
    & input {
      padding: .5rem;
      background-color: var(--bg4);
      color: var(--fg1);
      border: none;
      border-radius: .5rem;
      flex: 1;
    }

    & .inputbtn {
      aspect-ratio: 1 / 1;
      border: none;
      background-color: var(--bg4);
      color: var(--fg1);
      border-radius: .5rem;

      padding: 0;
      
      display: flex;
      justify-content: center;
      align-items: center;

    }
  }
  .icon {
    font-size: 1.375rem;
  }
</style>