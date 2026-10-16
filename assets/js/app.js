/* =========================================================
   Donna Valentim — comportamento do site
   ========================================================= */
(function () {
  "use strict";

  /* ---------- utilidades ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var brl = function (n) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
  var byId = function (id) { return PRODUTOS.filter(function (p) { return p.id === id; })[0]; };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var BAG = store.get("dv_bag", []);
  var FAVS = store.get("dv_favs", []);
  var page = document.body.getAttribute("data-page") || "";

  /* ---------- avisos (toast) ---------- */
  function toast(msg, tipo) {
    var wrap = $(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    var t = document.createElement("div");
    t.className = "toast" + (tipo === "erro" ? " is-err" : "");
    t.setAttribute("role", "status");
    t.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-check"></use></svg><span>' + esc(msg) + '</span>' +
      '<button type="button" aria-label="Fechar aviso">fechar</button>';
    t.querySelector("button").addEventListener("click", function () { t.remove(); });
    wrap.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.remove(); }, 5200);
  }

  /* ---------- fotos dos produtos ---------- */
  /* Com "fotos" (publicações oficiais da loja) renderiza a imagem real;
     sem foto, cai no espaço reservado em CSS. */
  function fotoHTML(p, idx, extraClass) {
    idx = idx || 0;
    var cls = "foto" + (extraClass ? " " + extraClass : "");
    var fotos = (p.fotos && p.fotos.length) ? p.fotos : null;
    if (fotos) {
      var arq = fotos[idx % fotos.length];
      var alt = esc(p.nome + " — foto oficial da " + LOJA.nome);
      return '<div class="' + cls + ' foto--real">' +
        '<img src="' + esc(arq) + '" alt="' + alt + '" loading="lazy" decoding="async" width="640" height="640">' +
        "</div>";
    }
    var v = VISUAIS[(p.visual + idx) % VISUAIS.length];
    var dark = (p.visual + idx) % VISUAIS.length === 5;
    var notas = p.fotoPendente ? ["foto a caminho", "consulte no whatsapp"] : ["foto do produto", "detalhe do tecido", "vista alternativa"];
    return '<div class="' + cls + (dark ? " foto--dark" : "") +
      '" style="--f1:' + v.f1 + ";--f2:" + v.f2 + '" aria-hidden="true">' +
      '<svg class="foto-ic ic" viewBox="0 0 24 24"><use href="#i-' + p.icone + '"></use></svg>' +
      '<span class="foto-sign">' + esc(LOJA.nome) + '</span>' +
      '<span class="foto-note">' + notas[idx % notas.length] + '</span>' +
      "</div>";
  }

  function estoqueTotal(p) { return p.tamanhos.reduce(function (s, t) { return s + t.e; }, 0); }
  function parcelamento(preco) {
    var cfg = LOJA.parcelamento;
    if (preco < cfg.valorMinimo) return "";
    return cfg.vezes + "x de " + brl(preco / cfg.vezes) + " sem juros";
  }

  /* ---------- cartão de produto ---------- */
  function cardHTML(p) {
    var fav = FAVS.indexOf(p.id) > -1;
    var esgotado = estoqueTotal(p) === 0;
    var badges = "";
    if (p.novo) badges += '<span class="badge">Novo</span>';
    if (p.precoAntigo) badges += '<span class="badge badge--sand">Oferta</span>';
    if (esgotado) badges += '<span class="badge badge--ghost">Esgotado</span>';

    return '<article class="card">' +
      '<div class="card-badges">' + badges + "</div>" +
      '<button type="button" class="fav-btn" data-fav="' + p.id + '" aria-pressed="' + fav + '" ' +
      'aria-label="' + (fav ? "Remover " + esc(p.nome) + " da lista de desejos" : "Adicionar " + esc(p.nome) + " à lista de desejos") + '">' +
      '<svg class="ic" aria-hidden="true"><use href="#i-heart"></use></svg></button>' +
      '<a class="card-media" href="produto.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' + fotoHTML(p, 0) + "</a>" +
      '<div class="card-body">' +
      '<span class="card-cat">' + esc(p.sub) + "</span>" +
      '<a href="produto.html?id=' + p.id + '"><h3 class="card-title">' + esc(p.nome) + "</h3></a>" +
      '<div class="card-price"><span>' + brl(p.preco) + "</span>" +
      (p.precoAntigo ? '<span class="price-old">' + brl(p.precoAntigo) + "</span>" : "") + "</div>" +
      '<div class="card-price price-pix">' + (parcelamento(p.preco) || "à vista no Pix") + "</div>" +
      '<div class="card-colors">' + p.cores.map(function (c) {
        return '<span class="dot" style="background:' + c.hex + '" title="' + esc(c.nome) + '"></span>';
      }).join("") + '<span class="sr-only">Cores: ' + p.cores.map(function (c) { return esc(c.nome); }).join(", ") + "</span></div>" +
      "</div></article>";
  }

  function renderGrid(el, lista) {
    if (!el) return;
    if (!lista.length) { el.innerHTML = ""; return; }
    el.innerHTML = lista.map(cardHTML).join("");
  }

  function estadoVazioHTML(titulo, texto, botao) {
    return '<div class="grid-state"><h2>' + esc(titulo) + "</h2><p>" + esc(texto) + "</p>" +
      (botao ? '<button type="button" class="btn btn--ghost" data-limpar>' + esc(botao) + "</button>" : "") + "</div>";
  }

  /* ---------- favoritos e sacola (contadores) ---------- */
  function atualizarContadores() {
    var b = $("[data-bag-count]"), f = $("[data-fav-count]");
    if (b) {
      var n = BAG.reduce(function (s, i) { return s + i.q; }, 0);
      b.textContent = n; b.classList.toggle("is-on", n > 0);
      b.parentNode.setAttribute("aria-label", n > 0 ? "Sacola de compras, " + n + (n === 1 ? " item" : " itens") : "Sacola de compras");
    }
    if (f) {
      var m = FAVS.length;
      f.textContent = m; f.classList.toggle("is-on", m > 0);
      f.parentNode.setAttribute("aria-label", m > 0 ? "Lista de desejos, " + (m === 1 ? "1 peça salva" : m + " peças salvas") : "Lista de desejos");
    }
  }
  function salvarBag() { store.set("dv_bag", BAG); atualizarContadores(); }
  function salvarFavs() { store.set("dv_favs", FAVS); atualizarContadores(); }

  function toggleFav(id) {
    var p = byId(id); if (!p) return;
    var i = FAVS.indexOf(id);
    if (i > -1) { FAVS.splice(i, 1); toast(p.nome + " saiu da sua lista de desejos."); }
    else { FAVS.push(id); toast(p.nome + " foi salvo na sua lista de desejos."); }
    salvarFavs();
    $$('[data-fav="' + id + '"]').forEach(function (btn) {
      var on = FAVS.indexOf(id) > -1;
      btn.setAttribute("aria-pressed", on);
      if (btn.hasAttribute("aria-label")) btn.setAttribute("aria-label", on ? "Remover " + p.nome + " da lista de desejos" : "Adicionar " + p.nome + " à lista de desejos");
    });
    if (page === "favoritos") renderFavoritos();
  }

  function adicionarSacola(id, tam, cor) {
    var p = byId(id); if (!p) return;
    var achou = BAG.filter(function (i) { return i.id === id && i.tam === tam && i.cor === cor; })[0];
    var t = p.tamanhos.filter(function (x) { return x.t === tam; })[0];
    var max = t ? t.e : 1;
    if (achou) {
      if (achou.q >= max) { toast("Você já tem todas as unidades disponíveis desse tamanho na sacola.", "erro"); return; }
      achou.q += 1;
    } else { BAG.push({ id: id, tam: tam, cor: cor, q: 1 }); }
    salvarBag();
    toast(p.nome + " (" + tam + ") foi adicionado à sacola.");
  }

  /* ---------- foco preso em painéis ---------- */
  function trapFocus(container, ev) {
    var f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', container)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }

  /* ---------- menu mobile ---------- */
  var menuEl = $("#menu-mobile");
  function abrirMenu() {
    if (!menuEl) return;
    menuEl.hidden = false;
    $(".menu-toggle").setAttribute("aria-expanded", "true");
    $(".menu-toggle").setAttribute("aria-label", "Fechar menu");
    document.body.style.overflow = "hidden";
    var a = menuEl.querySelector("a"); if (a) a.focus();
  }
  function fecharMenu() {
    if (!menuEl || menuEl.hidden) return;
    menuEl.hidden = true;
    $(".menu-toggle").setAttribute("aria-expanded", "false");
    $(".menu-toggle").setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
    $(".menu-toggle").focus();
  }

  /* ---------- busca ---------- */
  var buscaEl = $("#busca-overlay"), buscaInput = $("#busca-input"), buscaRes = $("#busca-results"), buscaTimer = null;
  function abrirBusca() {
    if (!buscaEl) return;
    buscaEl.hidden = false;
    document.body.style.overflow = "hidden";
    buscaInput.value = "";
    buscaRes.innerHTML = '<div class="search-hint">Digite para buscar no catálogo</div>';
    buscaInput.focus();
  }
  function fecharBusca() {
    if (!buscaEl || buscaEl.hidden) return;
    buscaEl.hidden = true;
    document.body.style.overflow = "";
  }
  function itemBuscaHTML(p) {
    return '<a class="search-item" href="produto.html?id=' + p.id + '">' + fotoHTML(p, 0) +
      "<span><strong>" + esc(p.nome) + "</strong><span>" + esc(p.sub) + " · " + brl(p.preco) + "</span></span></a>";
  }
  function buscar(termo) {
    termo = termo.trim().toLowerCase();
    if (termo.length < 2) { buscaRes.innerHTML = '<div class="search-hint">Digite para buscar no catálogo</div>'; return; }
    buscaRes.innerHTML = '<div class="skeleton">' +
      '<div class="sk-row"><div class="sk sk-img"></div><div style="flex:1"><div class="sk sk-l"></div><div class="sk sk-l2"></div></div></div>'.repeat(3) +
      "</div>";
    clearTimeout(buscaTimer);
    buscaTimer = setTimeout(function () {
      var res = PRODUTOS.filter(function (p) {
        var alvo = [p.nome, p.sub, p.desc, p.cores.map(function (c) { return c.nome; }).join(" ")].join(" ").toLowerCase();
        return alvo.indexOf(termo) > -1;
      });
      if (!res.length) {
        buscaRes.innerHTML = '<div class="search-empty"><p><strong>Nenhum produto encontrado para “' + esc(termo) + '”.</strong></p>' +
          "<p>Tente outro termo, como “vestido”, “saia” ou “bolsa”.</p>" +
          '<p style="margin-top:14px"><a class="link-arrow" href="roupas.html">Ver todas as roupas</a></p></div>';
        return;
      }
      buscaRes.innerHTML = res.slice(0, 8).map(itemBuscaHTML).join("") +
        (res.length > 8 ? '<div class="search-hint">' + res.length + " resultados — veja o catálogo completo</div>" : "");
    }, 240);
  }
  /* =========================================================
     Página inicial
     ========================================================= */
  function initHome() {
    renderGrid($("#grid-novidades"), PRODUTOS.filter(function (p) { return p.novo; }).slice(0, 4));
    renderGrid($("#grid-procurados"), PRODUTOS.filter(function (p) { return p.destaque; }).slice(0, 4));
    var el = $("#total-produtos"); if (el) el.textContent = PRODUTOS.length;
  }

  /* =========================================================
     Página de categoria
     ========================================================= */
  var estado = { tam: [], cor: [], faixa: [], disp: [], sort: "relevancia" };

  function baseCategoria() {
    var cat = document.body.getAttribute("data-cat") || "roupas";
    var lista = PRODUTOS.filter(function (p) {
      if (cat === "novidades") return p.novo;
      if (cat === "acessorios") return p.cat === "acessorios";
      if (cat === "roupas") return p.cat === "roupas";
      return true;
    });
    return { cat: cat, lista: lista };
  }

  function faixaDe(p) {
    if (p.preco < 150) return "ate150";
    if (p.preco < 250) return "150a250";
    if (p.preco < 400) return "250a400";
    return "acima400";
  }
  var FAIXAS = [
    { v: "ate150", t: "Até R$ 150" },
    { v: "150a250", t: "R$ 150 a R$ 250" },
    { v: "250a400", t: "R$ 250 a R$ 400" },
    { v: "acima400", t: "Acima de R$ 400" }
  ];
  var DISP = [
    { v: "pronta", t: "Pronta entrega" },
    { v: "ultimas", t: "Últimas peças" }
  ];

  function aplicar(lista) {
    return lista.filter(function (p) {
      if (estado.tam.length && !p.tamanhos.some(function (t) { return estado.tam.indexOf(t.t) > -1 && t.e > 0; })) return false;
      if (estado.cor.length && !p.cores.some(function (c) { return estado.cor.indexOf(c.nome) > -1; })) return false;
      if (estado.faixa.length && estado.faixa.indexOf(faixaDe(p)) < 0) return false;
      if (estado.disp.indexOf("pronta") > -1 && estoqueTotal(p) === 0) return false;
      if (estado.disp.indexOf("ultimas") > -1 && !p.tamanhos.some(function (t) { return t.e > 0 && t.e <= 2; })) return false;
      return true;
    });
  }

  function ordenar(lista) {
    var l = lista.slice();
    if (estado.sort === "novidades") l.sort(function (a, b) { return b.lancamento.localeCompare(a.lancamento); });
    else if (estado.sort === "menor") l.sort(function (a, b) { return a.preco - b.preco; });
    else if (estado.sort === "maior") l.sort(function (a, b) { return b.preco - a.preco; });
    else l.sort(function (a, b) { return (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0) || b.lancamento.localeCompare(a.lancamento); });
    return l;
  }

  function painelFiltros(base) {
    var tams = [], cores = [];
    base.forEach(function (p) {
      p.tamanhos.forEach(function (t) { if (tams.indexOf(t.t) < 0) tams.push(t.t); });
      p.cores.forEach(function (c) { if (!cores.some(function (x) { return x.nome === c.nome; })) cores.push(c); });
    });

    function grupo(titulo, corpo) { return '<div class="filter-group"><h2>' + titulo + "</h2>" + corpo + "</div>"; }

    var gTam = grupo("Tamanho", tams.map(function (t) {
      var n = base.filter(function (p) { return p.tamanhos.some(function (x) { return x.t === t && x.e > 0; }); }).length;
      return '<label class="check"><input type="checkbox" data-f="tam" value="' + esc(t) + '"' +
        (estado.tam.indexOf(t) > -1 ? " checked" : "") + "><span>" + esc(t) + '</span><span class="n">' + n + "</span></label>";
    }).join(""));

    var gCor = grupo("Cor", '<div class="swatches">' + cores.map(function (c) {
      return '<button type="button" class="swatch" data-f="cor" value="' + esc(c.nome) + '" style="--c:' + c.hex + '" ' +
        'aria-pressed="' + (estado.cor.indexOf(c.nome) > -1) + '" title="' + esc(c.nome) + '"><span class="sr-only">' + esc(c.nome) + "</span></button>";
    }).join("") + "</div>" + '<div style="margin-top:10px;font-size:13.5px;color:var(--tinta-2)">' +
      cores.map(function (c) { return esc(c.nome); }).join(" · ") + "</div>");

    var gPreco = grupo("Preço", FAIXAS.map(function (f) {
      var n = base.filter(function (p) { return faixaDe(p) === f.v; }).length;
      return '<label class="check"><input type="checkbox" data-f="faixa" value="' + f.v + '"' +
        (estado.faixa.indexOf(f.v) > -1 ? " checked" : "") + "><span>" + f.t + '</span><span class="n">' + n + "</span></label>";
    }).join(""));

    var gDisp = grupo("Disponibilidade", DISP.map(function (d) {
      var n = base.filter(function (p) {
        if (d.v === "pronta") return estoqueTotal(p) > 0;
        return p.tamanhos.some(function (t) { return t.e > 0 && t.e <= 2; });
      }).length;
      return '<label class="check"><input type="checkbox" data-f="disp" value="' + d.v + '"' +
        (estado.disp.indexOf(d.v) > -1 ? " checked" : "") + "><span>" + d.t + '</span><span class="n">' + n + "</span></label>";
    }).join(""));

    return '<div class="filters-panel">' + gTam + gCor + gPreco + gDisp + "</div>";
  }

  function chipsAtivos() {
    var out = [];
    ["tam", "cor", "faixa", "disp"].forEach(function (k) {
      estado[k].forEach(function (v) {
        var txt = v;
        if (k === "faixa") { var f = FAIXAS.filter(function (x) { return x.v === v; })[0]; txt = f ? f.t : v; }
        if (k === "disp") { var d = DISP.filter(function (x) { return x.v === v; })[0]; txt = d ? d.t : v; }
        out.push('<button type="button" class="chip" data-rm="' + k + '" value="' + esc(v) + '">' + esc(txt) +
          '<svg class="ic" aria-hidden="true"><use href="#i-close"></use></svg><span class="sr-only">Remover filtro</span></button>');
      });
    });
    if (out.length) out.push('<button type="button" class="chip" data-limpar>Limpar tudo</button>');
    return out.join("");
  }

  function renderCategoria() {
    var dados = baseCategoria();
    var lista = ordenar(aplicar(dados.lista));
    var grid = $("#grid-categoria");
    renderGrid(grid, lista);

    if (!lista.length && grid) {
      grid.innerHTML = estadoVazioHTML("Nenhum produto com esses filtros",
        "Experimente remover algum filtro ou ver a categoria completa.", "Limpar filtros");
    }
    var c = $("#cat-count"); if (c) c.textContent = lista.length === 1 ? "1 produto" : lista.length + " produtos";
    var chips = $("#chips"); if (chips) { chips.innerHTML = chipsAtivos(); chips.hidden = !chips.innerHTML; }
    var pd = $("#filtros-desktop"), pm = $("#filtros-mobile-body");
    if (pd) pd.innerHTML = painelFiltros(dados.lista);
    if (pm) pm.innerHTML = painelFiltros(dados.lista);
  }

  function initCategoria() {
    var dados = baseCategoria();
    var meta = CATEGORIAS[dados.cat] || CATEGORIAS.roupas;
    var h1 = $("#cat-title"), sub = $("#cat-sub"), ct = $("#cat-texto");
    if (h1) h1.textContent = meta.titulo;
    if (sub) sub.textContent = meta.subtitulo;
    if (ct) ct.textContent = meta.texto;
    document.title = meta.titulo + " | " + LOJA.nome + " — moda feminina";
    renderCategoria();

    var sel = $("#sort");
    if (sel) sel.addEventListener("change", function () { estado.sort = sel.value; renderCategoria(); });

    $$("[data-abrir-filtros]").forEach(function (b) {
      b.addEventListener("click", function () {
        var box = $("#filtros-mobile");
        box.hidden = false; document.body.style.overflow = "hidden";
        var f = box.querySelector("input,button"); if (f) f.focus();
      });
    });
    var fechaFm = $("#fechar-filtros");
    if (fechaFm) fechaFm.addEventListener("click", function () {
      $("#filtros-mobile").hidden = true; document.body.style.overflow = "";
      var b = $("[data-abrir-filtros]"); if (b) b.focus();
    });
    var aplicaFm = $("#aplicar-filtros");
    if (aplicaFm) aplicaFm.addEventListener("click", function () {
      $("#filtros-mobile").hidden = true; document.body.style.overflow = "";
      var b = $("[data-abrir-filtros]"); if (b) b.focus();
    });
    $("#filtros-mobile").addEventListener("click", function (ev) {
      if (ev.target === this) { this.hidden = true; document.body.style.overflow = ""; }
    });
  }

  /* =========================================================
     Página de produto
     ========================================================= */
  var pdp = { p: null, tam: null, cor: null, foto: 0 };

  function renderFotoPdp() {
    var stage = $("#foto-principal");
    if (stage) stage.innerHTML = '<span class="sr-only">Ampliar a foto do produto</span>' + fotoHTML(pdp.p, pdp.foto);
    $$(".thumb").forEach(function (b, i) { b.setAttribute("aria-current", i === pdp.foto); });
  }

  function renderEstoque() {
    var el = $("#estoque");
    if (!el || !pdp.p) return;
    var t = pdp.p.tamanhos.filter(function (x) { return x.t === pdp.tam; })[0];
    el.className = "stock";
    if (!pdp.tam) { el.innerHTML = '<span class="pip"></span>Selecione um tamanho para ver a disponibilidade'; return; }
    if (!t || t.e === 0) { el.classList.add("stock--out"); el.innerHTML = '<span class="pip"></span>Tamanho esgotado — avise quando chegar'; }
    else if (t.e <= 2) { el.classList.add("stock--low"); el.innerHTML = '<span class="pip"></span>Últimas ' + t.e + " peças nesse tamanho"; }
    else { el.innerHTML = '<span class="pip"></span>Pronta entrega — ' + t.e + " peças disponíveis"; }
  }

  function initProduto() {
    var id = new URLSearchParams(location.search).get("id");
    var p = byId(id);
    var main = $("#pdp-main"), erro = $("#pdp-error");
    if (!p) {
      if (main) main.hidden = true;
      if (erro) erro.hidden = false;
      document.title = "Produto não encontrado | " + LOJA.nome;
      return;
    }
    pdp.p = p;
    pdp.cor = p.cores[0].nome;
    pdp.tam = p.tamanhos.filter(function (t) { return t.e > 0; })[0] ? p.tamanhos.filter(function (t) { return t.e > 0; })[0].t : null;
    document.title = p.nome + " | " + LOJA.nome;

    $("#pdp-nome").textContent = p.nome;
    $("#pdp-cat").textContent = p.sub;
    $("#pdp-codigo").textContent = "Ref. DV-" + p.id.slice(0, 4).toUpperCase();
    $("#pdp-desc").textContent = p.desc;
    $("#pdp-preco").textContent = brl(p.preco);
    var old = $("#pdp-preco-antigo");
    if (p.precoAntigo) { old.textContent = brl(p.precoAntigo); } else { old.remove(); }
    var pix = $("#pdp-pix");
    pix.textContent = (parcelamento(p.preco) || "à vista no Pix") + (p.precoAntigo ? " · de " + brl(p.precoAntigo) + " por " + brl(p.preco) : "");

    /* galeria */
    var thumbs = $("#thumbs");
    thumbs.innerHTML = [0, 1, 2].map(function (i) {
      return '<button type="button" class="thumb" data-foto="' + i + '" aria-current="' + (i === 0) + '" aria-label="Ver foto ' + (i + 1) + " de " + esc(p.nome) + '">' +
        fotoHTML(p, i) + "</button>";
    }).join("");
    renderFotoPdp();

    /* cores */
    $("#cores").innerHTML = p.cores.map(function (c, i) {
      return '<button type="button" class="color" data-cor="' + esc(c.nome) + '" aria-pressed="' + (i === 0) + '">' +
        '<span class="dot" style="background:' + c.hex + '"></span>' + esc(c.nome) + "</button>";
    }).join("");
    $("#cor-selecionada").textContent = p.cores[0].nome;

    /* tamanhos */
    $("#tamanhos").innerHTML = p.tamanhos.map(function (t) {
      return '<button type="button" class="size" data-tam="' + esc(t.t) + '" aria-pressed="' + (t.t === pdp.tam) + '"' +
        (t.e === 0 ? ' disabled aria-label="Tamanho ' + esc(t.t) + ' esgotado"' : "") + ">" + esc(t.t) + "</button>";
    }).join("");
    $("#tam-selecionado").textContent = pdp.tam || "—";
    renderEstoque();

    /* aviso de reposição quando existe tamanho esgotado */
    if (p.tamanhos.some(function (t) { return t.e === 0; })) {
      $("#restock").hidden = false;
    }

    /* detalhes */
    $("#spec-composicao").innerHTML =
      "<div><dt>Tecido</dt><dd>" + esc(p.material) + "</dd></div>" +
      "<div><dt>Caimento</dt><dd>" + esc(p.caimento) + "</dd></div>" +
      "<div><dt>Ocasião</dt><dd>" + esc(p.ocasioes) + "</dd></div>" +
      "<div><dt>Cores</dt><dd>" + p.cores.map(function (c) { return esc(c.nome); }).join(", ") + "</dd></div>";
    $("#spec-cuidados").innerHTML = "<p>" + esc(p.cuidados) + "</p>";

    /* guia de medidas */
    $("#guia-medidas").innerHTML =
      "<table><thead><tr>" + GUIA_MEDIDAS.colunas.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") +
      "</tr></thead><tbody>" + GUIA_MEDIDAS.linhas.map(function (l) {
        return "<tr>" + l.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table><p class=\"tiny muted\" style=\"margin-top:12px\">Medidas do corpo em centímetros. Guia indicativo — valide com a loja antes de publicar.</p>";

    /* relacionados */
    var rel = PRODUTOS.filter(function (x) { return x.cat === p.cat && x.id !== p.id; })
      .sort(function (a, b) { return (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0); }).slice(0, 4);
    renderGrid($("#grid-relacionados"), rel);

    /* frete estimado na página do produto */
    var pf = $("#pdp-frete");
    if (pf) pf.innerHTML = "Envio estimado " + brl(LOJA.frete.valor) + " · " + LOJA.frete.prazo +
      " (frete grátis acima de " + brl(LOJA.frete.gratisAcima) + ")";

    /* atalho para a publicação oficial da peça */
    var pp = $("#pdp-post"), ppl = $("#pdp-post-link");
    if (pp && p.post) { pp.hidden = false; ppl.href = p.post; }

    /* trilha e botão de favorito */
    var cr = $("#crumb-produto"); if (cr) cr.textContent = p.sub;
    var favBtn = $(".fav-inline");
    if (favBtn) {
      var on = FAVS.indexOf(p.id) > -1;
      favBtn.setAttribute("data-fav", p.id);
      favBtn.setAttribute("aria-pressed", on);
      favBtn.setAttribute("aria-label", on ? "Remover " + p.nome + " da lista de desejos" : "Adicionar " + p.nome + " à lista de desejos");
    }
  }
  /* =========================================================
     Eventos da página de produto
     ========================================================= */
  function bindProduto() {
    if (page !== "produto" || !pdp.p) return;

    document.addEventListener("click", function (ev) {
      var t = ev.target.closest ? ev.target.closest("[data-foto],[data-tam],[data-cor],[data-acc]") : null;
      if (!t) return;
      if (t.hasAttribute("data-foto")) { pdp.foto = parseInt(t.getAttribute("data-foto"), 10); renderFotoPdp(); }
      else if (t.hasAttribute("data-tam")) {
        pdp.tam = t.getAttribute("data-tam");
        $$("[data-tam]").forEach(function (b) { b.setAttribute("aria-pressed", b === t); });
        $("#tam-selecionado").textContent = pdp.tam;
        renderEstoque();
      } else if (t.hasAttribute("data-cor")) {
        pdp.cor = t.getAttribute("data-cor");
        $$("[data-cor]").forEach(function (b) { b.setAttribute("aria-pressed", b === t); });
        $("#cor-selecionada").textContent = pdp.cor;
      } else if (t.hasAttribute("data-acc")) {
        var aberto = t.getAttribute("aria-expanded") === "true";
        t.setAttribute("aria-expanded", !aberto);
        var painel = document.getElementById(t.getAttribute("aria-controls"));
        if (painel) painel.hidden = aberto;
      }
    });

    $("#btn-add").addEventListener("click", function () {
      if (!pdp.tam) {
        toast("Escolha um tamanho antes de adicionar à sacola.", "erro");
        var s = $(".size:not([disabled])"); if (s) s.focus();
        return;
      }
      var tt = pdp.p.tamanhos.filter(function (x) { return x.t === pdp.tam; })[0];
      if (!tt || tt.e === 0) { toast("Esse tamanho está esgotado.", "erro"); return; }
      adicionarSacola(pdp.p.id, pdp.tam, pdp.cor);
    });

    $("#form-restock").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var campo = this.querySelector("input");
      if (!campo.value.trim()) { campo.setAttribute("aria-invalid", "true"); campo.focus(); return; }
      campo.removeAttribute("aria-invalid");
      toast("Pronto! Avisamos você quando " + pdp.p.nome + " chegar.");
      this.reset();
    });

    /* lightbox */
    var lb = $("#lightbox"), stage = $("#lb-stage");
    function abrirLb() {
      lb.hidden = false; document.body.style.overflow = "hidden";
      stage.classList.remove("is-zoom");
      stage.innerHTML = fotoHTML(pdp.p, pdp.foto);
      $("#lb-close").focus();
    }
    function fecharLb() { lb.hidden = true; document.body.style.overflow = ""; }
    $("#foto-principal").addEventListener("click", abrirLb);
    $("#lb-close").addEventListener("click", fecharLb);
    $("#lb-zoom").addEventListener("click", function () {
      var on = stage.classList.toggle("is-zoom");
      this.setAttribute("aria-pressed", on);
      $("#lb-zoom-text").textContent = on ? "reduzir" : "ampliar";
    });
    lb.addEventListener("click", function (ev) { if (ev.target === lb) fecharLb(); });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !lb.hidden) fecharLb(); });
  }

  /* =========================================================
     Sacola e finalização
     ========================================================= */
  var cupom = null, frete = null;

  function subtotal() {
    return BAG.reduce(function (s, i) {
      var p = byId(i.id); return p ? s + p.preco * i.q : s;
    }, 0);
  }
  function desconto() {
    var st = subtotal();
    if (!cupom) return 0;
    if (cupom.tipo === "percent") return st * (cupom.valor / 100);
    if (cupom.tipo === "frete") return 0;
    return 0;
  }
  function valorFrete() {
    var st = subtotal();
    if (st >= LOJA.frete.gratisAcima) return 0;
    if (cupom && cupom.tipo === "frete") return 0;
    if (frete === null) return null;
    return frete;
  }
  function total() {
    var st = subtotal() - desconto();
    var f = valorFrete();
    return st + (f || 0);
  }

  function renderSacola() {
    var wrap = $("#bag-wrap"), vazio = $("#bag-empty");
    if (!wrap) return;

    if (!BAG.length) {
      wrap.hidden = true; if (vazio) vazio.hidden = false;
      atualizarContadores();
      return;
    }
    wrap.hidden = false; if (vazio) vazio.hidden = true;

    $("#bag-list").innerHTML = BAG.map(function (i, idx) {
      var p = byId(i.id); if (!p) return "";
      return '<article class="bag-item">' +
        '<a href="produto.html?id=' + p.id + '" aria-label="Ver ' + esc(p.nome) + '">' + fotoHTML(p, 0) + "</a>" +
        '<div class="bag-info"><h3><a href="produto.html?id=' + p.id + '">' + esc(p.nome) + "</a></h3>" +
        '<div class="bag-meta">Tamanho ' + esc(i.tam) + " · Cor " + esc(i.cor) + "</div>" +
        '<div class="bag-unit">' + brl(p.preco) + " cada</div>" +
        '<div class="bag-price">' + brl(p.preco * i.q) + "</div></div>" +
        '<div class="bag-side">' +
        '<div class="qty"><button type="button" data-q="-" data-i="' + idx + '"' + (i.q <= 1 ? " disabled" : "") +
        ' aria-label="Diminuir quantidade de ' + esc(p.nome) + '"><svg class="ic"><use href="#i-minus"></use></svg></button>' +
        "<output aria-live=\"polite\">" + i.q + "</output>" +
        '<button type="button" data-q="+" data-i="' + idx + '" aria-label="Aumentar quantidade de ' + esc(p.nome) + '"><svg class="ic"><use href="#i-plus"></use></svg></button></div>' +
        '<button type="button" class="remove" data-rm-item="' + idx + '"><svg class="ic"><use href="#i-trash"></use></svg>Remover</button>' +
        "</div></article>";
    }).join("");

    var d = desconto(), f = valorFrete();
    $("#sum-subtotal").textContent = brl(subtotal());
    $("#sum-cupom-row").hidden = !cupom;
    if (cupom) $("#sum-cupom").textContent = "− " + brl(d) + " (" + cupom.codigo + ")";
    $("#sum-frete-row").hidden = f === null;
    $("#sum-frete").textContent = f === null ? "a combinar" : (f === 0 ? "Grátis" : brl(f));
    $("#sum-total").textContent = brl(total());
    $("#sum-total-pix").textContent = "ou " + brl(total()) + " no Pix";
    atualizarContadores();
  }

  function initSacola() {
    if (page !== "sacola") return;
    renderSacola();

    document.addEventListener("click", function (ev) {
      var el = ev.target.closest ? ev.target.closest("[data-q],[data-rm-item],[data-limpar]") : null;
      if (!el) return;
      if (el.hasAttribute("data-limpar")) { limparTudo(); return; }
      if (el.hasAttribute("data-rm-item")) {
        var idx = parseInt(el.getAttribute("data-rm-item"), 10);
        var nome = byId(BAG[idx].id).nome;
        BAG.splice(idx, 1); salvarBag(); renderSacola();
        toast(nome + " foi removido da sacola.");
        return;
      }
      var i = parseInt(el.getAttribute("data-i"), 10), item = BAG[i];
      var p = byId(item.id);
      var max = p.tamanhos.filter(function (t) { return t.t === item.tam; })[0];
      max = max ? max.e : 9;
      if (el.getAttribute("data-q") === "+") {
        if (item.q >= max) { toast("Só temos " + max + " unidade(s) desse tamanho.", "erro"); return; }
        item.q += 1;
      } else if (item.q > 1) item.q -= 1;
      salvarBag(); renderSacola();
    });

    /* cupom */
    $("#form-cupom").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var cod = $("#cupom").value.trim().toUpperCase();
      var msg = $("#cupom-msg");
      var c = LOJA.cupons.filter(function (x) { return x.codigo === cod; })[0];
      if (!c) { cupom = null; msg.className = "coupon-msg no"; msg.textContent = "Cupom inválido ou expirado."; renderSacola(); return; }
      if (subtotal() < c.minimo) { cupom = null; msg.className = "coupon-msg no"; msg.textContent = "Esse cupom pede pedido mínimo de " + brl(c.minimo) + "."; renderSacola(); return; }
      cupom = c; msg.className = "coupon-msg ok";
      msg.textContent = c.tipo === "percent" ? "Cupom aplicado: " + c.valor + "% de desconto." : "Cupom aplicado: frete grátis.";
      renderSacola();
    });

    /* frete */
    $("#form-frete").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var cep = $("#cep").value.replace(/\D/g, "");
      var res = $("#frete-res");
      if (cep.length !== 8) { res.textContent = "Informe um CEP com 8 dígitos."; res.style.color = "var(--erro)"; return; }
      frete = LOJA.frete.valor;
      res.style.color = "";
      var v = valorFrete();
      res.textContent = (v === 0 ? "Frete grátis para esse CEP." : "Frete estimado: " + brl(v) + " · " + LOJA.frete.prazo) +
        " — estimativa simulada, o valor final é confirmado no atendimento.";
      renderSacola();
    });

    /* passos do checkout */
    $("#form-checkout").addEventListener("focusin", function () { marcarPasso(2); });

    /* retirada na loja esconde o bloco de endereço */
    $$('input[name="entrega"]').forEach(function (r) {
      r.addEventListener("change", function () {
        var bloco = $("#endereco-block");
        if (bloco) bloco.hidden = r.value === "retirada";
      });
    });

    $("#form-checkout").addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!validarCheckout()) return;
      enviarPedido();
    });
  }

  function marcarPasso(n) {
    $$(".step").forEach(function (s, i) { s.classList.toggle("is-on", i + 1 <= n); });
  }

  function erroCampo(input, msg) {
    var e = document.getElementById(input.id + "-erro");
    if (msg) { input.setAttribute("aria-invalid", "true"); if (e) e.textContent = msg; }
    else { input.removeAttribute("aria-invalid"); if (e) e.textContent = ""; }
    return !msg;
  }

  function validarCheckout() {
    var ok = true, primeiro = null;
    var nome = $("#co-nome");
    if (!erroCampo(nome, nome.value.trim().length < 2 ? "Informe seu nome." : "")) { ok = false; primeiro = primeiro || nome; }
    var contato = $("#co-contato");
    var cv = contato.value.replace(/\D/g, "");
    var invalido = contato.value.indexOf("@") > -1 ? !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contato.value) : cv.length < 10;
    if (!erroCampo(contato, invalido ? "Informe um WhatsApp ou e-mail válido." : "")) { ok = false; primeiro = primeiro || contato; }
    var tipo = document.querySelector('input[name="entrega"]:checked').value;
    if (tipo === "envio") {
      var cep = $("#co-cep");
      if (!erroCampo(cep, cep.value.replace(/\D/g, "").length !== 8 ? "CEP com 8 dígitos." : "")) { ok = false; primeiro = primeiro || cep; }
      ["co-logradouro", "co-numero", "co-bairro", "co-cidade"].forEach(function (id) {
        var el = document.getElementById(id);
        if (!erroCampo(el, el.value.trim() ? "" : "Obrigatório para envio.")) { ok = false; primeiro = primeiro || el; }
      });
    }
    if (!ok && primeiro) { primeiro.focus(); toast("Revise os campos destacados para continuar.", "erro"); }
    return ok;
  }

  function enviarPedido() {
    var tipo = document.querySelector('input[name="entrega"]:checked').value;
    var linhas = [];
    linhas.push("*Pedido — " + LOJA.nome + "*");
    linhas.push("");
    BAG.forEach(function (i) {
      var p = byId(i.id);
      linhas.push("• " + p.nome + " — " + i.tam + " / " + i.cor + " — " + i.q + "x — " + brl(p.preco * i.q));
    });
    linhas.push("");
    linhas.push("Subtotal: " + brl(subtotal()));
    if (cupom) linhas.push("Cupom " + cupom.codigo + ": − " + brl(desconto()));
    var f = valorFrete();
    linhas.push("Frete: " + (f === null ? "a combinar" : f === 0 ? "grátis" : brl(f)));
    linhas.push("*Total: " + brl(total()) + "*");
    linhas.push("");
    linhas.push("Nome: " + $("#co-nome").value.trim());
    linhas.push("Contato: " + $("#co-contato").value.trim());
    if (tipo === "envio") {
      linhas.push("Entrega: enviar para " + $("#co-logradouro").value.trim() + ", " + $("#co-numero").value.trim() +
        " — " + $("#co-bairro").value.trim() + " — " + $("#co-cidade").value.trim() + " — CEP " + $("#co-cep").value.trim());
      if ($("#co-referencia").value.trim()) linhas.push("Referência: " + $("#co-referencia").value.trim());
    } else {
      linhas.push("Entrega: retirar na loja");
    }
    if ($("#co-obs").value.trim()) linhas.push("Observação: " + $("#co-obs").value.trim());

    var url = "https://wa.me/" + LOJA.whatsapp + "?text=" + encodeURIComponent(linhas.join("\n"));
    window.open(url, "_blank", "noopener");

    var itens = BAG.map(function (i) {
      var p = byId(i.id); return "<li><b>" + esc(p.nome) + "</b> — " + esc(i.tam) + " / " + esc(i.cor) + " · " + i.q + "x</li>";
    }).join("");
    $("#confirm-list").innerHTML = itens;
    $("#confirm-total").textContent = brl(total());
    $("#confirm-contato").textContent = $("#co-contato").value.trim();
    $("#checkout-block").hidden = true;
    $("#confirm-block").hidden = false;
    marcarPasso(3);
    $("#confirm-block").scrollIntoView({ behavior: "smooth", block: "center" });
    toast("Pedido enviado para o WhatsApp da loja.");
  }

  function limparTudo() {
    BAG = []; cupom = null; frete = null;
    salvarBag();
    var f = $("#form-cupom"); if (f) f.reset();
    var m = $("#cupom-msg"); if (m) m.textContent = "";
    var fr = $("#frete-res"); if (fr) fr.textContent = "";
    var ff = $("#form-frete"); if (ff) ff.reset();
    var cb = $("#checkout-block"), cf = $("#confirm-block");
    if (cb) cb.hidden = false;
    if (cf) cf.hidden = true;
    var fco = $("#form-checkout"); if (fco) fco.reset();
    marcarPasso(1);
    renderSacola();
    toast("Sua sacola foi esvaziada.");
  }
  /* =========================================================
     Filtros (eventos delegados)
     ========================================================= */
  function bindFiltros() {
    if (page !== "categoria") return;
    document.addEventListener("change", function (ev) {
      var el = ev.target;
      if (!el.hasAttribute || !el.hasAttribute("data-f")) return;
      var k = el.getAttribute("data-f"), v = el.value, arr = estado[k];
      var i = arr.indexOf(v);
      if (el.checked && i < 0) arr.push(v);
      if (!el.checked && i > -1) arr.splice(i, 1);
      renderCategoria();
    });
    document.addEventListener("click", function (ev) {
      if (ev.target.closest && ev.target.closest(".swatch")) {
        var s = ev.target.closest(".swatch"), key = s.getAttribute("data-f"), val = s.getAttribute("value");
        var ix = estado[key].indexOf(val);
        if (ix < 0) estado[key].push(val); else estado[key].splice(ix, 1);
        renderCategoria();
        return;
      }
      var rm = ev.target.closest ? ev.target.closest("[data-rm]") : null;
      if (rm) {
        var k2 = rm.getAttribute("data-rm"), v2 = rm.getAttribute("value");
        var j = estado[k2].indexOf(v2); if (j > -1) estado[k2].splice(j, 1);
        renderCategoria();
        return;
      }
      if (ev.target.closest && ev.target.closest("[data-limpar]")) {
        estado.tam = []; estado.cor = []; estado.faixa = []; estado.disp = [];
        renderCategoria();
        toast("Filtros limpos.");
      }
    });
  }

  /* =========================================================
     Favoritos
     ========================================================= */
  function renderFavoritos() {
    var grid = $("#grid-favoritos"); if (!grid) return;
    var lista = FAVS.map(byId).filter(Boolean);
    if (!lista.length) {
      grid.innerHTML = '<div class="grid-state"><h3>Sua lista de desejos está vazia</h3>' +
        "<p>Toque no coração de qualquer peça para guardá-la aqui e encontrar depois.</p>" +
        '<a class="btn btn--ghost" href="novidades.html">Ver novidades</a></div>';
      return;
    }
    grid.innerHTML = lista.map(cardHTML).join("");
  }

  /* =========================================================
     Formulários de contato e newsletter
     ========================================================= */
  function initContato() {
    var form = $("#form-contato");
    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var nome = $("#ct-nome"), msg = $("#ct-msg"), contato = $("#ct-contato");
        var ok = true;
        if (!erroCampo(nome, nome.value.trim().length < 2 ? "Informe seu nome." : "")) ok = false;
        if (!erroCampo(contato, contato.value.trim().length < 6 ? "Informe um WhatsApp ou e-mail." : "")) ok = false;
        if (!erroCampo(msg, msg.value.trim().length < 10 ? "Escreva uma mensagem um pouco mais longa." : "")) ok = false;
        if (!ok) return;
        form.hidden = true;
        $("#contato-ok").hidden = false;
        $("#contato-ok").focus();
        toast("Mensagem enviada. Retornamos em breve.");
      });
    }
    $$("[data-newsletter]").forEach(function (f) {
      f.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var input = f.querySelector("input");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
          input.setAttribute("aria-invalid", "true"); input.focus();
          toast("Informe um e-mail válido para receber as novidades.", "erro");
          return;
        }
        input.removeAttribute("aria-invalid");
        f.reset();
        toast("Cadastro recebido — você será avisada das novidades.");
      });
    });
  }

  /* =========================================================
     Ligações gerais
     ========================================================= */
  function ligarContatos() {
    var href = "https://wa.me/" + LOJA.whatsapp;
    $$("[data-wa]").forEach(function (a) { a.href = href + (a.hasAttribute("data-wa-msg") ? "?text=" + encodeURIComponent(a.getAttribute("data-wa-msg")) : ""); });
    $$("[data-whats-exib]").forEach(function (el) { el.textContent = LOJA.whatsappExibicao; });
    $$("[data-whats2-exib]").forEach(function (el) { el.textContent = LOJA.whatsapp2Exibicao || LOJA.whatsappExibicao; });
    $$("[data-wa2]").forEach(function (a) {
      if (!LOJA.whatsapp2) { if (a.parentNode) a.parentNode.removeChild(a); return; }
      a.href = "https://wa.me/" + LOJA.whatsapp2 + (a.hasAttribute("data-wa-msg") ? "?text=" + encodeURIComponent(a.getAttribute("data-wa-msg")) : "");
    });
    $$("[data-cidade]").forEach(function (el) { el.textContent = LOJA.cidade || ""; });
    $$("[data-instagram-exib]").forEach(function (el) { el.textContent = LOJA.instagramExibicao || ""; });
    $$("[data-instagram-seguidores]").forEach(function (el) { if (LOJA.instagramSeguidores) el.textContent = LOJA.instagramSeguidores; });
    $$("[data-instagram]").forEach(function (a) {
      if (LOJA.instagram) { a.href = LOJA.instagram; return; }
      /* perfil ainda não confirmado: não apontamos para lugar errado */
      if (a.textContent.trim()) {
        var s = document.createElement("span");
        s.className = "nota";
        s.textContent = "Instagram: perfil a confirmar com a loja";
        a.parentNode.replaceChild(s, a);
      } else if (a.parentNode) { a.parentNode.removeChild(a); }
    });
    $$("[data-valentimformen]").forEach(function (a) {
      if (LOJA.valentimformen) { a.href = LOJA.valentimformen; return; }
      if (a.parentNode) a.parentNode.removeChild(a);
    });
    $$("[data-threads]").forEach(function (a) { if (LOJA.threads) a.href = LOJA.threads; });
    $$("[data-horario]").forEach(function (el) { el.textContent = LOJA.horario || "Horário a confirmar com a loja"; });
    $$("[data-endereco]").forEach(function (el) {
      el.textContent = LOJA.endereco || ((LOJA.cidade ? LOJA.cidade + " · " : "") + "endereço da loja física a confirmar");
    });
    $$("[data-email]").forEach(function (el) { el.textContent = LOJA.email || "E-mail a confirmar com a loja"; });
  }

  function bindHeader() {
    var mt = $(".menu-toggle"); if (mt) mt.addEventListener("click", abrirMenu);
    var mf = $("#fechar-menu"); if (mf) mf.addEventListener("click", fecharMenu);
    if (menuEl) menuEl.addEventListener("click", function (ev) {
      if (ev.target.tagName === "A") fecharMenu();
      if (ev.target === menuEl) fecharMenu();
    });

    $$("[data-busca]").forEach(function (b) { b.addEventListener("click", abrirBusca); });
    var bc = $("#fechar-busca"); if (bc) bc.addEventListener("click", fecharBusca);
    if (buscaEl) {
      buscaEl.addEventListener("click", function (ev) { if (ev.target === buscaEl) fecharBusca(); });
      buscaInput.addEventListener("input", function () { buscar(buscaInput.value); });
      buscaInput.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") {
          ev.preventDefault();
          var primeiro = buscaRes.querySelector(".search-item");
          if (primeiro) primeiro.click();
        }
      });
    }

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { fecharBusca(); fecharMenu(); }
      if (ev.key === "Tab") {
        if (buscaEl && !buscaEl.hidden) trapFocus(buscaEl, ev);
        else if (menuEl && !menuEl.hidden) trapFocus(menuEl, ev);
      }
    });

    document.addEventListener("click", function (ev) {
      var f = ev.target.closest ? ev.target.closest("[data-fav]") : null;
      if (f) { ev.preventDefault(); toggleFav(f.getAttribute("data-fav")); }
    });
  }

  /* =========================================================
     Início
     ========================================================= */
  function init() {
    atualizarContadores();
    ligarContatos();
    bindHeader();
    if (page === "inicio") initHome();
    if (page === "categoria") { initCategoria(); bindFiltros(); }
    if (page === "produto") { initProduto(); bindProduto(); }
    if (page === "sacola") initSacola();
    if (page === "favoritos") renderFavoritos();
    initContato();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();