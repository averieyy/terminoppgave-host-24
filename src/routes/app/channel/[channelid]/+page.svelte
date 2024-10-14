<script lang="ts">
  import { onMount } from "svelte";
  import { Message, type messageData, type serverMessage } from '$lib/frontend/types'
    import Channelview from "$lib/frontend/views/channelview.svelte";

  let messages: serverMessage<Message>[] = [];

</script>

<Channelview streamsource='/api/channel/123'/>

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