<script lang="ts">
  import { onMount } from "svelte";
  import { Message, type messageData, type serverMessage } from '$lib/frontend/types'

  let messages: serverMessage<Message>[] = [];


  onMount(() => {
    const stream = new EventSource('/api/channel/123');
    stream.onmessage = ev => {
      const msg = JSON.parse(ev.data) as serverMessage<messageData>;
      
      switch (msg.type) {
        case 'message':
          messages.push(msg as serverMessage<Message>);
          break;
        case 'typing':
          msg.data = msg.data;
          break;
      }
      
      messages.push();
      messages = messages;
    }
  });

</script>

<div>
  {#each messages as message}
    <span class="message">
      {message.data.user}: {message.data.content}
    </span>
  {/each}
</div>

<style>
  .message {
    padding: .5rem;
    display: flex;
  }
</style>