<script lang="ts">
  import { TextContent, type Message } from "$lib/frontend/types";
  import Icon from "./icon.svelte";
  import Messagecontent from "./messagecontent.svelte";

  const { message, userid, admin, del, replyto, edit }: { message: Message, userid: number, admin: boolean, del: (id: number) => void, replyto: (messageid: number) => void, edit?: (m: Message) => void } = $props();
</script>

<div class="outermessage">
  <div class="replymessage">
    {#if message.replyto}
      <div class="reply">
        <Icon icon="reply"/>
        {#if message.replyto.deleted}
          <span>Message has been deleted</span>
        {:else}
          <span class="replyauthor">
            {message.replyto.sender}
          </span>
          {#if (message.replyto.content.find(c => TextContent.isTextContent(c)))}
            <span class="textcontent">
              {message.replyto.content.find(c => TextContent.isTextContent(c))?.content}
            </span>
          {:else}
            <span class="missingreplycontent">No text</span>
          {/if}
        {/if}
      </div>
    {/if}
    <div class="message">
      <span class="time">{message.datetime.getHours().toString().padStart(2,'0')}:{message.datetime.getMinutes().toString().padStart(2, '0')}</span>
      <div class="sendercontent">
        <div class="sendertext">
          <span class="sender">{message.user}</span>
          <span class="messagecontent">{message.content.find(c => TextContent.isTextContent(c))?.content || ''}</span>
        </div>
        <Messagecontent content={message.content.filter(c => !TextContent.isTextContent(c))} />
      </div>
      {#if message.edited}
        <span class="messagedited">(edited)</span>
      {/if}
    </div>
  </div>
  <div class="outerhovermenu">
    <div class="hovermenu">
      <button onclick={() => replyto(message.id)}>
        <Icon icon="reply"/>
      </button>
      {#if message.senderid == userid || admin}
        {#if message.senderid == userid && edit}
          <button onclick={() => edit(message)}>
            <Icon icon='edit' />
          </button>
        {/if}
        <button class="delete" onclick={() => del(message.id)}>
          <Icon icon="delete"/>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  @media (max-width: 560px) {
    .sendercontent {
      flex-direction: column !important;
    }
  }

  .message {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: .5rem;
    padding: .5rem;

    font-size: 16px;
  }

  .sendercontent {
    display: flex;
    gap: .5rem;
    flex-direction: column;
    flex: 1;
  }

  .replymessage {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .replyauthor {
    color: var(--blue);
  }

  .reply {
    padding: .5rem;
    font-size: 12px;
    font-style: italic;
    color: var(--fg3);

    display: flex;
    flex-direction: row;
    gap: .5rem;
  }

  .replymessage {
    background-color: var(--bg1);
  }

  .missingreplycontent {
    color: var(--bg4);
  }

  .outermessage:hover>.replymessage {
    background-color: var(--bg2);
  }

  .sender {
    color: var(--lightblue);
  }

  .time {
    color: var(--bg4);
    font-style: italic;
    font-family: 'Jetbrains Mono', monospace;
  }

  .delete:hover {
    background-color: var(--red) !important;
  }
  
  .hovermenu {
    display: none;
    background-color: var(--bg3);
    position: absolute;
    translate: -100% 0;
    top: -.75rem;
    left: -.5rem;
    padding: .25rem;
    border-radius: .5rem;

    &>button {

      background-color: inherit;

      color: var(--fg1);
      width: 1.5rem;
      height: 1.5rem;
      border-radius: .25rem;
      font-size: 1.25rem;
      border: none;

      display: flex;
      align-items: center;
      justify-content: center;

      &:hover, &:active {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }
  }

  .outerhovermenu {
    width: 0;
    height: 0;
    position: relative;
  }
  
  :hover>*>.hovermenu {
    display: flex;
    flex-direction: row;
    height: fit-content;
    gap: .5rem;
  }

  .outermessage {
    display: flex;
    flex-direction: row;
  }
  .messagedited {
    color: var(--bg4);
  }
</style>