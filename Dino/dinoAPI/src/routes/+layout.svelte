<script>
  import { onMount } from "svelte";
  let menuOpen = false;
  let current = "/";

  onMount(() => {
    current = window.location.pathname;
  });
</script>

<style>
  /* GLOBAL FIX — voorkom overflow door padding */
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    font-family:
      -apple-system, BlinkMacSystemFont,
      "Segoe UI", Helvetica, Arial, sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji";
    margin: 0;
    background: #f3f3f3;
  }

  /* NAVBAR */
  nav {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    max-width: 1400px;      /* voorkomt overflow */
    margin: 0 auto;          /* centreert navbar */

    height: 64px;
    padding-inline: 1.5rem;  /* veiliger dan 2rem */

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: linear-gradient(
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0)
    );
    backdrop-filter: blur(12px);

    z-index: 1000;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 700;
  }

  .logo img {
    height: 36px;
    width: 36px;
    border-radius: 50%;
  }

  .links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    position: relative;
    color: white;
    text-decoration: none;
    font-size: 1.05rem;
    font-weight: 600;
    padding: 4px 0;
    transition: opacity 0.2s ease;
  }

  .nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 0%;
    height: 2px;
    background: #095024;
    transition: width 0.25s ease;
  }

  .nav-link:hover {
    opacity: 0.7;
  }

  .nav-link:hover::after {
    width: 100%;
  }

  .active {
    color: #94d3a2;
  }

  .active::after {
    width: 100%;
  }

  /* MOBILE */
  @media (max-width: 750px) {
    .links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 64px;
      right: 0;
      background: rgba(0,0,0,0.8);
      padding: 1rem;
      border-bottom-left-radius: 12px;
    }

    .links.open {
      display: flex;
    }
  }

  .content {
    padding-top: 80px; /* ruimte voor fixed navbar */
    max-width: 1400px;
    margin: 0 auto;
  }
</style>

<nav>
  <a class="logo" href="/">
    <img src="/logo.png" alt="logo" />
    DinoAPI
  </a>

  <div class="links {menuOpen ? 'open' : ''}">
    <a href="/" class="nav-link {current === '/' ? 'active' : ''}">Home</a>
    <a href="/compare" class="nav-link {current === '/compare' ? 'active' : ''}">Compare</a>
  </div>
</nav>

<div class="content">
  <slot></slot>
</div>
