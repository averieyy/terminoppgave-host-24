<header>
  <h1>Roundtalk</h1>
  <div class="loginregister">
    <a href="/app/login">Login</a>
    <a href="/app/register">Register</a>
  </div>
</header>

<style>
  h1 {
    font-size: medium;
    font-style: normal;
    margin: 0;
  }
  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: .5rem;
  }
  .loginregister {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;

    & a {
      color: var(--fg1);
      text-decoration: none;
      padding: .5rem;
      background-color: var(--blue);
    }
  }
</style>