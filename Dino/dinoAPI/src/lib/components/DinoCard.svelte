<script>
  export let dino;
</script>

<article class="card">
  {#if dino.image}
    <img src={dino.image} alt={dino.name} />
  {/if}
  <h3>{dino.name}</h3>
  <p><strong>Periode:</strong> {dino.period || 'onbekend'}</p>
  <p><strong>Dieet:</strong> {dino.diet || 'onbekend'}</p>
  <p class="source">Bron: {dino.source}</p>
</article>

<style>
.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}
.card h3 {
  margin: 0.5rem 0 0.2rem 0;
}
.source {
  font-size: 0.8rem;
  color: #666;
}
</style>
