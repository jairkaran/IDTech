<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { dinos, loading, loadDinos } from '$lib/stores/dinos.js';

  let svgContainer;
  let selectedDino = null;
  let availableDinos = [];

  // vaste menselijke referentie
  const humanHeight = 1.8; // meter

  // zodra de pagina laadt
  onMount(async () => {
    if ($dinos.length === 0) await loadDinos();
    availableDinos = $dinos.filter(d => d.length_m && d.length_m > 0);
    selectedDino = availableDinos.find(d => d.name.toLowerCase().includes('rex')) || availableDinos[0];
    renderViz();
  });

  function renderViz() {
    if (!selectedDino) return;
    const dinoLength = selectedDino.length_m ?? 0;
    const maxLength = Math.max(dinoLength, 12); // schaalbasis
    const width = 600;
    const height = 300;

    // maak SVG leeg
    d3.select(svgContainer).selectAll('*').remove();

    const svg = d3.select(svgContainer)
      .attr('width', width)
      .attr('height', height);

    // schaalverhouding: 1 meter = X pixels
    const scale = d3.scaleLinear()
      .domain([0, maxLength])
      .range([0, width - 100]);

    // Mens (altijd 1.8 m)
    svg.append('rect')
      .attr('x', 40)
      .attr('y', height - scale(humanHeight) - 30)
      .attr('width', 20)
      .attr('height', scale(humanHeight))
      .attr('fill', '#444');

    svg.append('text')
      .attr('x', 50)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .text('Mens (1.8 m)');

    // Dino (breedte en hoogte visueel)
    svg.append('rect')
      .attr('x', 150)
      .attr('y', height - scale(dinoLength / 3) - 30) // arbitrair hoogteverhouding
      .attr('width', scale(dinoLength))
      .attr('height', scale(dinoLength / 3))
      .attr('fill', '#69b3a2')
      .attr('opacity', 0.8);

    svg.append('text')
      .attr('x', 150 + scale(dinoLength) / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .text(`${selectedDino.name} (${dinoLength.toFixed(1)} m)`);

    // tooltip bij hover
    const tooltip = d3.select('#tooltip');
    svg.selectAll('rect')
      .on('mouseover', (event, d) => {
        tooltip.style('opacity', 1)
          .html(`
            <b>${selectedDino.name}</b><br>
            Lengte: ${selectedDino.length_m?.toFixed(1)} m<br>
            Gewicht: ${selectedDino.weight_kg ?? 'n.v.t.'} kg
          `)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', () => tooltip.style('opacity', 0));
  }

  function updateSelection(name) {
    selectedDino = availableDinos.find(d => d.name === name);
    renderViz();
  }
</script>

{#if $loading}
  <p class="status">Data laden...</p>
{:else}
  <div class="controls">
    <label>Kies een dinosaurus:</label>
    <select on:change={(e) => updateSelection(e.target.value)}>
      {#each availableDinos as d}
        <option value={d.name} selected={selectedDino && d.name === selectedDino.name}>
          {d.name}
        </option>
      {/each}
    </select>
  </div>

  <svg bind:this={svgContainer}></svg>
  <div id="tooltip" class="tooltip"></div>
{/if}

<style>
.status {
  text-align:center;
  color:#777;
}
.controls {
  margin: 1rem;
  display:flex;
  flex-direction:column;
  gap:0.5rem;
}
svg {
  display:block;
  margin:auto;
  background:#f9f9f9;
  border:1px solid #ddd;
  border-radius:6px;
}
.tooltip {
  position:absolute;
  background:white;
  padding:6px 10px;
  border:1px solid #ccc;
  border-radius:6px;
  pointer-events:none;
  font-size:0.9rem;
  opacity:0;
  transition:opacity 0.2s;
}
</style>
