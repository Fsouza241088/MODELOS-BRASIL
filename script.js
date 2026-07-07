const state = {
  search: "",
  category: "todos",
  engine: "todos",
  type: "todos",
  sort: "relevance"
};

const productGrid = document.querySelector("#productGrid");
const resultsCount = document.querySelector("#resultsCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const categoryFilters = document.querySelector("#categoryFilters");
const engineFilters = document.querySelector("#engineFilters");
const typeFilters = document.querySelector("#typeFilters");
const marketStrip = document.querySelector("#categorias");
const navToggle = document.querySelector("#navToggle");
const mainNav = document.querySelector("#mainNav");

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function categoryName(id) {
  return CATEGORIAS.find(c => c.id === id)?.nome || id;
}

function isLocalGlb(src) {
  return src && src.toLowerCase().endsWith(".glb");
}

function uniqueEngines() {
  return ["todos", ...new Set(PRODUTOS.flatMap(p => p.compatibilidade))];
}

function uniqueTypes() {
  return ["todos", ...new Set(PRODUTOS.map(p => p.tipo))];
}

function buildMarketStrip() {
  marketStrip.innerHTML = CATEGORIAS.filter(c => c.id !== "todos").map(c => `
    <a class="category-tile" href="#discover" data-category-tile="${c.id}">
      <strong>${c.nome}</strong>
      <span>${c.descricao}</span>
    </a>
  `).join("");

  document.querySelectorAll("[data-category-tile]").forEach(tile => {
    tile.addEventListener("click", () => {
      state.category = tile.dataset.categoryTile;
      syncFilterButtons();
      renderProducts();
    });
  });
}

function renderFilterButtons(container, values, key, labelFn = v => v) {
  container.innerHTML = values.map(value => `
    <button class="filter-chip ${state[key] === value ? "active" : ""}" data-key="${key}" data-value="${value}">
      ${value === "todos" ? "Todos" : labelFn(value)}
    </button>
  `).join("");
}

function syncFilterButtons() {
  renderFilterButtons(categoryFilters, CATEGORIAS.map(c => c.id), "category", categoryName);
  renderFilterButtons(engineFilters, uniqueEngines(), "engine");
  renderFilterButtons(typeFilters, uniqueTypes(), "type");

  document.querySelectorAll(".filter-chip").forEach(button => {
    button.addEventListener("click", () => {
      state[button.dataset.key] = button.dataset.value;
      syncFilterButtons();
      renderProducts();
    });
  });
}

function productMatches(product) {
  const text = [
    product.nome,
    product.subtitulo,
    product.descricaoCurta,
    categoryName(product.categoria),
    product.tipo,
    ...product.formatos,
    ...product.compatibilidade,
    ...product.tags
  ].join(" ").toLowerCase();

  const searchOk = text.includes(state.search.toLowerCase());
  const categoryOk = state.category === "todos" || product.categoria === state.category || product.compatibilidade.some(e => e.toLowerCase().includes(state.category));
  const engineOk = state.engine === "todos" || product.compatibilidade.includes(state.engine);
  const typeOk = state.type === "todos" || product.tipo === state.type;

  return searchOk && categoryOk && engineOk && typeOk;
}

function sortProducts(products) {
  const list = [...products];
  if (state.sort === "newest") return list.sort((a, b) => Number(b.novo) - Number(a.novo));
  if (state.sort === "price-low") return list.sort((a, b) => a.preco - b.preco);
  if (state.sort === "price-high") return list.sort((a, b) => b.preco - a.preco);
  return list.sort((a, b) => Number(b.destaque) - Number(a.destaque));
}

function productCard(product) {
  const media = isLocalGlb(product.glb)
    ? `<model-viewer class="card-viewer" src="${product.glb}" poster="${product.imagem}" camera-controls auto-rotate shadow-intensity="1" alt="${product.nome}"></model-viewer>`
    : `<div class="image-preview"><img src="${product.imagem}" alt="${product.nome}" /><span>Entrega por link externo</span></div>`;

  return `
    <article class="product-card">
      <div class="card-media">
        ${media}
        <span class="badge badge-category">${categoryName(product.categoria)}</span>
        ${product.novo ? `<span class="badge badge-new">Novo</span>` : ""}
      </div>
      <div class="card-body">
        <div class="card-title-row">
          <div>
            <h3>${product.nome}</h3>
            <p>${product.subtitulo}</p>
          </div>
          <strong>${product.precoTexto}</strong>
        </div>
        <div class="mini-specs">
          <span>${product.formatos.join(" / ")}</span>
          <span>${product.tamanho}</span>
          <span>${product.tipo}</span>
        </div>
        <div class="tag-row">${product.tags.slice(0, 4).map(tag => `<span>${tag}</span>`).join("")}</div>
        <div class="card-actions">
          <a class="btn btn-primary btn-small" href="produto.html?id=${product.id}">Ver detalhes</a>
          <a class="btn btn-ghost btn-small" href="mailto:fabricio.souza2088@gmail.com?subject=Compra - ${encodeURIComponent(product.nome)}">Comprar</a>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const filtered = sortProducts(PRODUTOS.filter(productMatches));
  resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "produto" : "produtos"}`;
  productGrid.innerHTML = filtered.length
    ? filtered.map(productCard).join("")
    : `<div class="empty-state"><h3>Nenhum produto encontrado</h3><p>Tente outra busca ou solicite um modelo personalizado.</p><a class="btn btn-primary" href="mailto:fabricio.souza2088@gmail.com?subject=Pedido personalizado - MODELOS BRASIL">Solicitar modelo</a></div>`;
}

searchInput.addEventListener("input", event => {
  state.search = event.target.value.trim();
  renderProducts();
});

sortSelect.addEventListener("change", event => {
  state.sort = event.target.value;
  renderProducts();
});

navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));

buildMarketStrip();
syncFilterButtons();
renderProducts();
