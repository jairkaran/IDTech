<script>
	import { allDinos, filteredDinos } from '$lib/stores/dinos.js';
	import { get } from 'svelte/store';

	let search = '';
	let region = '';
	let diet = '';

	function applyFilters() {
		const dinos = get(allDinos);

		// Als alles leeg is → geen resultaten tonen
		if (!search && !diet && !region) {
			filteredDinos.set([]);
			return;
		}

		const result = dinos.filter(
			(d) =>
				(search ? d.name.toLowerCase().includes(search.toLowerCase()) : true) &&
				(diet ? d.diet === diet : true) &&
				(region ? d.region?.toLowerCase().includes(region.toLowerCase()) : true)
		);

		filteredDinos.set(result);
	}
</script>

<div class="filter-bar">
	<!-- NAME SEARCH -->
	<div class="wave-group">
		<input
			id="name-search"
			type="text"
			required
			class="input"
			bind:value={search}
			on:input={applyFilters}
		/>
		<span class="bar"></span>
		<label class="label" for="name-search">
			<span class="label-char" style="--index: 0">N</span>
			<span class="label-char" style="--index: 1">a</span>
			<span class="label-char" style="--index: 2">m</span>
			<span class="label-char" style="--index: 3">e</span>
		</label>
	</div>

	<!-- REGION SEARCH -->
	<div class="wave-group">
		<input
			id="region-search"
			type="text"
			required
			class="input"
			bind:value={region}
			on:input={applyFilters}
		/>
		<span class="bar"></span>
		<label class="label" for="region-search">
			<span class="label-char" style="--index: 0">R</span>
			<span class="label-char" style="--index: 1">e</span>
			<span class="label-char" style="--index: 2">g</span>
			<span class="label-char" style="--index: 3">i</span>
			<span class="label-char" style="--index: 4">o</span>
			<span class="label-char" style="--index: 5">n</span>
		</label>
	</div>

	<!-- DIET SELECT -->
	<select bind:value={diet} on:change={applyFilters} class="jurassic-select">
		<option value="">Diet</option>
		<option value="herbivore">Herbivore</option>
		<option value="carnivore">Carnivore</option>
		<option value="omnivore">Omnivore</option>
	</select>
</div>

<style>
	.filter-bar {
		display: flex;
		gap: 1.5rem;
		padding: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.wave-group {
		position: relative;
	}

	.wave-group .input {
		font-size: 16px;
		padding: 10px 10px 10px 5px;
		display: block;
		width: 200px;
		border: none;
		border-bottom: 1px solid #3d4b3d; /* dark moss line */
		background: transparent;
		color: #d8e6d3; /* pale fossil green */
	}

	.wave-group .input:focus {
		outline: none;
	}

	.wave-group .label {
		color: #6b7d6b; /* soft moss */
		font-size: 18px;
		position: absolute;
		left: 5px;
		top: 10px;
		display: flex;
		pointer-events: none;
	}

	.wave-group .label-char {
		transition: 0.2s ease all;
		transition-delay: calc(var(--index) * 0.05s);
	}

	.wave-group .input:focus ~ label .label-char,
	.wave-group .input:valid ~ label .label-char {
		transform: translateY(-20px);
		font-size: 14px;
		color: #8f9f61; /* Jurassic mossy green */
	}

	.wave-group .bar {
		position: relative;
		display: block;
		width: 200px;
	}

	.wave-group .bar:before,
	.wave-group .bar:after {
		content: '';
		height: 2px;
		width: 0;
		bottom: 1px;
		position: absolute;
		background: #8f9f61; /* mossy highlight */
		transition: 0.2s ease all;
	}

	.wave-group .bar:before {
		left: 50%;
	}
	.wave-group .bar:after {
		right: 50%;
	}

	.wave-group .input:focus ~ .bar:before,
	.wave-group .input:focus ~ .bar:after {
		width: 50%;
	}

	.jurassic-select {
		padding: 10px 12px;
		background: rgba(32, 43, 32, 0.7); /* dark greenish rock tint */
		border: 1px solid #3d4b3d;
		color: #d8e6d3;
		border-radius: 6px;
		font-size: 16px;
	}

	.jurassic-select:hover,
	.jurassic-select:focus {
		border-color: #8f9f61;
		outline: none;
		background: rgba(48, 58, 48, 0.9);
	}
</style>
