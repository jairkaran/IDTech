<script>
  export let dino;
</script>

<div class="card">
  <h3>{dino.name}</h3>

  {#if dino.image}
    <img src={dino.image} alt={dino.name} />
  {/if}

  <p><strong>Periode:</strong> {dino.period || "onbekend"}</p>
  <p><strong>Dieet:</strong> {dino.diet}</p>
  <p><strong>Gewicht:</strong> {dino.weight_kg}</p>
  <p><strong>Lengte:</strong> {dino.length_m}</p>
</div>

<style>
  .card {
    width: 260px;
    padding: 1rem;
    border-radius: 12px;
    background: rgb(27,77,62);
    color: white;
    transition: 0.2s ease;
    cursor: pointer;
  }

  .selected {
    border: 3px solid #8f9f61;
    transform: scale(1.02);
  }

  img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 0.5rem;
    object-fit: contain;
    max-height: 160px;
  }
</style>
