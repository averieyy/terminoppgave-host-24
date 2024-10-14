<script lang="ts">
  import { onMount } from "svelte";
    import type { Message, messageData, serverMessage } from "../types";

  export let streamsource: string;

  let messages: Message[] = [];

  onMount(() => {
    const stream = new EventSource(streamsource);
    stream.onmessage = ev => {
      const msg = JSON.parse(ev.data) as serverMessage<messageData>;
      
      switch (msg.type) {
        case 'message':
          messages.push(msg.data as Message);
          break;
        case 'typing':
          msg.data = msg.data;
          break;
      }
      
      messages = messages;
    }
  });
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
  <div class="sendmessage">
    <h1>asdf</h1>
  </div>
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
    width: 100%;
    background-color: var(--bg3);
  }
</style>