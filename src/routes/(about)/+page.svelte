<script>
  import Icon from "$lib/widgets/icon.svelte";

</script>

<svelte:head>
  <title>Roundtalk</title>
</svelte:head>

<div class="hero">
  <img src="" alt="Hero">
  <div class="herocontent">
    <div class="innerherocontent">
      <h2>Join roundtalk today!</h2>
      <p>Our platform provides the best experience in modern digital communications!</p>
    </div>
  </div>
</div>
<article>
  <nav>
    <a href="/app/register">
      Join Roundtalk
      <Icon icon="arrow_forward"/>
    </a>
    <a href="/about">
      About
      <Icon icon="arrow_forward"/>
    </a>
  </nav>
</article>

<style>
  .hero {
    position: relative;
    width: 100vw;
    max-height: 50vw;
    height: 30vh;

    &>img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    & .herocontent {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      & .innerherocontent {
        padding: 4rem;
      }
    }
  }
  article {
    background-color: var(--bg2);
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    &>* {
      width: 75%;
      max-width: 600px;
    }
  }
  nav {
    display: flex;
    flex-direction: row;

    padding: .5rem;
    gap: .5rem;

    &>a {
      padding: 1rem;
      flex: 1;
      background-color: var(--bg1);
      color: var(--fg1);
      text-decoration: none;
      border-radius: .5rem;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      &:hover, &:active {
        background-color: var(--lightblue);
        color: var(--bg1);
      }
    }
  }
</style>