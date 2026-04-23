/* =========================================
   PESQUISA PREMIADA — script.js
   Sistema de Progressão Completo
   ========================================= */

"use strict";

/* ─── STATE ──────────────────────────────── */
const state = {
  balance: 50.00,
  evalCount: 0,          // total de avaliações feitas
  cyclePosition: 0,      // posição no ciclo atual (0–4)
  cycleNumber: 1,        // número do ciclo (1, 2, ...)
  cycleEarnings: 0,      // ganhos no ciclo atual
  earnedTotal: 50.00,    // total ganho (incluindo bônus)
  withdrawUnlocked: false,
  currentProductIndex: 0,
  productOrder: [],
  rating: 0,
  answers: {},
  lastReward: 0,
  historyItems: [
    { name: "Pagamento via Pix", value: 237.00, date: "Há 2 dias", icon: "ri-bank-card-line" },
    { name: "Pagamento via Pix", value: 193.00, date: "Há 5 dias", icon: "ri-bank-card-line" },
    { name: "Bônus de indicação", value: 75.00, date: "Há 1 semana", icon: "ri-gift-line" },
  ],
};

/* ─── PRODUCTS ───────────────────────────── */
const products = [
  {
    name: "Café Premium Blend",
    category: "Alimentos & Bebidas",
    desc: "Blend especial de grãos selecionados da Etiópia e Colômbia, torrado artesanalmente para um sabor intenso e equilibrado.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&q=80",
    reward: [12, 28],
    questions: [
      { id: "q1", text: "Você consome café com qual frequência?", options: ["Todo dia", "Algumas vezes por semana", "Raramente"] },
      { id: "q2", text: "Você recomendaria este produto a amigos?", options: ["Com certeza", "Talvez", "Não recomendaria"] },
      { id: "q3", text: "O preço é justo pelo que oferece?", options: ["Sim, ótimo custo-benefício", "Preço razoável", "Caro demais"] },
    ],
  },
  {
    name: "Fone Bluetooth Pro X",
    category: "Eletrônicos",
    desc: "Cancelamento de ruído ativo com 30h de bateria, drivers de 40mm e qualidade de som profissional para o dia a dia.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    reward: [18, 42],
    questions: [
      { id: "q1", text: "Você utiliza fones bluetooth com frequência?", options: ["Diariamente", "Às vezes", "Raramente"] },
      { id: "q2", text: "Qual aspecto é mais importante para você?", options: ["Qualidade de som", "Conforto", "Duração da bateria"] },
      { id: "q3", text: "Você compraria este produto?", options: ["Sim, com certeza", "Ficaria em dúvida", "Não compraria"] },
    ],
  },
  {
    name: "Tênis Urban Runner X2",
    category: "Moda & Esporte",
    desc: "Design moderno com tecnologia de amortecimento avançado e solado de borracha para corridas urbanas de alto desempenho.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
    reward: [15, 38],
    questions: [
      { id: "q1", text: "Você pratica atividades físicas regularmente?", options: ["Sim, frequentemente", "Algumas vezes", "Raramente"] },
      { id: "q2", text: "O que mais te atrai neste produto?", options: ["Design", "Conforto", "Tecnologia"] },
      { id: "q3", text: "Como você avalia o custo-benefício?", options: ["Excelente", "Bom", "Regular"] },
    ],
  },
  {
    name: "Perfume Noir Intense",
    category: "Beleza & Cuidados",
    desc: "Fragrância masculina sofisticada com notas de couro, âmbar negro e sândalo para ocasiões especiais e uso diário.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&q=80",
    reward: [14, 35],
    questions: [
      { id: "q1", text: "Com que frequência você usa perfume?", options: ["Todo dia", "Em ocasiões especiais", "Raramente"] },
      { id: "q2", text: "Você prefere fragrâncias:", options: ["Amadeiradas", "Florais", "Frescas/Cítricas"] },
      { id: "q3", text: "O preço seria um fator decisivo?", options: ["Não, qualidade primeiro", "Dependeria do valor", "Sim, priorizo preço"] },
    ],
  },
  {
    name: "Smartwatch FitLife Pro",
    category: "Tecnologia",
    desc: "Monitor de saúde 24/7 com GPS integrado, ECG, oxímetro, controle de treinos e 14 dias de bateria.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    reward: [20, 45],
    questions: [
      { id: "q1", text: "Você usa ou já usou smartwatch?", options: ["Uso atualmente", "Já usei antes", "Nunca usei"] },
      { id: "q2", text: "Qual funcionalidade mais te interessa?", options: ["Saúde e fitness", "Notificações", "GPS e mapas"] },
      { id: "q3", text: "Você indicaria este produto?", options: ["Sim", "Talvez", "Não"] },
    ],
  },
  {
    name: "Cadeira ErgoMax Pro",
    category: "Casa & Escritório",
    desc: "Cadeira ergonômica com suporte lombar ajustável, apoio de pescoço e braços 4D para jornadas longas de trabalho.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",
    reward: [22, 48],
    questions: [
      { id: "q1", text: "Você trabalha em home office?", options: ["Sim, todos os dias", "Alguns dias por semana", "Não"] },
      { id: "q2", text: "Você já teve dores por postura incorreta?", options: ["Frequentemente", "Às vezes", "Raramente"] },
      { id: "q3", text: "O ergonomia é prioridade na sua compra?", options: ["Absolutamente", "É importante", "Não é prioridade"] },
    ],
  },
  {
    name: "Notebook UltraSlim 14",
    category: "Eletrônicos",
    desc: "Processador de última geração, 16GB RAM, SSD NVMe de 512GB e tela IPS de 14 polegadas com 400 nits de brilho.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80",
    reward: [25, 50],
    questions: [
      { id: "q1", text: "Para que você usa principalmente seu notebook?", options: ["Trabalho/Estudo", "Entretenimento", "Games"] },
      { id: "q2", text: "Portabilidade é importante para você?", options: ["Essencial", "Importante", "Não é prioridade"] },
      { id: "q3", text: "Você compraria este modelo?", options: ["Sim, é o que preciso", "Precisaria ver mais detalhes", "Não é o que procuro"] },
    ],
  },
  {
    name: "Câmera Mirrorless Alpha",
    category: "Fotografia",
    desc: "Sensor full-frame de 33MP, vídeo 4K/60fps, estabilização óptica de 5 eixos e autofoco com rastreamento de olhos.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80",
    reward: [20, 44],
    questions: [
      { id: "q1", text: "Você pratica fotografia?", options: ["Profissionalmente", "Como hobby", "Apenas pelo celular"] },
      { id: "q2", text: "O que mais valoriza em uma câmera?", options: ["Qualidade de imagem", "Facilidade de uso", "Tamanho/Portabilidade"] },
      { id: "q3", text: "Você investiria em equipamento fotográfico?", options: ["Sim, com certeza", "Dependendo do preço", "Não no momento"] },
    ],
  },
  {
    name: "Mochila Tech Commuter",
    category: "Acessórios",
    desc: "Mochila impermeável com compartimento acolchoado para notebook de 17 polegadas, porta USB e suporte anti-furto.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
    reward: [10, 28],
    questions: [
      { id: "q1", text: "Você usa mochila no dia a dia?", options: ["Sempre", "Com frequência", "Raramente"] },
      { id: "q2", text: "O que mais importa em uma mochila?", options: ["Organização interna", "Conforto", "Design/Aparência"] },
      { id: "q3", text: "A impermeabilidade é importante para você?", options: ["Muito importante", "Desejável", "Indiferente"] },
    ],
  },
  {
    name: "Whey Protein Gold Max",
    category: "Suplementos",
    desc: "Proteína de soro de leite concentrada com 24g de proteína por dose, 5g de BCAA e baixo teor de açúcar.",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&q=80",
    reward: [13, 32],
    questions: [
      { id: "q1", text: "Você utiliza suplementos alimentares?", options: ["Sim, regularmente", "Ocasionalmente", "Não utilizo"] },
      { id: "q2", text: "Qual o principal objetivo com suplementação?", options: ["Ganho muscular", "Perda de peso", "Saúde geral"] },
      { id: "q3", text: "O sabor influencia na compra de proteínas?", options: ["Muito", "Um pouco", "Não faz diferença"] },
    ],
  },
  {
    name: "Panela SmartCook Pro",
    category: "Eletrodomésticos",
    desc: "Panela elétrica multifunção com 12 programas automáticos, capacidade de 5L e revestimento antiaderente premium.",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&q=80",
    reward: [11, 30],
    questions: [
      { id: "q1", text: "Você cozinha em casa com frequência?", options: ["Todo dia", "Às vezes", "Raramente"] },
      { id: "q2", text: "Praticidade na cozinha é prioridade?", options: ["Sim, totalmente", "É importante", "Não necessariamente"] },
      { id: "q3", text: "Você trocaria seus equipamentos atuais?", options: ["Sim, por algo melhor", "Só se necessário", "Estou satisfeito"] },
    ],
  },
  {
    name: "Óculos Polarizado UV400",
    category: "Moda & Acessórios",
    desc: "Lentes polarizadas com proteção UV400, armação de acetato italiano e design clássico para todos os estilos.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80",
    reward: [10, 25],
    questions: [
      { id: "q1", text: "Você usa óculos de sol habitualmente?", options: ["Sempre que há sol", "Às vezes", "Raramente"] },
      { id: "q2", text: "O que mais valoriza em óculos de sol?", options: ["Proteção UV", "Design", "Durabilidade"] },
      { id: "q3", text: "Você investiria em óculos de qualidade?", options: ["Sim, vale muito", "Depende do preço", "Prefiro preço baixo"] },
    ],
  },
  {
    name: "Caixa de Som Portable BT",
    category: "Áudio",
    desc: "Caixa de som Bluetooth 5.3 com 40W RMS, resistência à água IPX7, 24h de bateria e modo estéreo duplo.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80",
    reward: [15, 36],
    questions: [
      { id: "q1", text: "Você ouve música em ambientes externos?", options: ["Frequentemente", "Às vezes", "Raramente"] },
      { id: "q2", text: "Qual aspecto é mais relevante?", options: ["Qualidade sonora", "Portabilidade", "Resistência"] },
      { id: "q3", text: "Você compraria este produto?", options: ["Sim", "Possivelmente", "Não"] },
    ],
  },
  {
    name: "Kit Skincare Natural Pro",
    category: "Beleza",
    desc: "Kit completo de cuidados com a pele: sérum vitamina C, hidratante FPS 50, tônico e gel de limpeza facial.",
    image: "https://images.unsplash.com/photo-1556228578-626f4a5e56d2?w=300&q=80",
    reward: [12, 30],
    questions: [
      { id: "q1", text: "Você possui rotina de cuidados com a pele?", options: ["Sim, completa", "Cuidados básicos", "Não tenho rotina"] },
      { id: "q2", text: "Ingredientes naturais influenciam sua decisão?", options: ["Muito importante", "Um diferencial", "Indiferente"] },
      { id: "q3", text: "Você gastaria em skincare de qualidade?", options: ["Sim, invisto nisso", "Dentro de um limite", "Prefiro opções baratas"] },
    ],
  },
  {
    name: "Mouse Gamer Precision X",
    category: "Games & Tecnologia",
    desc: "Sensor óptico de 25.600 DPI, 8 botões programáveis, RGB com 16 milhões de cores e software de personalização.",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&q=80",
    reward: [16, 38],
    questions: [
      { id: "q1", text: "Você joga games no computador?", options: ["Diariamente", "Algumas vezes por semana", "Raramente"] },
      { id: "q2", text: "Qual periférico é mais importante?", options: ["Mouse", "Teclado", "Headset"] },
      { id: "q3", text: "Você pagaria mais por alta performance?", options: ["Sim, vale o investimento", "Depende do valor", "Prefiro custo baixo"] },
    ],
  },
  {
    name: "Aspirador Robótico AI",
    category: "Casa Inteligente",
    desc: "Mapeamento por laser LiDAR, aspiração de 4000 Pa, função de lavagem de piso e integração com Alexa e Google Home.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
    reward: [20, 46],
    questions: [
      { id: "q1", text: "Você tem interesse em automação residencial?", options: ["Muito interessado", "Interesse moderado", "Prefiro o modo tradicional"] },
      { id: "q2", text: "Com que frequência você limpa o ambiente?", options: ["Todo dia", "Algumas vezes por semana", "Semanalmente"] },
      { id: "q3", text: "Você investiria em um aspirador robótico?", options: ["Sim, já quero um", "Pensaria bem antes", "Não teria interesse"] },
    ],
  },
  {
    name: "Bicicleta Elétrica Urban",
    category: "Mobilidade",
    desc: "Motor de 250W, bateria de 48V com autonomia de 70km, freios hidráulicos e quadro de alumínio ultraleve.",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&q=80",
    reward: [22, 50],
    questions: [
      { id: "q1", text: "Você usa bicicleta como meio de transporte?", options: ["Sim, regularmente", "Às vezes", "Não uso"] },
      { id: "q2", text: "Mobilidade sustentável é importante para você?", options: ["Muito importante", "Relevante", "Não é prioridade"] },
      { id: "q3", text: "Uma bicicleta elétrica resolveria seu deslocamento?", options: ["Sim, perfeitamente", "Em parte", "Não resolveria"] },
    ],
  },
  {
    name: "Câmera de Segurança 4K",
    category: "Segurança",
    desc: "Câmera IP 4K com visão noturna colorida de 40m, IA de detecção de pessoas, sirene e armazenamento em nuvem.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=300&q=80",
    reward: [14, 33],
    questions: [
      { id: "q1", text: "Você se preocupa com a segurança do seu lar?", options: ["Muito", "Moderadamente", "Pouco"] },
      { id: "q2", text: "Você já usa algum sistema de segurança?", options: ["Sim, completo", "Básico", "Não tenho"] },
      { id: "q3", text: "Câmeras com IA são um diferencial para você?", options: ["Muito importante", "É interessante", "Indiferente"] },
    ],
  },
  {
    name: "Colchão Viscoelástico Pro",
    category: "Conforto & Saúde",
    desc: "Espuma viscoelástica de alta densidade com gel infusionado, 7 zonas de pressão e tecnologia de temperatura neutra.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80",
    reward: [20, 48],
    questions: [
      { id: "q1", text: "Você tem problemas com qualidade de sono?", options: ["Frequentemente", "Às vezes", "Raramente"] },
      { id: "q2", text: "Seu colchão atual te satisfaz?", options: ["Não, quero um melhor", "Mais ou menos", "Estou satisfeito"] },
      { id: "q3", text: "Investiria em um colchão premium?", options: ["Sim, saúde é prioridade", "Dependendo do preço", "Prefiro o básico"] },
    ],
  },
  {
    name: "Monitor Gamer 165Hz",
    category: "Games & Tecnologia",
    desc: "Painel IPS de 27 polegadas, resolução 2K, 165Hz, 1ms de resposta, HDR400 e cobertura de 99% do espaço sRGB.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80",
    reward: [22, 50],
    questions: [
      { id: "q1", text: "Você usa monitor externo no computador?", options: ["Sim, atualmente", "Já usei", "Nunca usei"] },
      { id: "q2", text: "Qual uso principal você teria para este monitor?", options: ["Games", "Trabalho criativo", "Trabalho geral"] },
      { id: "q3", text: "Alta taxa de atualização é importante?", options: ["Essencial", "Um diferencial", "Não faz diferença"] },
    ],
  },
];

