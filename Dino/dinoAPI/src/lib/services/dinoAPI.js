// src/lib/services/dinoApi.js
import { getJSON } from './http.js';

// -----------------------------
//  MAIN SOURCE: BRUNO DINO API
// -----------------------------
const BRUNO_BASE = "https://dinoapi.brunosouzadev.com/api/dinosaurs";

// Helpers
function makeId(name) {
  return (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Normalizer voor Bruno API (18 dinos)
function normalizeBruno(dino) {
  return {
    id: dino.id ?? makeId(dino.name),
    name: dino.name ?? "Unknown",
    description: dino.description ?? null,
    image: dino.image ?? null,
    length_m: dino.length ?? null,
    weight_kg: dino.weight ?? null,
    diet: dino.diet ?? null,
    period: dino.time_period ?? null,
    source: "bruno"
  };
}

// -----------------------------
// 1. Haal ALLE dinos op (18 entries)
// -----------------------------
export async function fetchDinoList() {
  const res = await getJSON(BRUNO_BASE);

  if (!Array.isArray(res)) return [];

  return res.map(normalizeBruno);
}

// -----------------------------
// 2. Haal details op van één dinosaurus
// Bruno API heeft GEEN detail endpoint
// Dus we gebruiken de lijst voor details
// -----------------------------
export async function fetchSingleDino(name) {
  const all = await fetchDinoList();

  return all.find(dino => dino.name === name) ?? null;
}

// -----------------------------
// 3. Alleen namen ophalen
// -----------------------------
export async function fetchDinoNames() {
  const list = await fetchDinoList();
  return list.map(dino => dino.name).sort((a, b) => a.localeCompare(b));
}
