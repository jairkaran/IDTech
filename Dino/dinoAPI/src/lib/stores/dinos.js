// src/lib/stores/dinos.js
import { writable } from 'svelte/store';
import { fetchAllDinos } from '$lib/services/dinoAPI.js';

export const dinos = writable([]);
export const loading = writable(false);
export const error = writable('');

export async function loadDinos() {
  loading.set(true);
  error.set('');
  try {
    const data = await fetchAllDinos();
    dinos.set(data);
  } catch (e) {
    console.error(e);
    error.set('Kon dino-data niet laden');
  } finally {
    loading.set(false);
  }
}
