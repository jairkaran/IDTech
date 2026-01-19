<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  /*
    ─────────────────────────────────────────────────────────────
    PROPS
    Ontvangt een lijst met dinosaurusobjecten.
    De component is volledig stateless en vertrouwt
    op externe state (stores / parent component).
    ─────────────────────────────────────────────────────────────
  */
  export let dinos = [];

  // Referentie naar het SVG-element
  // Nodig omdat D3 direct met het DOM-element werkt
  let svgEl;

  /*
    ─────────────────────────────────────────────────────────────
    HELPERS
    Kleine hulpfuncties voor data-voorbereiding.
    Visualisatie-logica werkt alleen met schone data.
    ─────────────────────────────────────────────────────────────
  */

  /**
   * Extraheert een numerieke waarde (Ma) uit een tijdsrange-string.
   * Voorbeeld: "Late Cretaceous, 97 Ma" → 97
   *
   * @param {string} range
   * @returns {number|null}
   */
  function parseMa(range) {
    if (!range) return null;

    const match = range.match(/([\d.]+)\s*Ma/i);
    return match ? Number(match[1]) : null;
  }

  /*
    ─────────────────────────────────────────────────────────────
    DRAW FUNCTION
    Verantwoordelijk voor het renderen van de D3-visualisatie.
    Wordt aangeroepen:
    - bij mount
    - bij veranderingen in de dinos input
    ─────────────────────────────────────────────────────────────
  */
  function draw() {
    // Guard: render alleen als het SVG-element beschikbaar is
    if (!svgEl) return;

    // Voorbereiden en opschonen van data
    // Alleen dinos met een valide leeftijd worden meegenomen
    const data = dinos
      .map(d => ({
        name: d.name,
        ma: parseMa(d.temporalRange)
      }))
      .filter(d => d.ma !== null);

    // Basisafmetingen en marges van de grafiek
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 80, left: 60 };

    // Selecteer SVG en reset eerdere renders
    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Guard: stop rendering als er geen valide data is
    if (!data.length) return;

    /*
      ─────────────────────────────────────────────────────────
      SCALES
      x: categorisch (dinosaurusnamen)
      y: lineair (leeftijd in Ma)
      ─────────────────────────────────────────────────────────
    */
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.ma) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    /*
      ─────────────────────────────────────────────────────────
      ASSEN
      Tekst van de x-as wordt gedraaid voor leesbaarheid
      bij langere dinosaurusnamen.
      ─────────────────────────────────────────────────────────
    */
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("font-size", "10px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    /*
      ─────────────────────────────────────────────────────────
      BARS
      Hoogte van de balk wordt berekend op basis van y-schaal
      ─────────────────────────────────────────────────────────
    */
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.ma))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d.ma));

    // Titel van de grafiek
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Leeftijd van geselecteerde dino’s (Ma)");
  }

  /*
    ─────────────────────────────────────────────────────────────
    LIFECYCLE & REACTIVITY
    - onMount: initiële render
    - reactive statement: her-render bij gewijzigde input
    ─────────────────────────────────────────────────────────────
  */
  onMount(draw);

  $: if (dinos && dinos.length) {
    draw();
  }
</script>

<!--
  SVG wordt leeg gerenderd.
  D3 beheert de volledige inhoud van dit element.
-->
<svg bind:this={svgEl}></svg>