/* ─── LIVE NOTIFICATION DATA ─────────────── */
const notifMessages = [
  { name: "Carlos M.", action: "sacou", value: "R$287,00", via: "via Pix" },
  { name: "Ana Lima", action: "recebeu", value: "R$412,50", via: "em avaliações" },
  { name: "João P.", action: "sacou", value: "R$156,00", via: "via Pix" },
  { name: "Mariana S.", action: "recebeu", value: "R$498,75", via: "em avaliações" },
  { name: "Rafael G.", action: "sacou", value: "R$324,00", via: "via Pix" },
  { name: "Fernanda T.", action: "recebeu", value: "R$189,25", via: "em avaliações" },
  { name: "Lucas B.", action: "sacou", value: "R$567,00", via: "via Pix" },
  { name: "Camila R.", action: "recebeu", value: "R$231,00", via: "em avaliações" },
  { name: "Diego A.", action: "sacou", value: "R$445,50", via: "via Pix" },
  { name: "Juliana C.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Thiago N.", action: "sacou", value: "R$290,00", via: "via Pix" },
  { name: "Beatriz O.", action: "atingiu", value: "a meta", via: "e sacou R$520" },
  { name: "Rodrigo F.", action: "sacou", value: "R$378,00", via: "via Pix" },
  { name: "Patricia L.", action: "recebeu", value: "R$267,50", via: "em avaliações" },
  { name: "André S.", action: "sacou", value: "R$512,00", via: "via Pix" },
  { name: "Vanessa M.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
];

/* ─── DOM REFS ───────────────────────────── */
const dom = {
  balanceDisplay:      document.getElementById("balanceDisplay"),
  balancePill:         document.querySelector(".balance-pill"),

  // Bonus modal
  bonusOverlay:        document.getElementById("bonusOverlay"),
  bonusCloseBtn:       document.getElementById("bonusCloseBtn"),

  // Per-eval reward modal
  rewardOverlay:       document.getElementById("rewardOverlay"),
  rewardAmount:        document.getElementById("rewardAmount"),
  rewardCloseBtn:      document.getElementById("rewardCloseBtn"),
  rpmFill:             document.getElementById("rpmFill"),
  rpmCurrent:          document.getElementById("rpmCurrent"),

  // Milestone modal
  milestoneOverlay:    document.getElementById("milestoneOverlay"),
  milestoneAmount:     document.getElementById("milestoneAmount"),
  milestoneEarned:     document.getElementById("milestoneEarned"),
  milestoneDesc:       document.getElementById("milestoneDesc"),
  milestoneContinueBtn:document.getElementById("milestoneContinueBtn"),
  confettiContainer:   document.getElementById("confettiContainer"),

  // Goal modal
  goalOverlay:         document.getElementById("goalOverlay"),
  goalAmount:          document.getElementById("goalAmount"),
  withdrawBtn:         document.getElementById("withdrawBtn"),
  goalContinueBtn:     document.getElementById("goalContinueBtn"),
  goalConfettiContainer:document.getElementById("goalConfettiContainer"),

  // Loading overlay
  loadingOverlay:      document.getElementById("loadingOverlay"),
  lstep1:              document.getElementById("lstep1"),
  lstep2:              document.getElementById("lstep2"),
  lstep3:              document.getElementById("lstep3"),

  // Product
  productImage:        document.getElementById("productImage"),
  imgSkeleton:         document.getElementById("imgSkeleton"),
  productCategory:     document.getElementById("productCategory"),
  productName:         document.getElementById("productName"),
  productDesc:         document.getElementById("productDesc"),
  potentialReward:     document.getElementById("potentialReward"),

  // Rating & questions
  starsRow:            document.getElementById("starsRow"),
  ratingHint:          document.getElementById("ratingHint"),
  questionsBlock:      document.getElementById("questionsBlock"),
  submitBtn:           document.getElementById("submitBtn"),

  // Counter & cycle
  evalCounter:         document.getElementById("evalCounter"),
  evalCycleTag:        document.getElementById("evalCycleTag"),
  cycleDots:           document.getElementById("cycleDots"),

  // Progress
  progressFill:        document.getElementById("progressFill"),
  progressPct:         document.getElementById("progressPct"),
  stage0:              document.getElementById("stage0"),
  stage1:              document.getElementById("stage1"),
  stage2:              document.getElementById("stage2"),
  circleEval:          document.getElementById("circleEval"),
  circleEarn:          document.getElementById("circleEarn"),
  meterEvalPct:        document.getElementById("meterEvalPct"),
  meterEarnVal:        document.getElementById("meterEarnVal"),

  // Withdraw
  withdrawSection:     document.getElementById("withdrawSection"),
  withdrawBannerBtn:   document.getElementById("withdrawBannerBtn"),
  wbSub:               document.getElementById("wbSub"),
  continueEvalBtn:     document.getElementById("continueEvalBtn"),

  // History
  historyList:         document.getElementById("historyList"),
  historyTotal:        document.getElementById("historyTotal"),

  // Notifications
  notifStack:          document.getElementById("notifStack"),

  // Eval card
  evalCard:            document.getElementById("evalCard"),
};

/* ─── HELPERS ────────────────────────────── */
function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── PRODUCT ORDER ──────────────────────── */
function buildProductOrder() {
  // Create shuffled index list; repeat to ensure we never run out
  const indices = products.map((_, i) => i);
  state.productOrder = [
    ...shuffleArray(indices),
    ...shuffleArray(indices),
    ...shuffleArray(indices),
  ];
}

function getCurrentProduct() {
  const idx = state.productOrder[state.currentProductIndex % state.productOrder.length];
  return products[idx];
}

/* ─── BALANCE ANIMATION ──────────────────── */
function updateBalance(amount) {
  const start = state.balance;
  const end = state.balance + amount;
  state.balance = end;

  const duration = 900;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = start + (end - start) * eased;
    dom.balanceDisplay.textContent = formatBRL(current);
    if (t < 1) requestAnimationFrame(tick);
    else dom.balanceDisplay.textContent = formatBRL(end);
  }

  requestAnimationFrame(tick);
  dom.balanceDisplay.classList.add("flash");
  dom.balancePill.classList.add("bump");
  setTimeout(() => {
    dom.balanceDisplay.classList.remove("flash");
    dom.balancePill.classList.remove("bump");
  }, 1100);
}

