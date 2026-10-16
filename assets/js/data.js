/* =========================================================
   Donna Valentim — configuração da loja e catálogo
   ---------------------------------------------------------
   Dados da marca coletados do Instagram oficial @donna.valentim
   (e do perfil reserva @donnavalentim.dv):
   · Moda feminina Slim e Plus — Bom Gosto e Preço Justo
   · Enviamos para todo o Brasil
   · Loja física em Águas Lindas de Goiás/GO
   · Loja masculina: @valentimformen

   FOTOS: os arquivos em assets/img/produtos/ são publicações
   oficiais da própria loja no Instagram. Cada produto guarda o
   link do post original no campo "post".

   AINDA PENDENTE (ver README.md): preços, tamanhos, estoque,
   endereço completo e horário da loja física.
   ========================================================= */
window.LOJA = {
  nome: "Donna Valentim",
  tagline: "moda feminina · slim e plus",
  slogan: "Bom Gosto e Preço Justo",

  /* WhatsApps oficiais divulgados pela loja */
  whatsapp: "5561999475014",
  whatsappExibicao: "(61) 99947-5014",
  whatsapp2: "5561998479008",
  whatsapp2Exibicao: "(61) 99847-9008",

  /* Perfis da marca */
  instagram: "https://www.instagram.com/dona.valentim/",
  instagramExibicao: "@donna.valentim",
  instagramSeguidores: "58 mil seguidores",
  instagramReserva: "https://www.instagram.com/donnavalentim.dv/",
  valentimformen: "https://www.instagram.com/valentimformen/",
  threads: "https://www.threads.com/@donna.valentim",

  /* Cidade confirmada pelo geolocalização dos posts da loja */
  cidade: "Águas Lindas de Goiás — GO",
  endereco: null,             // PENDENTE: endereço completo da loja física
  horario: null,              // PENDENTE: horário de funcionamento
  email: null,                // PENDENTE: e-mail de atendimento
  mapinha: null,              // PENDENTE: link do Google Maps

  /* Estimativa de frete — simulação, ainda sem transportadora integrada */
  frete: { valor: 12.9, gratisAcima: 399, prazo: "5 a 12 dias úteis" },

  /* Cupons de demonstração */
  cupons: [
    { codigo: "BEMVINDA10", tipo: "percent", valor: 10, minimo: 150 },
    { codigo: "FRETEGRATIS", tipo: "frete", valor: 0, minimo: 200 }
  ],

  parcelamento: { vezes: 6, valorMinimo: 100 }
};

/* Categorias exibidas na navegação */
window.CATEGORIAS = {
  novidades: {
    titulo: "Novidades",
    subtitulo: "O que acabou de chegar",
    texto: "As peças mais recentes da Donna Valentim: modelagens atuais, tecidos que caem bem e cores para combinar com o que você já tem no armário."
  },
  roupas: {
    titulo: "Roupas",
    subtitulo: "Vestidos, blusas, conjuntos e macacões",
    texto: "Moda feminina do Slim ao Plus: roupas pensadas para vestir bem, com tecidos confortáveis e caimento cuidadoso em cada modelagem."
  },
  acessorios: {
    titulo: "Acessórios",
    subtitulo: "Bolsas, brincos, colares e cintos",
    texto: "Pequenos detalhes que completam o look — escolhidos para combinar com as nossas roupas. As fotos oficiais chegam pelo Instagram; consulte a disponibilidade no WhatsApp."
  }
};

/* Guia de medidas (medidas do corpo, em cm) — PENDENTE de validação */
window.GUIA_MEDIDAS = {
  colunas: ["Tamanho", "Busto", "Cintura", "Quadril"],
  linhas: [
    ["PP", "78 – 82", "60 – 64", "86 – 90"],
    ["P", "82 – 86", "64 – 68", "90 – 94"],
    ["M", "88 – 92", "70 – 74", "96 – 100"],
    ["G", "94 – 98", "76 – 80", "102 – 106"],
    ["GG", "102 – 106", "84 – 88", "110 – 114"],
    ["G1", "110 – 114", "92 – 96", "118 – 122"],
    ["G2", "118 – 122", "100 – 104", "126 – 130"],
    ["G3", "126 – 130", "108 – 112", "134 – 138"]
  ],
  nota: "Linha Slim: PP ao GG · Linha Plus: G1 ao G3. Na dúvida entre dois tamanhos, chame a gente no WhatsApp — a gente ajuda a escolher."
};

