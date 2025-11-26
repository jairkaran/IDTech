<script>
  import { onMount } from 'svelte';
  import DinoCard from '$lib/components/DinoCard.svelte';
  import WeightChart from '$lib/components/WeightChart.svelte';
  import FilterBar from '$lib/components/FilterBar.svelte';

  import {
    allDinos,
    filteredDinos,
    loadAllDinos,
    error,
    loading
  } from '$lib/stores/dinos.js';

  // Namen van dinos die aangevinkt zijn
  let checkedNames = [];

  // Lijst met volledige dino-objecten die geselecteerd zijn
  let selectedList = [];

  onMount(() => {
    loadAllDinos();
  });

  // Checkbox togglen
  function toggleCheck(name) {
    if (checkedNames.includes(name)) {
      checkedNames = checkedNames.filter(n => n !== name);
    } else {
      checkedNames = [...checkedNames, name];
    }
  }

  // Zorg dat selectedList altijd klopt met checkedNames en allDinos
  $: selectedList = $allDinos.filter(dino => checkedNames.includes(dino.name));
</script>

<h2>Kies een dinosaurus:</h2>

{#if $error}
  <p style="color:red">{$error}</p>
{/if}

<FilterBar />

<!-- Filterresultaten met checkbox per kaart -->
<div class="compare-grid">
  {#each $filteredDinos as dino (dino.name)}
    <div
      class={`card-select ${checkedNames.includes(dino.name) ? 'card-select--checked' : ''}`}
    >
      <input
        type="checkbox"
        class="card-checkbox"
        checked={checkedNames.includes(dino.name)}
        on:change={() => toggleCheck(dino.name)}
      />

      <DinoCard {dino} />
    </div>
  {/each}
</div>

<hr />

<h2>Geselecteerde dino's:</h2>

<div class="cards">
  {#each selectedList as dino (dino.name)}
    <DinoCard {dino} />
  {/each}
</div>

{#if selectedList.length >= 1}
  <div class="chart-container">
    <h2>Gewicht vergelijking</h2>
    <WeightChart dinos={selectedList} />
  </div>
{/if}

<style>
/* ===== PAGE LAYOUT ===== */

h2 {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
  color: #2b3e2f;
  font-weight: 700;
}

/* Wrapper rond filters */
.filter-bar-wrapper {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

/* ===== FILTERRESULTATEN GRID ===== */

.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

/* Wrapper om kaart, exact passend */
.card-select {
  position: relative;
  width: fit-content;
  margin: 0 auto;
}

/* Checkbox styling */
.card-checkbox {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  accent-color: #8f9f61;
  z-index: 10;
  filter: drop-shadow(0 0 5px rgba(0,0,0,0.2));
}

/* Highlight geselecteerde kaart */
.card-select--checked .card {
  outline: 3px solid #8f9f61;
  outline-offset: 3px;
  border-radius: 12px;
  transition: 0.2s ease;
}

/* ===== GESELECTEERDE DINO’S GRID ===== */

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  padding: 2rem 1rem; /* extra ruimte LINKS en RECHTS */
}

/* ===== CHART CONTAINER ===== */

.chart-container {
  margin: 2rem auto;
  max-width: 750px;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 14px;

  border: 2px solid #d8dfd2;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}


/* ===== BUTTON VOEG TOE ===== */

.button {
  position: relative;
  width: 160px;
  height: 42px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #3b6e45;
  background-color: #4c8f55;
  margin: 1rem auto;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.25);
}

.button .button__text {
  transform: translateX(26px);
  color: #fff;
  font-weight: 600;
}

.button .button__icon {
  position: absolute;
  transform: translateX(115px);
  height: 100%;
  width: 42px;
  background-color: #3b6e45;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button .svg {
  width: 30px;
  stroke: #fff;
}

.button:hover {
  background: #3b6e45;
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 160px;
  transform: translateX(0);
}

.button:disabled {
  opacity: 0.4;
  cursor: default;
}

/* ===== PAGE SPACING ===== */

hr {
  margin: 2rem 0;
  border-color: #d4d4d4;
}

</style>