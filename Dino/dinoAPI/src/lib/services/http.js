// src/lib/services/http.js
export async function getJSON(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });

    if (!res.ok) {
      throw new Error(`Fout ${res.status} bij ophalen van ${url}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Fetch-fout:", err.message);
    throw err;

  } finally {
    clearTimeout(timeout);
  }
}
