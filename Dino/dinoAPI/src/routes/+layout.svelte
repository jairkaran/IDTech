<script>
  import { onMount } from "svelte";
  let menuOpen = false;
  let current = "/";

  onMount(() => {
    current = window.location.pathname;
  });
</script>

<style>
  /* --- GLOBAL GITHUB STYLE FONT --- */
  :global(body) {
    font-family:
      -apple-system, BlinkMacSystemFont,
      "Segoe UI", Helvetica, Arial, sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji";
    margin: 0;
    background: #f3f3f3; /* backup achtergrond */
  }

  /* --- NAVBAR --- */
  nav {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 64px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 2rem;

    background: linear-gradient(
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0)
    );
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    z-index: 1000;
  }

  /* --- LOGO --- */
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

  /* --- LINKS --- */
  .links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    position: relative;
    color: white;
    text-decoration: none;
    padding: 4px 0;
    font-size: 1.05rem;
    font-weight: 600;
    display: flex;
    gap: 6px;
    transition: opacity 0.2s ease;
  }

  .nav-link:hover {
    opacity: 0.7;
  }

  .nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 0%;
    height: 2px;
    background: #05330b;
    transition: width 0.2s ease;
  }

  .nav-link:hover::after {
    width: 100%;
  }

  .active {
    color: #095024;
  }

  .active::after {
    width: 100%;
  }

  @media (max-width: 750px) {
    .links {
      display: none;
      position: absolute;
      top: 64px;
      right: 0;
      width: 200px;
      padding: 1rem;
      flex-direction: column;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(10px);
      border-bottom-left-radius: 12px;
    }

    .links.open {
      display: flex;
    }

    .burger {
      display: flex;
    }
  }

  .content {
    padding-top: 80px;
  }
</style>

<nav>
  <a class="logo" href="/">
    <img src="/logo.png" alt="logo">
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
