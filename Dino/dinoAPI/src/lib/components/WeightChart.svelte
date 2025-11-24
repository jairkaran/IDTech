<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // Ontvangt de geselecteerde dinos
  export let dinos = [];

  let svgEl;

  // -------------------------------
  // Gewicht parser (voor Bruno API)
  // -------------------------------
  function parseWeight(value) {
    if (!value) return null;

    let str = value.toString().toLowerCase().trim();

    // Alles behalve cijfers, dash, en isDigit → spaties
    str = str.replace(/[^0-9–-]+/g, " ");

    // Splits op dash (range)
    let parts = str.split(/[-–]/).map(x => x.trim()).filter(x => x.length > 0);

    // Range → gemiddeld gewicht
    if (parts.length === 2) {
      const n1 = Number(parts[0]);
      const n2 = Number(parts[1]);
      if (!isNaN(n1) && !isNaN(n2)) return Math.round((n1 + n2) / 2);
    }

    // Geen range → gebruik eerste nummer
    const first = Number(parts[0]);
    if (!isNaN(first)) return first;

    return null;
  }

  // -------------------------------
  // Hoofd functie: grafiek tekenen
  // -------------------------------
  function drawChart() {
    if (!svgEl) return;

    // Data normaliseren → { name, weight }
    const data = dinos
      .map(dino => ({
        name: dino.name,
        weight: parseWeight(dino.weight_kg ?? dino.weight)
      }))
      .filter(dino => dino.weight !== null && !isNaN(dino.weight));

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    if (data.length === 0) return;

    const width = 600;
    const height = 350;
    const margin = { top: 20, right: 20, bottom: 80, left: 60 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // FIX: schaal werkt bij enkel item en bij ranges
    const maxY = d3.max(data, dino => dino.weight);
    const yDomain = maxY === 0 ? [0, 1] : [0, maxY * 1.2];

    const x = d3
      .scaleBand()
      .domain(data.map(dino => dino.name))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain(yDomain)
      .range([height - margin.bottom, margin.top]);

    // X-as
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("font-size", "10px");

    // Y-as
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Bars tekenen
    svg.append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", dino => x(dino.name))
      .attr("y", dino => y(dino.weight))
      .attr("width", x.bandwidth())
      .attr("height", dino => y(0) - y(dino.weight))
      .attr("fill", "#1B4D3E");
  }

  onMount(drawChart);

  // Re-draw wanneer dinos veranderen
  $: if (dinos) drawChart();
</script>

<svg bind:this={svgEl}></svg>