/* ─── REWARD GENERATION ──────────────────── */
function generateReward() {
  const product = getCurrentProduct();
  const [min, max] = product.reward;
  const base = randomBetween(min, max);
  const cents = randomBetween(0, 99) / 100;
  return Math.round((base + cents) * 100) / 100;
}

/* ─── LOAD PRODUCT ───────────────────────── */
function loadProduct() {
  const product = getCurrentProduct();
  state.rating = 0;
  state.answers = {};

  renderStars(0);
  dom.questionsBlock.classList.add("hidden");
  dom.questionsBlock.innerHTML = "";
  dom.submitBtn.disabled = true;
  dom.ratingHint.textContent = "Toque em uma estrela para avaliar";

  // Cycle display
  const cyclePos = state.cyclePosition; // 1-5
  dom.evalCounter.textContent = `${cyclePos} / 5`;
  dom.evalCycleTag.textContent = `Ciclo ${state.cycleNumber}`;
  updateCycleDots(cyclePos);

  // Potential reward
  const [min, max] = product.reward;
  dom.potentialReward.textContent = formatBRL(max);

  // Skeleton
  dom.imgSkeleton.classList.remove("done");
  dom.productImage.style.opacity = "0";
  dom.productCategory.textContent = product.category;
  dom.productName.textContent = product.name;
  dom.productDesc.textContent = product.desc;

  const img = new Image();
  img.onload = () => {
    dom.productImage.src = img.src;
    dom.productImage.style.opacity = "1";
    dom.imgSkeleton.classList.add("done");
  };
  img.onerror = () => { dom.imgSkeleton.classList.add("done"); };
  img.src = product.image;
}

