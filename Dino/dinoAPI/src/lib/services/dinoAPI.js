// src/lib/services/dinoAPI.js
import { getJSON } from './http.js';

// Basis-URL's
const BRUNO_BASE = 'https://dinoapi.brunosouzadev.com/api';
// const HOOK_BASE  = 'https://dino-facts.hookerhillstudios.com/api';
const GB_BASE    = 'https://raw.githubusercontent.com/GeorgeBetts/Dinosaur-API/master';

// Kleine hulpfuncties
function toNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function makeId(name, src) {
  return `${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `__${src}`;
}

/* ====================================================
   1. Bruno Souza Dev – DinoAPI
   ==================================================== */
async function fetchBrunoAll() {
  try {
    const data = await getJSON(`${BRUNO_BASE}/dinosaurs`);
    return data.map(dino => ({
      id: dino.id?.toString() || makeId(dino.name, 'bruno'),
      name: dino.name ?? 'Unknown',
      period: dino.period ?? null,
      diet: dino.diet ?? null,
      type: dino.type ?? null,
      family: dino.family ?? null,
      length_m: toNum(dino.length),
      height_m: toNum(dino.height),
      weight_kg: toNum(dino.weight),
      region: dino.region ?? null,
      image: dino.image ?? null,
      source: 'bruno'
    }));
  } catch (err) {
    console.warn('Bruno API mislukt:', err.message);
    return [];
  }
}

// async function fetchHookAll() {
//   try {
//     const data = await getJSON(`${HOOK_BASE}/dinosaurs`);
//     return data.map(dino => ({
//       id: makeId(dino.name, 'hookerhill'),
//       name: dino.name ?? 'Unknown',
//       period: dino.period ?? null,
//       diet: dino.diet ?? null,
//       type: dino.type ?? null,
//       family: dino.family ?? null,
//       length_m: toNum(dino.length),
//       height_m: toNum(dino.height),
//       weight_kg: toNum(dino.weight),
//       region: dino.region ?? null,
//       image: dino.image ?? null,
//       source: 'hookerhill'
//     }));
//   } catch (err) {
//     console.warn('HookerHill API mislukt:', err.message);
//     return [];
//   }
// }

/* ====================================================
   3. George Betts – Dinosaur API (GitHub)
   ==================================================== */
async function fetchGBAll() {
  try {
    const data = await getJSON(`${GB_BASE}/data/dinosaurs.json`);
    return data.map(dino => ({
      id: makeId(dino.name, 'georgebetts'),
      name: dino.name ?? 'Unknown',
      period: dino.period ?? null,
      diet: dino.diet ?? null,
      type: dino.type ?? null,
      family: dino.family ?? null,
      length_m: toNum(dino.length),
      height_m: toNum(dino.height),
      weight_kg: toNum(dino.weight),
      region: dino.region ?? null,
      image: null, // meestal geen afbeeldingen aanwezig
      source: 'georgebetts'
    }));
  } catch (err) {
    console.warn('GeorgeBetts API mislukt:', err.message);
    return [];
  }
}

/* ====================================================
   4. Samengevoegde functie
   ==================================================== */
export async function fetchAllDinos() {
  const [bruno, george] = await Promise.all([
    fetchBrunoAll(),
    fetchGBAll()
  ]);

  // Combineer alle resultaten
//   const all = [...bruno, ...hooker, ...george];
    const all = [...bruno, ...george];
  

  // Verwijder duplicaten op basis van naam + periode
  const seen = new Set();
  const deduped = [];
  for (const d of all) {
    const key = `${d.name?.toLowerCase()}__${d.period || 'n/a'}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(d);
    }
  }

  return deduped;
}
