<script>
  export let dino;
</script>

<div class="card">
  <h3>{dino.name}</h3>

  {#if dino.image}
    <img src={dino.image} alt={dino.name} />
  {/if}

  <p><strong>Periode:</strong> {dino.period || "onbekend"}</p>
  <!-- Dieet -->
<div class="diet-row">
  <strong>Dieet:</strong>
  <span class="diet-text">{dino.diet}</span>

  {#if dino.diet === 'herbivore'}
    <img src="./herbivore.png" alt="herbivoor" class="diet-icon" />

  {:else if dino.diet === 'carnivore'}
    <img src="./carnivore.png" alt="carnivoor" class="diet-icon" />

  {:else if dino.diet === 'omnivore'}
    <img src="/icons/herbivore.png" alt="omnivoor herbivoor" class="diet-icon" />
    <img src="/icons/carnivore.png" alt="omnivoor carnivoor" class="diet-icon" />

  {:else}
    <!-- Geen dieet bekend -->
  {/if}
</div>


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

  .diet-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.diet-text {
  text-transform: capitalize;
}

.diet-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

</style>