function updateCycleDots(cyclePos) {
  const dots = dom.cycleDots.querySelectorAll(".cdot");
  dots.forEach((dot, i) => {
    const pos = i + 1;
    dot.classList.remove("filled", "current");
    if (pos < cyclePos) dot.classList.add("filled");
    else if (pos === cyclePos) dot.classList.add("current");
  });
}

/* ─── STAR RATING ────────────────────────── */
function renderStars(active) {
  const stars = dom.starsRow.querySelectorAll(".star");
  stars.forEach((star, i) => {
    const val = i + 1;
    star.classList.toggle("active", val <= active);
    const icon = star.querySelector("i");
    icon.className = val <= active ? "ri-star-fill" : "ri-star-line";
  });
}

function initStars() {
  const stars = dom.starsRow.querySelectorAll(".star");
  stars.forEach((star) => {
    star.addEventListener("mouseenter", () => {
      const val = parseInt(star.dataset.value);
      stars.forEach((s, i) => s.classList.toggle("hovered", i < val));
    });
    star.addEventListener("mouseleave", () => {
      stars.forEach((s) => s.classList.remove("hovered"));
    });
    star.addEventListener("click", () => {
      const val = parseInt(star.dataset.value);
      state.rating = val;
      renderStars(val);
      const hints = ["", "Muito ruim", "Ruim", "Regular", "Bom", "Excelente!"];
      dom.ratingHint.textContent = hints[val];
      showQuestions();
    });
  });
}

