export async function getJSON(url, timeoutMs = 8000) {
  // AbortController voor een eenvoudige timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });

    if (!res.ok) {
      throw new Error(`Fout ${res.status} bij ophalen van ${url}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch-fout:', err.message);
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
