import { writable } from "svelte/store";
import {
  fetchDinoNames,
  fetchSingleDino,
  fetchDinoList
} from "$lib/services/dinoAPI.js";

/*
  ─────────────────────────────────────────────────────────────
  STORES
  Centrale state-laag voor Dino Compare.
  Deze stores fungeren als single source of truth voor:
  - beschikbare dinosaurusdata
  - gebruikersselecties
  - laad- en foutstatus
  UI-componenten lezen uitsluitend uit deze stores.
  ─────────────────────────────────────────────────────────────
*/

// Lijst met alle beschikbare dinosaurusnamen
// Wordt gebruikt voor selectie- en filtercomponenten
export const dinoNames = writable([]);

// Dinosaurusobjecten die door de gebruiker zijn geselecteerd
// voor vergelijking
export const selectedDinos = writable([]);

// Globale loading state voor data-ophaling
// Voorkomt dubbele requests en maakt UI-feedback mogelijk
export const loading = writable(false);

// Centrale foutmelding voor data-gerelateerde fouten
// Wordt getoond in de UI, niet gegenereerd in componenten
export const error = writable("");

// Volledige lijst met genormaliseerde dinosaurusobjecten
// Deze store wordt nooit direct gemuteerd door filters
export const allDinos = writable([]);

// Subset van allDinos op basis van actieve filters
// Leeg zolang er geen filters zijn toegepast
export const filteredDinos = writable([]);

/*
  ─────────────────────────────────────────────────────────────
  STORE FUNCTIES
  Verantwoordelijk voor het ophalen en bijwerken van state.
  Fetch-logica zit hier, nooit in componenten.
  ─────────────────────────────────────────────────────────────
*/

/**
 * Haalt alle dinosaurusnamen op via de service layer.
 * Wordt gebruikt voor dropdowns en zoekfunctionaliteit.
 */
export async function loadDinoNames() {
  loading.set(true);
  error.set("");

  try {
    const names = await fetchDinoNames();
    dinoNames.set(names);
  } catch (e) {
    // Foutmelding wordt centraal afgehandeld via error store
    error.set("Kon dino-namen niet laden.");
  } finally {
    loading.set(false);
  }
}

/**
 * Laadt één dinosaurus en voegt deze toe aan de vergelijking.
 * De UI geeft alleen de naam door en kent de data-structuur niet.
 *
 * @param {string} name - Naam van de geselecteerde dinosaurus
 */
export async function loadSingleDino(name) {
  loading.set(true);

  try {
    const dino = await fetchSingleDino(name);

    // Alleen toevoegen als de dinosaurus daadwerkelijk bestaat
    if (dino) {
      selectedDinos.update(list => [...list, dino]);
    }
  } catch (e) {
    error.set("Kon dinosaurus niet laden.");
  } finally {
    loading.set(false);
  }
}

/**
 * Laadt de volledige dinosaurusdataset.
 * Deze functie vult alleen allDinos.
 * Filtering gebeurt los daarvan via filteredDinos.
 */
export async function loadAllDinos() {
  loading.set(true);

  try {
    const list = await fetchDinoList();
    allDinos.set(list);

    // filteredDinos blijft bewust leeg totdat filters worden toegepast
  } catch (e) {
    error.set("Kon dinosauriër lijst niet laden.");
  } finally {
    loading.set(false);
  }
}
