<script>
  export let dino;
</script>

<div class="card">
  <h3>{dino.name}</h3>

  {#if dino.image}
    <img src={dino.image} alt={dino.name} />
  {/if}

  <p><strong>Periode:</strong> {dino.period || "onbekend"}</p>
  <p><strong>Dieet:</strong> {dino.diet || "onbekend"}</p>

  {#if dino.weight_kg}
    <p><strong>Gewicht:</strong> {dino.weight_kg} kg</p>
  {/if}

  {#if dino.length_m}
    <p><strong>Lengte:</strong> {dino.length_m} meter</p>
  {/if}
</div>

<style>
  .card {
    width: 260px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background: #fafafa;
  }
  img {
    width: 100%;
    border-radius: 8px;
    margin-bottom: .5rem;
  }
</style>
