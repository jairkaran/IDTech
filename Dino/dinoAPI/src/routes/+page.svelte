<script>
  // Geen JS nodig voor deze simpele homepage
</script>

<style>
  .body {
    background-image: url('./bimage.png');
    background-size: cover;
    background-position: center;
  }
  /* ----- HERO SECTION ----- */
  .hero {
    position: relative;
    width: 100%;
    height: 70vh;
    background-image: url('./bimage.png');
    background-size: cover;
    background-position: center;
    border-radius: 20px;
    overflow: hidden;
    margin-top: 1.5rem;
  }

  .hero::after {
    /* Donkere overlay voor leesbaarheid */
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.7)
    );
  }

  .hero-content {
    position: absolute;
    bottom: 3rem;
    left: 3rem;
    color: white;
    max-width: 500px;
    z-index: 2;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  /* ----- INTRO TEXT ----- */
  .intro {
    max-width: 900px;
    margin: 3rem auto;
    font-size: 1.15rem;
    line-height: 1.7;
    padding: 0 1rem;
  }

  /* ----- CTA BUTTON ----- */
  .cta-container {
    text-align: center;
    margin-top: 2rem;
  }

  .cta-button {
    background: rgb(29 45 31);
    color: white;
    font-size: 1.25rem;
    padding: 0.9rem 2rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: 0.2s;
  }

  .cta-button:hover {
    background: rgb(24 113 35);
    transform: translateY(-3px);
  }

  .cta-button:active {
    transform: translateY(0);
  }
</style>

<div class="hero">
  <div class="hero-content">
    <div class="hero-title">Reis terug naar de prehistorie</div>
    <div class="hero-subtitle">
      Ontdek hoe dinosaurussen leefden, jaagden en evolueerden door
      miljoenen jaren geschiedenis. Stap in een wereld vóór de mens.
    </div>
  </div>
</div>

<div class="intro">
  Dinosaurussen domineerden de aarde meer dan <strong>160 miljoen jaar</strong>.
  Ze varieerden van kleine roofdieren van slechts vijftig centimeter tot
  reusachtige titanen zoals de Argentinosaurus, die ruim dertig meter
  lang werd. Sommige soorten konden vliegen, andere renden sneller dan
  een auto, en weer anderen jaagden in groepen zoals moderne roofdieren.
  Hun leefomgeving bestond uit dichte jungles, vulkanische vlaktes,
  kustgebieden en uitgestrekte savannes. Dankzij fossielen weten we dat
  dinosaurussen bestonden in allerlei kleuren, schubpatronen en vormen,
  elk aangepast aan hun eigen overlevingsstrategie.
</div>

<div class="cta-container">
  <a href="/compare">
    <button class="cta-button">Vergelijk dinosaurussen</button>
  </a>
</div>
