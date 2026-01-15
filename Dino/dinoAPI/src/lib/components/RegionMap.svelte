<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  export let dinos = [];
  let svgEl;

  // Natural Earth (110m) via dezelfde CDN als je al gebruikt
  const LAND_URL =
    "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.geojson";

  const COUNTRIES_URL =
    "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson";

  let cachedLand = null;
  let cachedCountries = null;

  // geo cache voor de component (1x laden)
  let geo = null;

  function toSlug(s) {
    return String(s ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
  }

  // jouw dino region -> continent slug
  function normRegion(r) {
    if (!r) return null;
    const s = String(r).trim().toLowerCase();

    if (s.includes("north")) return "north_america";
    if (s.includes("south")) return "south_america";
    if (s.includes("europe")) return "europe";
    if (s.includes("asia")) return "asia";
    if (s.includes("africa")) return "africa";
    if (s.includes("oceania") || s.includes("australia")) return "oceania";
    if (s.includes("antarctica")) return "antarctica";

    return toSlug(s);
  }

  // Natural Earth land/country continent -> slug
  function continentSlugFromCountryFeature(f) {
    const p = f?.properties ?? {};
    const cont = p.CONTINENT ?? p.continent ?? p.Continent ?? null;
    if (!cont) return null;

    // Natural Earth gebruikt "North America" etc
    return toSlug(cont);
  }

  async function loadGeo() {
    if (!cachedLand) {
      const r = await fetch(LAND_URL);
      if (!r.ok) throw new Error("Failed to load land geojson");
      cachedLand = await r.json();
    }
    if (!cachedCountries) {
      const r = await fetch(COUNTRIES_URL);
      if (!r.ok) throw new Error("Failed to load countries geojson");
      cachedCountries = await r.json();
    }
    return { land: cachedLand, countries: cachedCountries };
  }

  function draw({ land, countries }) {
    if (!svgEl) return;

    const width = 760;
    const height = 420;
    const margin = 10;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");

    // projectie op basis van landmassa
    const projection = d3.geoNaturalEarth1()
      .fitExtent([[margin, margin], [width - margin, height - margin]], land);

    const path = d3.geoPath(projection);

    // kleuren per geselecteerde dino
    const palette = d3.schemeTableau10;
    const dinoColor = new Map(
      (dinos ?? []).map((d, i) => [d?.id ?? d?.name ?? String(i), palette[i % palette.length]])
    );

    // continentSlug -> [{name,color}, ...]
    const regionToColors = new Map();
    for (const d of (dinos ?? [])) {
      const key = normRegion(d?.region);
      if (!key) continue;

      const id = d?.id ?? d?.name;
      const c = dinoColor.get(id) ?? "#111827";
      const arr = regionToColors.get(key) ?? [];
      arr.push({ name: d?.name ?? "Unknown", color: c });
      regionToColors.set(key, arr);
    }

    function fillForContinent(continentSlug) {
      const picks = regionToColors.get(continentSlug) ?? [];
      if (picks.length === 0) return { fill: "#f3f4f6", opacity: 1 };

      if (picks.length === 1) return { fill: picks[0].color, opacity: 0.55 };

      // meerdere dinos zelfde continent -> gradient
      const gid = `grad-${continentSlug}-${picks.map(p => p.color.replace("#", "")).join("-")}`;

      if (defs.select(`#${CSS.escape(gid)}`).empty()) {
        const g = defs.append("linearGradient")
          .attr("id", gid)
          .attr("x1", "0%").attr("y1", "0%")
          .attr("x2", "100%").attr("y2", "0%");

        const n = picks.length;
        picks.forEach((p, i) => {
          const a = (i / n) * 100;
          const b = ((i + 1) / n) * 100;

          g.append("stop").attr("offset", `${a}%`).attr("stop-color", p.color).attr("stop-opacity", 0.55);
          g.append("stop").attr("offset", `${b}%`).attr("stop-color", p.color).attr("stop-opacity", 0.55);
        });
      }

      return { fill: `url(#${gid})`, opacity: 1 };
    }

    // achtergrond
    svg.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", width).attr("height", height)
      .attr("fill", "white");

    // land outline (zacht)
    svg.append("path")
      .datum(land)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#9ca3af")
      .attr("stroke-width", 0.7)
      .attr("stroke-opacity", 0.6);

    // landen tekenen en per continent highlighten
    svg.append("g")
      .selectAll("path")
      .data(countries?.features ?? [])
      .join("path")
      .attr("d", path)
      .attr("fill", f => {
        const contSlug = continentSlugFromCountryFeature(f);
        return fillForContinent(contSlug).fill;
      })
      .attr("fill-opacity", f => {
        const contSlug = continentSlugFromCountryFeature(f);
        return fillForContinent(contSlug).opacity;
      })
      .attr("stroke", "#9ca3af")
      .attr("stroke-width", 0.5)
      .attr("stroke-opacity", 0.6);

    // legenda met wrap naar meerdere rijen
    const items = (dinos ?? []).map((d, i) => ({
      name: d?.name ?? "Unknown",
      continent: normRegion(d?.region) ?? "unknown",
      color: palette[i % palette.length]
    }));

    const legendX = 12;
    const legendBottomPadding = 12;
    const rowHeight = 16;
    const itemWidth = 200;

    const itemsPerRow = Math.max(1, Math.floor((width - 2 * legendX) / itemWidth));
    const rows = Math.ceil(items.length / itemsPerRow);

    const legendStartY = height - legendBottomPadding - (rows * rowHeight);

    const legend = svg.append("g")
      .attr("transform", `translate(${legendX}, ${legendStartY})`);

    const li = legend.selectAll("g")
      .data(items)
      .join("g")
      .attr("transform", (d, i) => {
        const col = i % itemsPerRow;
        const row = Math.floor(i / itemsPerRow);
        return `translate(${col * itemWidth}, ${row * rowHeight})`;
      });

    li.append("rect")
      .attr("x", 0).attr("y", -10)
      .attr("width", 10).attr("height", 10)
      .attr("rx", 2)
      .attr("fill", d => d.color)
      .attr("fill-opacity", 0.75);

    li.append("text")
      .attr("x", 14).attr("y", -1)
      .style("font-size", "11px")
      .style("fill", "#111827")
      .text(d => `${d.name} • ${d.continent.replaceAll("_", " ")}`);
  }

  // load geo 1x
  onMount(async () => {
    geo = await loadGeo();
    if (svgEl && geo) draw(geo);
  });

  // redraw wanneer dinos verandert (zonder HMR)
  $: if (geo && svgEl) {
    const _ = dinos?.length ?? 0; // dependency
    draw(geo);
  }
</script>

<svg bind:this={svgEl} aria-label="World region map"></svg>
