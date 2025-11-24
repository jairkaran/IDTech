<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let dinos = [];

  let svgEl;

  // kleine helper om "Late Cretaceous, 97 Ma" → 97 te maken
  function parseMa(range) {
    if (!range) return null;
    const match = range.match(/([\d.]+)\s*Ma/i);
    return match ? Number(match[1]) : null;
  }

  function draw() {
    if (!svgEl) return;
    const data = dinos
      .map(d => ({ name: d.name, ma: parseMa(d.temporalRange) }))
      .filter(d => d.ma !== null);

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 80, left: 60 };

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    if (!data.length) return;

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.ma) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.ma))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d.ma));

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Leeftijd van geselecteerde dino’s (Ma)');
  }

  onMount(draw);
  $: if (dinos && dinos.length) draw();
</script>

<svg bind:this={svgEl}></svg>
