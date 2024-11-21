<script>
    import Faq from "$lib/widgets/faq.svelte";
    import Icon from "$lib/widgets/icon.svelte";

</script>

<svelte:head>
  <title>About roundtalk</title>
</svelte:head>

<div class="upper"></div>
<div class="outerarticle">
  <article>
    <section id="introduction">
      <h1>About</h1>
      <p>Roundtalk is a messaging platform for messaging friends and enemies. After creating your account, create or join a guild to start chatting!</p>
    </section>
    <section id="faq">
      <h2>FAQs</h2>
      <ul>
        <li>
          <Faq question="How do I send a message?" >
            <span>Sending a message is easy. Just type it into the message bar on the bottom of the screen, and click the send button.</span>
            <div class="fakemessagebar">
              <div class="fakeinput">
                <span>Message</span>
              </div>
              <div class="fakesend">
                <Icon icon="send"/>
              </div>
            </div>
          </Faq>
        </li>
        <li>
          <Faq question="How do I create a channel?">
            <span>Click on the "+" on the left-hand side of the page. This will open a popup.</span>
            <div class="outerfake">
              <div class="fakeaddchannel">
                <Icon icon="add"/>
              </div>
            </div>
          </Faq>
        </li>
      </ul>
    </section>
  </article>
</div>

<style>
  .outerarticle {
    flex: 1;
    background-color: var(--bg2);

    display: flex;
    flex-direction: column;
    align-items: center;
  }
  article {
    padding: 1rem;

    flex: 1;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .upper {
    background-color: var(--bg1);
    aspect-ratio: 5 / 1;
  }
  h1 {
    margin: 0;
    width: fit-content;
    padding: 1rem;
    background-color: var(--bg2);
    position: relative;
    top: -2rem;
  }
  section>h2 {
    border-bottom: solid var(--fg1) .175rem;
    margin: 0;
  }
  ul {
    margin: 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &>li {
      list-style: none;
      margin: 0;
    }
  }
  .fakemessagebar {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
  .fakeinput {
    flex: 1;
    padding: .75rem;
    background-color: var(--bg2);
    border-radius: .5rem;
    font-style: italic;
    color: var(--fg3);
  }
  .fakesend {
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg2);
    border-radius: .5rem;

    font-size: 1.5rem;

    &:hover, &:active {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  .fakeaddchannel {
    width: 4.5rem;
    height: 4.5rem;
    background-color: var(--bg2);
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 2.25rem;

    &:hover, &:active {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
  }
  .outerfake {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>