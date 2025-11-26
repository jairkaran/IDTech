# Dino Compare — Svelte Project
Interactieve dinosaurussen-vergelijker gebouwd met Svelte. Gebruikers kunnen dinos selecteren, kaartjes bekijken en visuele vergelijkingen maken.

---

## Features

- ✔️ Overzicht van alle dinos uit de Bruno Dino API  
- ✔️ Klikbare kaarten om een dinosaurus te selecteren  
- ✔️ Dynamische vergelijkingsweergave  
- ✔️ Svelte stores voor state management  
- ✔️ Gestandaardiseerde data via een normalizer  
- ✔️ Fetch-laag met timeout en error-handling  

---

## Projectstructuur

```
src/
 └ lib/
    ├ components/
    │   ├ DinoCard.svelte
    │   ├ WeightChart.svelte
    │   └ FilterBar.svelte
    ├ services/
    │   ├ dinoAPI.js
    │   └ http.js
    └ stores/
        └ dinos.js
```

---

## API-laag

### dinoAPI.js  
- `fetchDinoList()` haalt alle dinos op  
- `fetchSingleDino(name)` haalt details uit dezelfde lijst  
- `fetchDinoNames()` haalt alle namen op  
- Normalizer converteert inconsistenties naar:  
  - `length_m`, `weight_kg`, `image`, `period`, `diet`

### http.js  
- `getJSON(url)` met timeout, abort controller en foutafhandeling  

---

## State Management (Svelte stores)

### dinos.js  
- `dinoNames` — lijst van alle namen  
- `selectedDinos` — dinos voor de vergelijking  
- `loading` — fetch status  
- `error` — foutmeldingen  
- `loadDinoNames()` — initialiseert namen  
- `loadSingleDino(name)` — voegt een dinosaurus toe

Gebruik in componenten:

```js
import { loadDinoNames, loadSingleDino } from "$lib/stores/dinos";

onMount(() => {
  loadDinoNames();
});
```

---

## Installatie

```bash
npm install
npm run dev
```

---

## Gebruik

### Namen laden
```js
import { loadDinoNames } from "$lib/stores/dinos";
onMount(loadDinoNames);
```

### Dino selecteren
```js
import { loadSingleDino } from "$lib/stores/dinos";

function select(name) {
  loadSingleDino(name);
}
```

---

##  Componenten

### DinoCard.svelte  
Toont afbeelding en naam. Klikbaar om een dinosaurus te selecteren.

### WeightChart.svelte  
Toont gewichtvergelijking op basis van `selectedDinos`.

### Compare View  
Bundelt kaarten en grafieken in één scherm.

---

##  Licentie

MIT License.
