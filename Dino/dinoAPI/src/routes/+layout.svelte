<nav class="nav">
  <a href="/">Home</a>
  <a href="/filters">Filters</a>
</nav>

<main>
  <slot /> <!-- hier worden pagina’s getoond -->
</main>

<style>
.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: #fafafa;
}
.nav a {
  text-decoration: none;
  color: #222;
  font-weight: 500;
}
main {
  padding: 0;
  margin: 0;
}
</style>
