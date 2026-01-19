// src/lib/services/http.js

/*
  ─────────────────────────────────────────────────────────────
  HTTP HELPER
  Centrale helper voor alle netwerkverzoeken binnen Dino Compare.

  Verantwoordelijkheden:
  - uitvoeren van fetch requests
  - afdwingen van een timeout
  - consistente foutafhandeling

  Door deze logica te centraliseren:
  - voorkomen we duplicatie van fetch-code
  - blijven services en stores overzichtelijk
  - wordt foutgedrag voorspelbaar in de hele applicatie
  ─────────────────────────────────────────────────────────────
*/

/**
 * Haalt JSON-data op via fetch met ingebouwde timeout.
 *
 * @param {string} url - Endpoint waar data wordt opgehaald
 * @param {number} timeoutMs - Timeout in milliseconden (default: 8000)
 * @returns {Promise<any>} Genormaliseerde JSON-respons
 * @throws {Error} Gooit een fout bij HTTP- of netwerkproblemen
 */
export async function getJSON(url, timeoutMs = 8000) {
  // AbortController wordt gebruikt om fetch af te breken bij timeout
  const controller = new AbortController();

  // Timer die de fetch afbreekt wanneer de timeout wordt overschreden
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Fetch met abort-signal voor gecontroleerde onderbreking
    const res = await fetch(url, { signal: controller.signal });

    // HTTP-statuscodes buiten 2xx worden als fout beschouwd
    if (!res.ok) {
      throw new Error(`Fout ${res.status} bij ophalen van ${url}`);
    }

    // Parse JSON-respons
    return await res.json();

  } catch (err) {
    // Loggen voor debugging; UI-afhandeling gebeurt via stores
    console.error("Fetch-fout:", err.message);

    // Fout wordt doorgegeven aan de aanroepende service
    throw err;

  } finally {
    // Opruimen van de timeout, ongeacht succes of fout
    clearTimeout(timeout);
  }
}
