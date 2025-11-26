import { writable } from "svelte/store";
import { fetchDinoNames, fetchSingleDino, fetchDinoList } from "$lib/services/dinoAPI.js";

export const dinoNames = writable([]);
export const selectedDinos = writable([]);
export const loading = writable(false);
export const error = writable("");
export const allDinos = writable([]);
export const filteredDinos = writable([]);

// Lade namen van de Bruno API
export async function loadDinoNames() {
  loading.set(true);
  error.set("");

  try {
    const names = await fetchDinoNames();
    dinoNames.set(names);
  } catch (e) {
    error.set("Kon dino-namen niet laden.");
  } finally {
    loading.set(false);
  }
}

// 1 dinosaurus toevoegen aan compare
export async function loadSingleDino(name) {
  loading.set(true);

  try {
    const dino = await fetchSingleDino(name);
    if (dino) {
      selectedDinos.update(list => [...list, dino]);
    }
  } catch (e) {
    error.set("Kon dinosaurus niet laden.");
  } finally {
    loading.set(false);
  }
}

export async function loadAllDinos() {
  loading.set(true);

  try {
    const list = await fetchDinoList();
    allDinos.set(list);
    // filteredDinos blijft leeg totdat er gefilterd wordt
  } catch (e) {
    error.set("Kon dinosauriër lijst niet laden.");
  } finally {
    loading.set(false);
  }
}