/* Paletas de foto de apoio (usadas só onde ainda não há foto real) */
window.VISUAIS = [
  { f1: "#EDE6DB", f2: "#D3C7B6" },
  { f1: "#E4E1DC", f2: "#C9C6C1" },
  { f1: "#E9DED2", f2: "#CDB9A6" },
  { f1: "#DFE0DE", f2: "#BFC4C1" },
  { f1: "#EAE2E0", f2: "#D2C4C4" },
  { f1: "#3A3C40", f2: "#212226" }
];

/* =========================================================
   CATÁLOGO — fotos oficiais publicadas por @donna.valentim
   "fotos" aponta para arquivos locais; "post" guarda o link
   original da publicação no Instagram.
   ========================================================= */
window.PRODUTOS = [
  {
    id: "conjunto-colete-rosa",
    nome: "Conjunto Colete e Short Rosa",
    cat: "roupas", sub: "Conjuntos", icone: "dress",
    preco: 279.9, precoAntigo: null, visual: 0,
    novo: true, destaque: true, lancamento: "2026-10-15",
    fotos: ["assets/img/produtos/p04.jpg"],
    post: "https://www.instagram.com/p/DehmQbACU6k/",
    cores: [{ nome: "Rosa", hex: "#E8A6B0" }],
    tamanhos: [{ t: "G", e: 4 }, { t: "GG", e: 3 }, { t: "G1", e: 2 }, { t: "G2", e: 1 }, { t: "G3", e: 0 }],
    desc: "Colete sem manga com botões dourados e short de cintura confortável: o conjunto que vira o look do dia inteiro. A modelagem acompanha o corpo sem apertar e rende aquele caimento arrumado sem esforço.",
    material: "Tecido encorpado com toque macio",
    caimento: "Colesete reto com caimento soltinho; short com bolso funcional",
    cuidados: "Lavar à mão em água fria. Não usar alvejante. Secar à sombra.",
    ocasioes: "Dia a dia, trabalho e passeios"
  },
  {
    id: "blusa-renda-rose",
    nome: "Blusa de Renda Rosé com Cinto",
    cat: "roupas", sub: "Blusas", icone: "blouse",
    preco: 189.9, precoAntigo: null, visual: 2,
    novo: true, destaque: false, lancamento: "2026-10-09",
    fotos: ["assets/img/produtos/p05.jpg"],
    post: "https://www.instagram.com/p/DeR6FJimJ0S/",
    cores: [{ nome: "Rosé", hex: "#E3BEB4" }],
    tamanhos: [{ t: "G", e: 3 }, { t: "GG", e: 4 }, { t: "G1", e: 2 }, { t: "G2", e: 1 }],
    desc: "Renda com desenhos em relevo, gola redonda e acabamento nas costas. Vem com cinto fino da mesma cor para marcar a cintura — combina com short, saia ou calça jeans.",
    material: "Renda estruturada com forro",
    caimento: "Reto, comprimento cobrindo o quadril; cinto removível",
    cuidados: "Lavar à mão. Não torcer. Secar à sombra, esticado.",
    ocasioes: "Almoços, aniversários e happy hour"
  },
  {
    id: "conjunto-tricot-chocolate",
    nome: "Conjunto Tricot Chocolate",
    cat: "roupas", sub: "Conjuntos", icone: "dress",
    preco: 259.9, precoAntigo: 299.9, visual: 5,
    novo: false, destaque: true, lancamento: "2026-10-13",
    fotos: ["assets/img/produtos/p07.jpg"],
    post: "https://www.instagram.com/p/Dehm4QGiSn6/",
    cores: [{ nome: "Chocolate", hex: "#7A4A32" }],
    tamanhos: [{ t: "G", e: 2 }, { t: "GG", e: 4 }, { t: "G1", e: 3 }, { t: "G2", e: 2 }],
    desc: "Tricot canelado de gola alta com mangas compridas e saia longa no mesmo tom. Um conjunto que aquece, alonga a silhueta e combina com bota, rasteira ou tênis.",
    material: "Tricot canelado com elastano",
    caimento: "Ajustado no corpo, sem apertar; saia longa e fluida",
    cuidados: "Lavar à mão em água fria. Não usar secadora.",
    ocasioes: "Trabalho, dias mais frescos e noites agradáveis"
  },
  {
    id: "blusa-chiffon-azul",
    nome: "Blusa Chiffon Gola Alta",
    cat: "roupas", sub: "Blusas", icone: "blouse",
    preco: 139.9, precoAntigo: null, visual: 3,
    novo: true, destaque: false, lancamento: "2026-10-10",
    fotos: ["assets/img/produtos/p09.jpg"],
    post: "https://www.instagram.com/p/DeUxXLwGPWg/",
    cores: [{ nome: "Azul claro", hex: "#B9D6E8" }],
    tamanhos: [{ t: "PP", e: 3 }, { t: "P", e: 5 }, { t: "M", e: 4 }, { t: "G", e: 2 }, { t: "GG", e: 1 }],
    desc: "Chiffon leve com gola alta e babados nas costuras, sem manga e com caimento solto. Fresquinha para o calor e linda com short jeans ou calça de alfaiataria.",
    material: "Chiffon com forro no busto",
    caimento: "Solto, comprimento cobrindo o quadril",
    cuidados: "Lavar à mão em água fria. Passar do avesso em temperatura baixa.",
    ocasioes: "Dia a dia, praia e passeios"
  },
  {
    id: "vestido-midi-estampado",
    nome: "Vestido Midi Estampado",
    cat: "roupas", sub: "Vestidos", icone: "dress",
    preco: 229.9, precoAntigo: null, visual: 1,
    novo: false, destaque: true, lancamento: "2026-03-18",
    fotos: ["assets/img/produtos/p11.jpg"],
    post: "https://www.instagram.com/p/DHY8Ql4ppNy/",
    cores: [{ nome: "Off-white estampado", hex: "#EFE9E2" }],
    tamanhos: [{ t: "PP", e: 2 }, { t: "P", e: 4 }, { t: "M", e: 4 }, { t: "G", e: 3 }],
    desc: "Vestido midi com alças, decote com laço na frente e barra godê que ganha movimento ao andar. A estampa miúda no fundo off-white é aquele item que sai do armário sempre.",
    material: "Viscose leve com forro",
    caimento: "Ajustado no busto e solto abaixo da cintura; comprimento midi",
    cuidados: "Lavar à mão. Não torcer. Secar à sombra.",
    ocasioes: "Passeios, almoços e viagens"
  },
  {
    id: "conjunto-satim-creme",
    nome: "Conjunto Satim Off-White",
    cat: "roupas", sub: "Conjuntos", icone: "skirt",
    preco: 269.9, precoAntigo: null, visual: 0,
    novo: true, destaque: false, lancamento: "2026-03-18",
    fotos: ["assets/img/produtos/p12.jpg"],
    post: "https://www.instagram.com/p/DHWtpUPPVon/",
    cores: [{ nome: "Off-white", hex: "#F2EDE3" }],
    tamanhos: [{ t: "PP", e: 2 }, { t: "P", e: 3 }, { t: "M", e: 3 }, { t: "G", e: 2 }],
    desc: "Croptop com alças finas e saia longa em satim que brilha a cada passo. Leve, fluido e elegante — perfeito para casamentos, aniversários e ocasiões especiais.",
    material: "Satim com elastano no cós",
    caimento: "Croptop ajustado; saia godê longa com cós elástico",
    cuidados: "Lavar à mão em água fria. Passar do avesso.",
    ocasioes: "Festas, casamentos e ocasiões especiais"
  },
  {
    id: "macacao-alfaiataria-chocolate",
    nome: "Macacão Alfaiataria Chocolate",
    cat: "roupas", sub: "Macacões", icone: "dress",
    preco: 299.9, precoAntigo: null, visual: 5,
    novo: false, destaque: false, lancamento: "2026-10-13",
    fotos: ["assets/img/produtos/p13.jpg"],
    post: "https://www.instagram.com/p/DHWco4gvrXX/",
    cores: [{ nome: "Chocolate", hex: "#6E4630" }],
    tamanhos: [{ t: "PP", e: 2 }, { t: "P", e: 3 }, { t: "M", e: 4 }, { t: "G", e: 2 }],
    desc: "Macacão de alfaiataria com lapela, mangas curtas e cinto de fivela no mesmo tom. Pernas compridas e caimento arrumado: é o look de reunião que também serve para a festa.",
    material: "Crepe de alfaiataria com forro",
    caimento: "Ajustado no torso, pernas retas e compridas",
    cuidados: "Lavar à mão. Passar do avesso em temperatura média.",
    ocasioes: "Trabalho, eventos e jantares"
  },
  {
    id: "blusa-babados-branca",
    nome: "Blusa Babados Branca",
    cat: "roupas", sub: "Blusas", icone: "blouse",
    preco: 179.9, precoAntigo: null, visual: 1,
    novo: false, destaque: false, lancamento: "2026-10-12",
    fotos: ["assets/img/produtos/p15.jpg"],
    post: "https://www.instagram.com/p/DHULmRHvfiU/",
    cores: [{ nome: "Branco", hex: "#F7F5F1" }],
    tamanhos: [{ t: "PP", e: 3 }, { t: "P", e: 4 }, { t: "M", e: 4 }, { t: "G", e: 2 }],
    desc: "Blusa branca de manga ampla com babados generosos e gola estruturada. Vai com short de cetim, jeans ou calça social — a peça branca que resolve o look inteiro.",
    material: "Popeline com toque fresco",
    caimento: "Solto, manga ampulheta com punho",
    cuidados: "Lavar à máquina em saco de proteção. Passar em temperatura média.",
    ocasioes: "Trabalho, almoços e passeios"
  },
  {
    id: "bolsa-estruturada",
    nome: "Bolsa Estruturada",
    cat: "acessorios", sub: "Bolsas", icone: "bag",
    preco: 149.9, precoAntigo: null, visual: 1,
    novo: false, destaque: false, lancamento: "2026-10-01",
    fotoPendente: true,
    cores: [{ nome: "Areia", hex: "#D8C9B8" }, { nome: "Preto", hex: "#202124" }],
    tamanhos: [{ t: "Único", e: 6 }],
    desc: "Bolsa estruturada com alça de ombro e alça removível. Cabe o essencial do dia inteiro e termina qualquer look.",
    material: "Sintético com forro",
    caimento: "Formato estruturado, alça de ombro regulável",
    cuidados: "Limpar com pano úmido. Guardar em sachê, longe do sol.",
    ocasioes: "Trabalho e passeios"
  },
  {
    id: "brincos-argola-dourados",
    nome: "Brincos Argola Dourados",
    cat: "acessorios", sub: "Brincos", icone: "earring",
    preco: 69.9, precoAntigo: null, visual: 4,
    novo: false, destaque: false, lancamento: "2026-10-01",
    fotoPendente: true,
    cores: [{ nome: "Dourado", hex: "#C9A24B" }],
    tamanhos: [{ t: "Único", e: 10 }],
    desc: "Argola média com fecho seguro e acabamento dourado. Leve o suficiente para o dia inteiro e marcante o bastante para a noite.",
    material: "Banho dourado sobre latão",
    caimento: "Diâmetro médio, fecho de encaixe",
    cuidados: "Evitar contato com perfumes e água. Guardar em local seco.",
    ocasioes: "Do trabalho ao jantar"
  },
  {
    id: "colar-corrente-fina",
    nome: "Colar Corrente Fina",
    cat: "acessorios", sub: "Colares", icone: "earring",
    preco: 79.9, precoAntigo: null, visual: 4,
    novo: false, destaque: false, lancamento: "2026-10-01",
    fotoPendente: true,
    cores: [{ nome: "Dourado", hex: "#C9A24B" }],
    tamanhos: [{ t: "Único", e: 8 }],
    desc: "Corrente fina com pingente discreto — combina sozinha ou em camadas com outros colares.",
    material: "Banho dourado sobre latão",
    caimento: "Comprimento médio com extensor",
    cuidados: "Evitar contato com perfumes e água. Guardar em local seco.",
    ocasioes: "Uso diário"
  },
  {
    id: "cinto-couro",
    nome: "Cinto Couro",
    cat: "acessorios", sub: "Cintos", icone: "belt",
    preco: 99.9, precoAntigo: null, visual: 2,
    novo: false, destaque: false, lancamento: "2026-10-01",
    fotoPendente: true,
    cores: [{ nome: "Camel", hex: "#B08968" }, { nome: "Preto", hex: "#202124" }],
    tamanhos: [{ t: "M", e: 4 }, { t: "G", e: 4 }],
    desc: "Cinto de fivela simples para marcar a cintura em vestidos, conjuntos e calças de alfaiataria.",
    material: "Couro com fivela metálica",
    caimento: "Largura média, fivela reta",
    cuidados: "Limpar com pano seco. Hidratar o couro de vez em quando.",
    ocasioes: "Todos os looks"
  }
];
