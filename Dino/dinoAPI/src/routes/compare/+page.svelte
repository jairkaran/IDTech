<script>
  import { onMount } from "svelte";
  import DinoCard from "$lib/components/DinoCard.svelte";
  import WeightChart from "$lib/components/WeightChart.svelte";

  import {
    dinoNames,
    selectedDinos,
    loadDinoNames,
    loadSingleDino,
    loading,
    error
  } from "$lib/stores/dinos.js";

  let selected = "";

  onMount(() => {
    loadDinoNames(); // Bruno API = 18 dinos → snel
  });

  function add() {
    if (selected) {
      loadSingleDino(selected);
      selected = "";
    }
  }
</script>

<h2>Kies een dinosaurus:</h2>

{#if $error}
  <p style="color:red">{$error}</p>
{/if}

<select bind:value={selected}>
  <option value="">-- kies --</option>
  {#each $dinoNames as name}
    <option value={name}>{name}</option>
  {/each}
</select>

<button on:click={add} disabled={$loading}>
  Voeg toe
</button>

<hr />

<h2>Geselecteerde dino's:</h2>

<div class="cards">
  {#each $selectedDinos as dino}
    <DinoCard {dino} />
  {/each}
</div>

{#if $selectedDinos.length >= 1}
  <h2>Gewicht vergelijking</h2>
  <WeightChart dinos={$selectedDinos} />
{/if}

<style>
  .cards {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>