/* ─── QUESTIONS ──────────────────────────── */
function showQuestions() {
  const product = getCurrentProduct();
  dom.questionsBlock.classList.remove("hidden");
  dom.questionsBlock.innerHTML = "";

  product.questions.forEach((q) => {
    const item = document.createElement("div");
    item.className = "question-item";

    const qText = document.createElement("p");
    qText.className = "question-text";
    qText.textContent = q.text;

    const optRow = document.createElement("div");
    optRow.className = "options-row";

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        optRow.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.answers[q.id] = opt;
        checkSubmitReady();
      });
      optRow.appendChild(btn);
    });

    item.appendChild(qText);
    item.appendChild(optRow);
    dom.questionsBlock.appendChild(item);
  });

  checkSubmitReady();
}

function checkSubmitReady() {
  const product = getCurrentProduct();
  const allAnswered = product.questions.every(q => state.answers[q.id]);
  dom.submitBtn.disabled = !(state.rating > 0 && allAnswered);
}

/* ─── MAIN SUBMISSION HANDLER ────────────── */
function handleEvaluationSubmit() {
  if (dom.submitBtn.disabled) return;
  dom.submitBtn.disabled = true;

  const reward = generateReward();
  state.lastReward = reward;
  state.evalCount++;
  state.cyclePosition = ((state.evalCount - 1) % 5) + 1; // 1-5
  state.cycleEarnings += reward;
  state.earnedTotal += reward;

  // Animate balance immediately
  updateBalance(reward);
  updateProgress();
  addHistoryItem(getCurrentProduct().name, reward);

  // Decide what to show
  checkMilestones(reward);
}

