# Donna Valentim — site institucional + catálogo

Site estático da loja **Donna Valentim** (moda feminina Slim e Plus — "Bom Gosto e Preço Justo"),
sem build: basta abrir `index.html` ou servir a pasta com qualquer servidor estático.

## Publicação

- **Site no ar:** https://ddesites.github.io/donna-valentim/
- **Repositório:** https://github.com/DDESites/donna-valentim (GitHub Pages, branch `main`)
- Para atualizar: edite os arquivos, depois `git add -A && git commit -m "..." && git push` —
  o Pages republica sozinho em ~1 minuto.

## Dados da marca usados no site

Coletados do Instagram oficial [@donna.valentim](https://www.instagram.com/donna.valentim/)
(58 mil seguidores) e do perfil reserva [@donnavalentim.dv](https://www.instagram.com/donnavalentim.dv/):

- Slogan: "Moda feminina Slim e Plus · Bom Gosto e Preço Justo"
- WhatsApps divulgados: (61) 99947-5014 e (61) 99847-9008
- Instagram oficial: @donna.valentim · reserva: @donnavalentim.dv · Threads: @donna.valentim
- Loja masculina do grupo: @valentimformen
- Loja física em **Águas Lindas de Goiás — GO** (cidade identificada pela geolocalização dos posts)
- Envio para todo o Brasil

## Fotos dos produtos

Os arquivos em `assets/img/produtos/` são **publicações oficiais da própria loja** no Instagram
(baixadas dos posts em outubro/2026). Cada produto no `data.js` guarda o link do post original
no campo `post` — a página do produto mostra "Ver esta peça no Instagram".

| Arquivo | Post original |
|---|---|
| p04 | instagram.com/p/DehmQbACU6k/ (conjunto colete e short rosa) |
| p05 | instagram.com/p/DeR6FJimJ0S/ (blusa de renda rosé com cinto) |
| p07 | instagram.com/p/Dehm4QGiSn6/ (conjunto tricot chocolate) |
| p09 | instagram.com/p/DeUxXLwGPWg/ (blusa chiffon gola alta) |
| p11 | instagram.com/p/DHY8Ql4ppNy/ (vestido midi estampado) |
| p12 | instagram.com/p/DHWtpUPPVon/ (conjunto satim off-white) |
| p13 | instagram.com/p/DHWco4gvrXX/ (macacão alfaiataria chocolate) |
| p15 | instagram.com/p/DHULmRHvfiU/ (blusa de babados branca) |
| p01, p02, p06 | material institucional da loja ("Compre online", "Check list", vitrine) |

As peças de **Acessórios** ainda não têm foto oficial — aparecem com o espaço reservado em CSS
rotulado "foto a caminho — consulte no WhatsApp" (de propósito: o site não usa fotos genéricas
fingindo ser produto real).

## Arquivos

- `index.html` — página inicial (com dados estruturados JSON-LD da loja)
- `novidades.html`, `roupas.html`, `acessorios.html` — categorias com filtros e ordenação
- `produto.html?id=<id>` — página de produto (galeria, tamanhos, favoritos, sacola)
- `sacola.html` — sacola, cupom, frete estimado e envio do pedido via WhatsApp
- `favoritos.html` — lista de desejos
- `sobre.html` — a marca + passo a passo "Como comprar"
- `contato.html` — WhatsApps, Instagram, loja física e formulário
- `politicas.html` — entrega, pagamento, trocas e privacidade (rascunho)
- `assets/css/style.css` — estilos
- `assets/js/data.js` — **configuração da loja + catálogo** (arquivo a editar)
- `assets/js/app.js` — comportamento das páginas

## Antes de publicar (pendências)

1. **Preços, tamanhos e estoque**: os 8 produtos com foto usam valores e disponibilidade
   **ilustrativos** em `assets/js/data.js` — trocar pelos reais (as legendas das categorias
   avisam para confirmar valores no WhatsApp).
2. **Endereço completo e horário** da loja física em Águas Lindas de Goiás (`LOJA.endereco`,
   `LOJA.horario`) — hoje aparecem como "a confirmar".
3. **E-mail** de atendimento (`LOJA.email`), se houver.
4. **Fotos dos acessórios** (bolsa, brincos, colar, cinto) — adicionar em `fotos:` quando tiver.
5. **Textos de políticas** em `politicas.html` — aprovar prazos, frete grátis (hoje R$ 399),
   trocas e privacidade com a loja.
6. **Cupons** (`BEMVINDA10`, `FRETEGRATIS`) e **frete estimado** (R$ 12,90, grátis acima de
   R$ 399, 5 a 12 dias úteis) são simulações em `data.js` — ajustar às regras reais.
7. **Logo**: a versão em script ("Sacramento") é uma reconstrução provisória — substituir pela
   arte oficial quando houver.
8. **Fotos em alta**: as imagens dos posts estão em 640 px; para campanhas maiores, baixar as
   versões originais (1080 px+) dos mesmos posts.

## Como rodar

Duplo clique em `index.html`, ou:

    npx serve donna-valentina
