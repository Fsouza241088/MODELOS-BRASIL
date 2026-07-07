# MODELOS BRASIL - Loja Marketplace V1 do Zero

Versão criada do zero para substituir os arquivos atuais no GitHub.

## Ideia
A estrutura foi pensada para ser uma vitrine profissional de modelos 3D brasileiros, com aparência próxima de marketplace moderno de assets digitais.

## Arquivos principais
- `index.html` — home, catálogo, categorias e filtros.
- `produto.html` — página individual de cada modelo.
- `produtos.js` — banco simples dos produtos.
- `script.js` — lógica do catálogo, busca, filtros e ordenação.
- `produto.js` — lógica da página detalhada do produto.
- `styles.css` — identidade visual completa.
- `logo.svg` — logo provisório em SVG.

## Pastas esperadas
Mantenha ou crie estas pastas no repositório:

```text
assets/
  carro_gol.png
  caminhao_volvo.png

glb/
  carro_gol.glb
```

Se algum arquivo de imagem ou GLB ainda não existir, o layout continua funcionando, mas o preview real depende dos caminhos corretos.

## Como acessar produto individual
Exemplos:

```text
produto.html?id=carro-gol
produto.html?id=caminhao-volvo
produto.html?id=pack-veiculos-brasil
produto.html?id=onibus-urbano-br
```

## Próximas evoluções
1. Adicionar domínio próprio.
2. Criar checkout Mercado Pago/Pix.
3. Criar página de termos/licença.
4. Criar entrega automática por link.
5. Migrar para Vercel/Next.js quando a loja crescer.
