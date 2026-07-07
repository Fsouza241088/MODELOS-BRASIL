const page = document.querySelector("#productPage");
const navToggle = document.querySelector("#navToggle");
const mainNav = document.querySelector("#mainNav");

function getProductId() {
  return new URLSearchParams(window.location.search).get("id") || "carro-gol";
}

function categoryName(id) {
  return CATEGORIAS.find(c => c.id === id)?.nome || id;
}

function isLocalGlb(src) {
  return src && src.toLowerCase().endsWith(".glb");
}

function renderMedia(product) {
  if (isLocalGlb(product.glb)) {
    return `<model-viewer class="product-viewer" src="${product.glb}" poster="${product.imagem}" camera-controls auto-rotate shadow-intensity="1" alt="${product.nome}"></model-viewer>`;
  }
  return `<div class="product-viewer image-preview large"><img src="${product.imagem}" alt="${product.nome}" /><span>Arquivo principal entregue por link externo</span></div>`;
}

function renderProduct() {
  const product = PRODUTOS.find(item => item.id === getProductId());

  if (!product) {
    page.innerHTML = `
      <section class="not-found">
        <h1>Produto não encontrado</h1>
        <p>O produto solicitado não existe no catálogo atual.</p>
        <a class="btn btn-primary" href="index.html#discover">Voltar ao catálogo</a>
      </section>
    `;
    return;
  }

  document.title = `${product.nome} | MODELOS BRASIL`;

  const related = PRODUTOS.filter(item => item.id !== product.id && (item.categoria === product.categoria || item.compatibilidade.some(e => product.compatibilidade.includes(e)))).slice(0, 3);

  page.innerHTML = `
    <section class="product-hero-detail">
      <div class="product-media-panel">
        ${renderMedia(product)}
        <div class="gallery-row">
          ${product.galeria.map(img => `<img src="${img}" alt="Galeria ${product.nome}" />`).join("")}
        </div>
      </div>

      <aside class="buy-panel">
        <span class="kicker">${categoryName(product.categoria)}</span>
        <h1>${product.nome}</h1>
        <p>${product.subtitulo}</p>
        <strong class="price-main">${product.precoTexto}</strong>

        <div class="buy-actions">
          <a class="btn btn-primary" href="mailto:fabricio.souza2088@gmail.com?subject=Compra - ${encodeURIComponent(product.nome)}">Comprar agora</a>
          <a class="btn btn-ghost" href="mailto:fabricio.souza2088@gmail.com?subject=Dúvida - ${encodeURIComponent(product.nome)}">Falar com vendedor</a>
        </div>

        <div class="spec-list">
          <div><span>Formatos</span><strong>${product.formatos.join(" / ")}</strong></div>
          <div><span>Tamanho</span><strong>${product.tamanho}</strong></div>
          <div><span>Tipo</span><strong>${product.tipo}</strong></div>
          <div><span>Detalhe</span><strong>${product.poligonos}</strong></div>
        </div>
      </aside>
    </section>

    <section class="product-info-grid">
      <article class="info-card wide">
        <h2>Descrição completa</h2>
        <p>${product.descricaoCompleta}</p>
      </article>
      <article class="info-card">
        <h2>Compatibilidade</h2>
        <ul>${product.compatibilidade.map(item => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article class="info-card">
        <h2>Arquivos inclusos</h2>
        <ul>${product.inclusos.map(item => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article class="info-card">
        <h2>Detalhes técnicos</h2>
        <ul>${product.detalhes.map(item => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article class="info-card">
        <h2>Licença</h2>
        <p>${product.licenca}</p>
        <p class="small-note">Sugestão: futuramente criar uma página completa de Termos de Uso e Licença.</p>
      </article>
    </section>

    <section class="related-section">
      <div class="section-title">
        <span class="kicker">Relacionados</span>
        <h2>Outros modelos que combinam com este produto</h2>
      </div>
      <div class="product-grid compact">
        ${related.map(item => `
          <article class="product-card compact-card">
            <div class="card-media"><img src="${item.imagem}" alt="${item.nome}" /></div>
            <div class="card-body">
              <h3>${item.nome}</h3>
              <p>${item.descricaoCurta}</p>
              <a class="btn btn-primary btn-small" href="produto.html?id=${item.id}">Ver detalhes</a>
            </div>
          </article>
        `).join("") || `<p>Nenhum produto relacionado no momento.</p>`}
      </div>
    </section>
  `;
}

navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
renderProduct();
