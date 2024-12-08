<script>
  import Faq from "$lib/widgets/faq.svelte";
  import Icon from "$lib/widgets/icon.svelte";
</script>

<svelte:head>
  <title>About Eris</title>
</svelte:head>

<div class="upper"></div>
<div class="outerarticle">
  <article>
    <section id="introduction">
      <h1>About</h1>
      <p>
        Eris is a messaging platform for messaging friends and enemies.
        Just create a guild and start chatting!
      </p>
    </section>
    <section id="startup">
      <h2>How do I get started?</h2>
      <p>
        Eris is free to use, so you just need an account to get started.
        Just click <a class="link" href="/app/register">here</a>,
          or on the button in the top right corner to register.
        Your username can only include lowercase english letters (a-z),
          numbers, dashes and underscores, and your password must be 8 characters or longer.
      </p>
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
              <div class="fakesend buttonpreview">
                <Icon icon="send"/>
              </div>
            </div>
          </Faq>
        </li>
        <li>
          <Faq question="How do I create a guild?">
            <span>Click on the "+" on the left-hand side of the page. This will open a popup.</span>
            <div class="outerfake">
              <div class="fakeaddchannel buttonpreview">
                <Icon icon="add"/>
              </div>
            </div>
          </Faq>
        </li>
        <li>
          <Faq question="How do I invite people?" >
            <p>
              Inviting members is only possible if you are an administrator.
            </p>
            <div class="outerfake">
              <div class="inviteexample buttonpreview">Invite</div>
            </div>
            <p>
              You should see a button that says "Invite" on the guilds main page. Copy the link you get, and spread it around.
            </p>
          </Faq>
        </li>
        <li>
          <Faq question="How do I change my username / profile picture / bio?" >
            <p>
              You can change your username, profile picture and bio on the settings page. You can find this button on the bottom of the guild list.
            </p>
            <div class="outerfake">
              <div class="fakesettings buttonpreview">
                <Icon icon="settings"/>
              </div>
            </div>
            <p>
              If you're logged in, you can use <a class="link" href="/app/settings">this link</a>.
            </p>
            <p>
              To change your username, you just have to click the edit button and type in your new name. When you're done, you can click on the checkmark.
            </p>
            <p>
              If you want to change your bio, you can write it in the large input box. Remember to click save afterwards.
            </p>
            <p>
              To change profile picture, simply click on the image, and select an image to upload. The image cannot be larger than 25MB.
            </p>
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
  .buttonpreview {
    background-color: var(--bg2);
    color: var(--fg1);
    user-select: none;

    &:hover, &:active {
      background-color: var(--lightblue);
      color: var(--bg1);
    }
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
    border-radius: .5rem;

    font-size: 1.5rem;
  }
  .fakeaddchannel, .fakesettings {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 2.25rem;
  }
  .outerfake {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .inviteexample {
    padding: 1rem;
    width: fit-content;

    user-select: none;
  }
</style>