/* ─── MILESTONE CHECK ────────────────────── */
function checkMilestones(reward) {
  const count = state.evalCount;

  if (count % 10 === 0) {
    // Every 10 evals → goal screen (withdraw unlocked)
    setTimeout(() => {
      unlockWithdraw();
      showGoalScreen();
    }, 750);
  } else if (count % 5 === 0) {
    // Every 5 evals (not 10) → milestone reward screen
    setTimeout(() => {
      showRewardScreen();
    }, 750);
  } else {
    // Normal: per-eval small modal
    setTimeout(() => {
      showPerEvalModal(reward);
    }, 350);
  }
}

/* ─── PER-EVAL SMALL MODAL ───────────────── */
function showPerEvalModal(amount) {
  dom.rewardAmount.textContent = formatBRL(amount);
  // Mini progress in modal
  const cyclePos = state.cyclePosition;
  dom.rpmCurrent.textContent = cyclePos;
  dom.rpmFill.style.width = (cyclePos / 5 * 100) + "%";
  dom.rewardOverlay.classList.remove("hidden");
}

function hidePerEvalModal() {
  dom.rewardOverlay.classList.add("hidden");
  loadNextProduct();
}

/* ─── MILESTONE REWARD SCREEN ────────────── */
function showRewardScreen() {
  const earned = state.cycleEarnings;
  dom.milestoneAmount.textContent = formatBRL(state.balance);
  dom.milestoneEarned.textContent = formatBRL(earned);
  dom.milestoneOverlay.classList.remove("hidden");
  spawnConfetti("confettiContainer", 55);
}

