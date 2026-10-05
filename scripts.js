let currentId = 25;

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resetBtn = document.getElementById("reset-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const catalogList = document.getElementById("catalog-list");

const screenMetaId = document.getElementById("screen-meta-id");
const pokemonImg = document.getElementById("pokemon-img");

const dexNumberName = document.getElementById("dex-number-name");
const dexTypeBadge = document.getElementById("dex-type-badge");
const dexSpecies = document.getElementById("dex-species");
const dexHeight = document.getElementById("dex-height");
const dexWeight = document.getElementById("dex-weight");
const dexDescription = document.getElementById("dex-description");

const hpBar = document.getElementById("hp-bar");
const hpVal = document.getElementById("hp-val");
const atkBar = document.getElementById("atk-bar");
const atkVal = document.getElementById("atk-val");
const defBar = document.getElementById("def-bar");
const defVal = document.getElementById("def-val");
const spdBar = document.getElementById("spd-bar");
const spdVal = document.getElementById("spd-val");

async function fetchPokemon(idOrName) {
    try {
        const query = String(idOrName).toLowerCase().trim();
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!res.ok) throw new Error("Pokémon no encontrado");
        const data = await res.json();

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        renderDex(data, speciesData);
    } catch (err) {
        alert("No se encontró el espécimen en la base de datos.");
    }
}

function renderDex(pokemon, species) {
    currentId = pokemon.id;
    const formattedId = String(pokemon.id).padStart(3, "0");
    const nameUpper = pokemon.name.toUpperCase();

    screenMetaId.textContent = `ID: #${formattedId} • ${nameUpper}`;
    pokemonImg.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;

    dexNumberName.textContent = `#${formattedId} ${nameUpper}`;
    const mainType = pokemon.types[0].type.name;
    dexTypeBadge.textContent = mainType.slice(0, 4).toUpperCase();

    dexHeight.textContent = `${pokemon.height / 10} m`;
    dexWeight.textContent = `${pokemon.weight / 10} kg`;

    const genera = species.genera.find(g => g.language.name === "es") || species.genera.find(g => g.language.name === "en");
    dexSpecies.textContent = genera ? genera.genus : "Desconocido";

    const flavor = species.flavor_text_entries.find(e => e.language.name === "es") || species.flavor_text_entries.find(e => e.language.name === "en");
    dexDescription.textContent = flavor ? `"${flavor.flavor_text.replace(/[\n\f]/g, " ")}"` : "Sin registro oficial.";

    const stats = {};
    pokemon.stats.forEach(s => stats[s.stat.name] = s.base_stat);

    hpVal.textContent = stats["hp"];
    hpBar.style.width = `${Math.min(stats["hp"], 100)}%`;

    atkVal.textContent = stats["attack"];
    atkBar.style.width = `${Math.min(stats["attack"], 100)}%`;

    defVal.textContent = stats["defense"];
    defBar.style.width = `${Math.min(stats["defense"], 100)}%`;

    spdVal.textContent = stats["speed"];
    spdBar.style.width = `${Math.min(stats["speed"], 100)}%`;

    prevBtn.textContent = `← #${String(Math.max(1, currentId - 1)).padStart(3, "0")}`;
    nextBtn.textContent = `#${String(Math.min(151, currentId + 1)).padStart(3, "0")} →`;
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (searchInput.value) {
        fetchPokemon(searchInput.value);
    }
});

resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    fetchPokemon(25);
});

prevBtn.addEventListener("click", () => {
    if (currentId > 1) fetchPokemon(currentId - 1);
});

nextBtn.addEventListener("click", () => {
    if (currentId < 151) fetchPokemon(currentId + 1);
});

async function loadCatalog() {
    for (let i = 19; i <= 26; i++) {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const p = await res.json();
            const div = document.createElement("div");
            div.className = "catalog-item";
            div.innerHTML = `
                <img src="${p.sprites.front_default}" alt="${p.name}">
                <span>#${String(p.id).padStart(3, "0")} ${p.name.toUpperCase()}</span>
                <span class="type-badge">${p.types[0].type.name.slice(0, 4).toUpperCase()}</span>
            `;
            div.addEventListener("click", () => fetchPokemon(p.id));
            catalogList.appendChild(div);
        } catch (e) {}
    }
}

window.addEventListener("load", () => {
    fetchPokemon(currentId);
    loadCatalog();
});