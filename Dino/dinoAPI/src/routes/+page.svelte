<script>
  import { onMount } from 'svelte';
  import { dinos, loading, error, loadDinos } from '$lib/stores/dinos.js';
  import DinoCard from '$lib/components/DinoCard.svelte';

  // laad dino's zodra de pagina start
  onMount(async () => {
    await loadDinos();
    console.log('Aantal dino’s geladen:', $dinos.length);
    console.log('Eerste voorbeeld:', $dinos[0]);
  });
</script>

<!-- UI weergave -->
{#if $loading}
  <p class="status">Dino data wordt geladen...</p>

{:else if $error}
  <p class="status error">{$error}</p>

{:else if $dinos.length === 0}
  <p class="status">Geen dino’s gevonden 😢</p>

{:else}
  <section class="grid">
    {#each $dinos as dino}
      <DinoCard {dino}/>
    {/each}
  </section>
{/if}

<style>
.status {
  text-align: center;
  padding: 1rem;
  color: #555;
}
.status.error {
  color: #b00020;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  padding: 1rem;
}
</style>