function hideRewardScreen() {
  dom.milestoneOverlay.classList.add("hidden");
  state.cycleEarnings = 0;  // reset cycle earnings
  state.cycleNumber++;
  state.cyclePosition = 0;
  loadNextProduct();
}

/* ─── GOAL SCREEN ────────────────────────── */
function showGoalScreen() {
  dom.goalAmount.textContent = formatBRL(state.balance);
  dom.goalOverlay.classList.remove("hidden");
  spawnConfetti("goalConfettiContainer", 80);
}

function hideGoalScreen(continueEvaluating = false) {
  dom.goalOverlay.classList.add("hidden");
  state.cycleEarnings = 0;
  state.cycleNumber++;
  state.cyclePosition = 0;
  if (continueEvaluating) {
    loadNextProduct();
  }
}

/* ─── UNLOCK WITHDRAW ────────────────────── */
function unlockWithdraw() {
  if (state.withdrawUnlocked) return;
  state.withdrawUnlocked = true;

  // Show withdraw section in progress area
  dom.withdrawSection.classList.remove("hidden");
  dom.wbSub.textContent = `${formatBRL(state.balance)} disponível para saque`;

  // Show continue button
  dom.continueEvalBtn.classList.remove("hidden");

  // Update stage 2
  dom.stage2.classList.add("active");
}

/* ─── REDIRECT TO CHECKOUT ───────────────── */
function redirectToCheckout() {
  dom.goalOverlay.classList.add("hidden");
  dom.loadingOverlay.classList.remove("hidden");

  // Animate loading steps
  const steps = [dom.lstep1, dom.lstep2, dom.lstep3];
  steps.forEach((s, i) => {
    s.classList.remove("active", "done");
  });
  dom.lstep1.classList.add("active");

  setTimeout(() => {
    dom.lstep1.classList.remove("active");
    dom.lstep1.classList.add("done");
    dom.lstep2.classList.add("active");
  }, 1200);

  setTimeout(() => {
    dom.lstep2.classList.remove("active");
    dom.lstep2.classList.add("done");
    dom.lstep3.classList.add("active");
  }, 2400);

  setTimeout(() => {
    window.location.href = "https://pagelink.site/ref?pl=pla22lle&ck=chelz5p4&af=afip1xepl8";
  }, 3600);
}

