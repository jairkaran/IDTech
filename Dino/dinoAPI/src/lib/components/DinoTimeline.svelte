<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  export let dinos = []; // verwacht array met { name, period, existed }

  let svgEl;

  // tooltip state
  let tooltip = { show: false, x: 0, y: 0, name: "", period: "", existed: "" };

  function cleanPeriod(p) {
    if (!p) return "unknown";
    return String(p).trim().toLowerCase().replace(/\s+/g, " ");
  }

  // Parse strings zoals:
  // "70 - 68 million years ago"
  // "150–145 million years ago"
  // "70 to 68 million years ago"
  // "68 million years ago"
  function parseExisted(existed) {
    if (!existed) return null;
    const s = String(existed)
      .toLowerCase()
      .replace(/–/g, "-")
      .replace(/to/g, "-")
      .replace(/million years ago/g, "")
      .replace(/mya/g, "")
      .trim();

    const nums = s.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
    if (nums.length === 0) return null;

    if (nums.length === 1) {
      const v = nums[0];
      return { start: v, end: v };
    }

    const a = nums[0];
    const b = nums[1];
    return { start: Math.max(a, b), end: Math.min(a, b) };
  }

  // overlap check voor intervals in MYA: interval is [end, start]
  function overlaps(a, b) {
    return Math.max(a.end, b.end) <= Math.min(a.start, b.start);
  }

  // greedy lane assignment zodat overlappen onder elkaar komen
  function assignLanes(items) {
    const laneItems = [];
    for (const it of items) {
      let laneIndex = -1;
      for (let i = 0; i < laneItems.length; i++) {
        const last = laneItems[i][laneItems[i].length - 1];
        if (!overlaps(it.range, last.range)) {
          laneIndex = i;
          break;
        }
      }
      if (laneIndex === -1) {
        laneItems.push([it]);
        laneIndex = laneItems.length - 1;
      } else {
        laneItems[laneIndex].push(it);
      }
      it.lane = laneIndex;
    }
    return { laneCount: laneItems.length, items };
  }

  function draw() {
    if (!svgEl) return;

    const parsed = (dinos ?? [])
      .map(d => {
        const range = parseExisted(d?.existed);
        if (!range) return null;
        return {
          name: d?.name ?? "Unknown",
          period: cleanPeriod(d?.period),
          existedRaw: d?.existed ?? "",
          range
        };
      })
      .filter(Boolean);

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = 820;
    const baseHeight = 150;
    const margin = { top: 28, right: 18, bottom: 42, left: 18 };

    const minMya = d3.min(parsed, d => d.range.end) ?? 0;
    const maxMya = d3.max(parsed, d => d.range.start) ?? 0;

    // sorteer: oud -> jong (start hoog naar laag) en iets langer eerst
    parsed.sort((a, b) => (b.range.start - a.range.start) || ((b.range.start - b.range.end) - (a.range.start - a.range.end)));

    const { laneCount, items } = assignLanes(parsed);

    const laneHeight = 18;
    const height = Math.max(baseHeight, margin.top + margin.bottom + laneCount * laneHeight + 28);

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const periods = Array.from(new Set(items.map(d => d.period)));
    const color = d3.scaleOrdinal()
      .domain(periods)
      .range(d3.schemeTableau10.concat(d3.schemeSet3));

    // oud links -> nieuw rechts
    const x = d3.scaleLinear()
      .domain([maxMya, minMya])
      .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(x)
      .ticks(8)
      .tickFormat(d => `${d} MYA`);

    // grid
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(8).tickSize(-(height - margin.top - margin.bottom)).tickFormat(() => ""))
      .call(g => g.selectAll(".tick line").attr("stroke", "#e5e7eb"))
      .call(g => g.select(".domain").attr("stroke", "#e5e7eb"));

    // axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .call(g => g.select(".domain").attr("stroke", "#9ca3af"))
      .call(g => g.selectAll("text").style("font-size", "11px").style("fill", "#111827"));

    const y0 = margin.top + 10;
    const y = (lane) => y0 + lane * laneHeight;

    // legenda
    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top - 18})`);

    const legendItem = legend.selectAll("g")
      .data(periods.slice(0, 10))
      .join("g")
      .attr("transform", (d, i) => `translate(${i * 140}, 0)`);

    legendItem.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", 10).attr("height", 10)
      .attr("rx", 2)
      .attr("fill", d => color(d))
      .attr("fill-opacity", 0.75);

    legendItem.append("text")
      .attr("x", 14).attr("y", 9)
      .style("font-size", "11px")
      .style("fill", "#111827")
      .text(d => d);

    // bars
    const gBars = svg.append("g");

    gBars.selectAll("rect")
      .data(items, d => `${d.name}-${d.existedRaw}`)
      .join("rect")
      .attr("x", d => x(d.range.start))
      .attr("y", d => y(d.lane) - 8)
      .attr("width", d => Math.max(2, x(d.range.end) - x(d.range.start)))
      .attr("height", 12)
      .attr("rx", 6)
      .attr("fill", d => color(d.period))
      .attr("fill-opacity", 0.75)
      .attr("stroke", "transparent")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this)
          .attr("fill-opacity", 0.95)
          .attr("stroke", "#111827");

        tooltip = {
          show: true,
          x: event.offsetX + 12,
          y: event.offsetY - 10,
          name: d.name,
          period: d.period,
          existed: d.existedRaw
        };
      })
      .on("mousemove", function (event) {
        tooltip = { ...tooltip, x: event.offsetX + 12, y: event.offsetY - 10 };
      })
      .on("mouseleave", function () {
        d3.select(this)
          .attr("fill-opacity", 0.75)
          .attr("stroke", "transparent");

        tooltip = { ...tooltip, show: false };
      });

    // labels op bar (als er ruimte is)
    gBars.selectAll("text")
      .data(items, d => `${d.name}-${d.existedRaw}`)
      .join("text")
      .attr("x", d => x(d.range.start) + 6)
      .attr("y", d => y(d.lane) + 2)
      .style("font-size", "10px")
      .style("fill", "#111827")
      .style("pointer-events", "none")
      .text(d => d.name)
      .each(function (d) {
        const text = d3.select(this);
        const w = this.getComputedTextLength();
        const barW = Math.max(2, x(d.range.end) - x(d.range.start));
        if (w > barW - 10) text.text("");
      });
  }

  onMount(draw);
  $: dinos, draw();
</script>

<div class="timeline-wrap">
  <svg bind:this={svgEl} aria-label="Dinosaur timeline"></svg>

  <div
    class="tooltip {tooltip.show ? 'tooltip--show' : ''}"
    style="left:{tooltip.x}px; top:{tooltip.y}px;"
  >
    <div class="tooltip-title">{tooltip.name}</div>
    <div class="tooltip-sub">{tooltip.period}</div>
    <div class="tooltip-sub">{tooltip.existed}</div>
  </div>
</div>

<style>
  .timeline-wrap {
    position: relative;
    width: 100%;
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-6px);
    transition: opacity 120ms ease, transform 120ms ease;
    background: rgba(17, 24, 39, 0.92);
    color: white;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 12px;
    line-height: 1.2;
    max-width: 260px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
    z-index: 10;
  }

  .tooltip--show {
    opacity: 1;
    transform: translateY(0);
  }

  .tooltip-title {
    font-weight: 700;
    margin-bottom: 4px;
  }

  .tooltip-sub {
    opacity: 0.9;
  }
</style>