/* ─── LOAD NEXT PRODUCT ──────────────────── */
function loadNextProduct() {
  state.currentProductIndex++;

  dom.evalCard.classList.add("transitioning");
  setTimeout(() => {
    loadProduct();
    dom.evalCard.classList.remove("transitioning");

    // Scroll to eval card smoothly
    setTimeout(() => {
      dom.evalCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, 320);
}

/* ─── PROGRESS UPDATE ────────────────────── */
function updateProgress() {
  const CIRCUMFERENCE = 201;
  const maxEvals = 10;
  const pct = Math.min((state.evalCount / maxEvals) * 100, 100);
  state.progress = pct;

  dom.progressFill.style.width = pct + "%";
  dom.progressPct.textContent = Math.round(pct) + "%";

  // Stage activation
  if (pct >= 1)  dom.stage0.classList.add("active");
  if (pct >= 50) dom.stage1.classList.add("active");
  if (pct >= 100) dom.stage2.classList.add("active");

  // Circle — evaluations
  const evalOffset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
  dom.circleEval.style.strokeDashoffset = evalOffset;
  dom.meterEvalPct.textContent = Math.round(pct) + "%";

  // Circle — earnings
  const earnMax = 600;
  const earnPct = Math.min(state.earnedTotal / earnMax, 1);
  const earnOffset = CIRCUMFERENCE - earnPct * CIRCUMFERENCE;
  dom.circleEarn.style.strokeDashoffset = earnOffset;
  dom.meterEarnVal.textContent = formatBRL(Math.floor(state.earnedTotal));

  // Update withdraw banner if visible
  if (state.withdrawUnlocked) {
    dom.wbSub.textContent = `${formatBRL(state.balance)} disponível para saque`;
  }
}

/* ─── HISTORY ────────────────────────────── */
let historyTotal = 505.00;

function renderHistory() {
  dom.historyList.innerHTML = "";
  state.historyItems.slice().reverse().forEach(item => {
    appendHistoryItem(item);
  });
  updateHistoryTotal(0);
}

function appendHistoryItem(item) {
  const li = document.createElement("li");
  li.className = "history-item";
  li.innerHTML = `
    <div class="history-icon"><i class="${item.icon || 'ri-check-line'}"></i></div>
    <div class="history-info">
      <p class="history-name">${item.name}</p>
      <p class="history-date">${item.date || "Agora mesmo"}</p>
    </div>
    <span class="history-value">${formatBRL(item.value)}</span>
  `;
  dom.historyList.prepend(li);
}

function addHistoryItem(productName, value) {
  const item = {
    name: `Avaliação: ${productName}`,
    value,
    date: "Agora mesmo",
    icon: "ri-survey-line",
  };
  state.historyItems.unshift(item);
  appendHistoryItem(item);
  updateHistoryTotal(value);
}

function updateHistoryTotal(added) {
  historyTotal += added;
  dom.historyTotal.textContent = formatBRL(historyTotal);
}

/* ─── CONFETTI ───────────────────────────── */
function spawnConfetti(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const shades = [
    "#ffffff", "#e0e0e0", "#c0c0c0", "#a0a0a0",
    "#808080", "#606060", "#404040",
  ];
  const shapes = ["2px", "4px", "6px", "8px"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const size = shapes[Math.floor(Math.random() * shapes.length)];
    const color = shades[Math.floor(Math.random() * shades.length)];
    const duration = (Math.random() * 2 + 1.8);
    const delay = Math.random() * 0.8;
    const left = Math.random() * 100;

    piece.style.cssText = `
      left: ${left}%;
      width: ${size};
      height: ${size};
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
    `;
    container.appendChild(piece);

    setTimeout(() => piece.remove(), (duration + delay + 0.5) * 1000);
  }
}

/* ─── LIVE NOTIFICATIONS ─────────────────── */
let notifIndex = 0;

function showNotification() {
  const data = notifMessages[notifIndex % notifMessages.length];
  notifIndex++;

  const el = document.createElement("div");
  el.className = "notif";
  el.innerHTML = `
    <div class="notif-icon"><i class="ri-user-line"></i></div>
    <p class="notif-text">
      <strong>${data.name}</strong> ${data.action}
      <strong>${data.value}</strong>
      <span>${data.via}</span>
    </p>
  `;
  dom.notifStack.appendChild(el);

  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 360);
  }, 4200);
}

function startNotifications() {
  setTimeout(showNotification, 2800);
  setInterval(showNotification, 6000);
}

/* ─── INIT ───────────────────────────────── */
function init() {
  // Build shuffled product order
  buildProductOrder();

  // Balance display
  dom.balanceDisplay.textContent = formatBRL(state.balance);

  // Show bonus popup
  dom.bonusOverlay.style.display = "flex";

  // Load first product (cyclePosition starts at 1 visually)
  state.cyclePosition = 1;
  loadProduct();

  // Stars
  initStars();

  // Initial progress
  updateProgress();

  // Render history
  renderHistory();

  // Start notifications
  startNotifications();

  /* ── EVENT LISTENERS ── */
  dom.bonusCloseBtn.addEventListener("click", () => {
    dom.bonusOverlay.style.display = "none";
  });

  dom.submitBtn.addEventListener("click", handleEvaluationSubmit);

  dom.rewardCloseBtn.addEventListener("click", hidePerEvalModal);

  dom.milestoneContinueBtn.addEventListener("click", hideRewardScreen);

  dom.withdrawBtn.addEventListener("click", redirectToCheckout);

  dom.goalContinueBtn.addEventListener("click", () => {
    window.location.href = "https://pagelink.site/ref?pl=pla22lle&ck=chelz5p4&af=afip1xepl8";
  });

  dom.withdrawBannerBtn && dom.withdrawBannerBtn.addEventListener("click", () => {
    dom.goalAmount.textContent = formatBRL(state.balance);
    dom.goalOverlay.classList.remove("hidden");
    spawnConfetti("goalConfettiContainer", 40);
  });

  dom.continueEvalBtn && dom.continueEvalBtn.addEventListener("click", () => {
    dom.evalCard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

document.addEventListener("DOMContentLoaded", init);
