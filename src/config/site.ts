/**
 * Conteúdo editável do site. Todo texto do NOIR STUDIO vem daqui.
 * ATENÇÃO: clientes, equipe, números e depoimentos são FICTÍCIOS (demonstração).
 * As imagens dos projetos são renders 3D originais, gerados por scripts/render-art.py
 * e convertidos por scripts/optimize-art.mjs. Não são fotografias de clientes reais.
 */

/** Nome base dos arquivos em public/images/projects, na ordem das variantes de arte (0–5). */
export const imageSlugs = [
  "halo-mobility",
  "tessera-foods",
  "marrow-audio",
  "oblique-architecture",
  "kairo-health",
  "vanta-spirits",
] as const;


// Lê as variáveis VITE_* quando rodando no Vite; sem import.meta.env (ex.: testes em Node) usa o padrão.
const env = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}) as Record<string, string | undefined>;

export const site = {
  name: "NOIR STUDIO",
  url: env.VITE_SITE_URL || "https://seu-dominio.com",
  description:
    "Estúdio criativo de branding, websites, motion e direção criativa para marcas que não cabem em template.",
  email: "ola@exemplo.com",
  location: "Atendimento remoto — Brasil",
  nav: [
    { label: "Projetos", to: "/projetos" },
    { label: "Serviços", to: "/servicos" },
    { label: "Sobre", to: "/sobre" },
    { label: "Contato", to: "/contato" },
  ],
};

export const hero = {
  eyebrow: "Estúdio criativo, desde 2019",
  lines: ["Marcas", "que pedem", "outra coisa."],
  intro: "Construímos identidades, sites e movimento para empresas que querem ser lembradas, não apenas vistas.",
  cta: { label: "Ver projetos", to: "/projetos" },
  secondary: { label: "Iniciar um projeto", to: "/contato" },
};

export type Project = {
  slug: string;
  client: string;
  sector: string;
  year: number;
  headline: string;
  summary: string;
  art: 0 | 1 | 2 | 3 | 4 | 5;
  challenge: string;
  approach: string[];
  outcome: string;
  metrics: { value: string; label: string }[];
  services: string[];
};

/** Clientes FICTÍCIOS. Métricas são demonstrativas e não representam dados reais. */
export const projects: Project[] = [
  {
    slug: "halo-mobility",
    client: "Halo Mobility",
    sector: "Mobilidade elétrica",
    year: 2025,
    headline: "Velocidade que se sente antes de se ver.",
    summary: "Identidade e site para uma operadora de patinetes elétricos urbanos.",
    art: 0,
    challenge: "A marca era associada a barulho e pressa. A operadora queria transmitir calma, previsibilidade e tecnologia sem parecer fria.",
    approach: [
      "Mapeamos o ritmo da cidade a partir de trajetos reais, transformados em um sistema de linhas.",
      "Criamos um logotipo que se desenha como uma trajetória contínua.",
      "Site com mapa-pulso que responde ao horário de pico.",
    ],
    outcome: "Identidade aplicada em frota, app e sinalização, com um sistema de movimento que vai do cartão de viagem à tela do veículo.",
    metrics: [
      { value: "3 cidades", label: "Lançamento simultâneo (demonstrativo)" },
      { value: "+41%", label: "Tempo médio na página inicial (demonstrativo)" },
    ],
    services: ["Branding", "Website", "Motion"],
  },
  {
    slug: "tessera-foods",
    client: "Tessera Foods",
    sector: "Alimentos artesanais",
    year: 2024,
    headline: "Mosaico de sabores, uma única assinatura.",
    summary: "Sistema de embalagem modular para uma fábrica de conservas artesanais.",
    art: 1,
    challenge: "Dezenove sabores com fotografias diferentes e nenhuma coerência na gôndola. O consumidor não conseguia reconhecer a família.",
    approach: [
      "Grade modular que organiza cada sabor como uma peça de um mosaico.",
      "Cor de cada produto derivada do ingrediente principal, sempre sobre fundo neutro.",
      "Tipografia editorial para os nomes e sans-serif para as informações técnicas.",
    ],
    outcome: "Sistema de rótulos aprovado para 19 SKUs, com manual de aplicação para fornecedores de embalagem.",
    metrics: [
      { value: "19 SKUs", label: "Família unificada (demonstrativo)" },
      { value: "2 semanas", label: "Adoção pelo time comercial (demonstrativo)" },
    ],
    services: ["Branding", "Direção criativa"],
  },
  {
    slug: "marrow-audio",
    client: "Marrow Audio",
    sector: "Hardware de áudio",
    year: 2025,
    headline: "Silêncio desenhado com precisão.",
    summary: "Site de lançamento e filme de produto para um fone de ouvido de estúdio.",
    art: 2,
    challenge: "Especificações técnicas dominavam tudo e o produto perdia a sensação física que o fazia valer a pena.",
    approach: [
      "Scroll narrativo que desmonta o produto camada por camada.",
      "Movimento sincronizado com o espectro sonoro de uma faixa gravada no estúdio.",
      "Especificações aparecem apenas quando o visitante pede.",
    ],
    outcome: "Página de lançamento com navegação por camadas e um filme de 45 segundos usado em todas as campanhas.",
    metrics: [
      { value: "45 s", label: "Filme de produto (demonstrativo)" },
      { value: "0", label: "Pop-ups de cadastro (decisão de direção)" },
    ],
    services: ["Website", "Motion", "Direção criativa"],
  },
  {
    slug: "oblique-architecture",
    client: "Oblique Arquitetura",
    sector: "Arquitetura",
    year: 2023,
    headline: "Plantas que viram atmosfera.",
    summary: "Identidade e portfólio digital para um escritório de arquitetura residencial.",
    art: 3,
    challenge: "O portfólio era bom, mas parecia um catálogo. Faltava a sensação de estar dentro dos projetos.",
    approach: [
      "Portfólio em formato de planta baixa: cada projeto é um cômodo a explorar.",
      "Cotas e cortes de planta como elementos gráficos da identidade.",
      "Imagens revelam o espaço conforme o cursor se move.",
    ],
    outcome: "Portfólio digital e identidade com sistema de cotas que virou assinatura visual do escritório.",
    metrics: [
      { value: "12", label: "Projetos documentados (demonstrativo)" },
      { value: "2×", label: "Pedidos de orçamento pelo site (demonstrativo)" },
    ],
    services: ["Branding", "Website"],
  },
  {
    slug: "kairo-health",
    client: "Kairo Saúde",
    sector: "Saúde digital",
    year: 2024,
    headline: "Cuidado que cabe na palma da mão.",
    summary: "Redesenho de marca e de onboarding para uma plataforma de telemedicina.",
    art: 4,
    challenge: "O cadastro era longo e clínico. Pessoas desistiam antes da primeira consulta, justamente quando precisavam de clareza.",
    approach: [
      "Reescrita de linguagem: frases curtas, verbos ativos e nenhum termo técnico sem explicação.",
      "Cadastro em etapas, com progresso visível e saída sempre disponível.",
      "Paleta calma, com o acento verde reservado às ações principais.",
    ],
    outcome: "Onboarding redesenhado e guia de voz e tom para toda a comunicação com pacientes.",
    metrics: [
      { value: "−32%", label: "Abandono no cadastro (demonstrativo)" },
      { value: "4 etapas", label: "Fluxo final, antes eram 9 (demonstrativo)" },
    ],
    services: ["Branding", "Website", "Direção criativa"],
  },
  {
    slug: "vanta-spirits",
    client: "Vanta Spirits",
    sector: "Destilados",
    year: 2025,
    headline: "Noite longa, uma só marca.",
    summary: "Identidade e campanha em motion para uma destilaria de gim de pequenos lotes.",
    art: 5,
    challenge: "O produto era premium no conteúdo, mas a estética dependia de clichês de bar. Precisava de uma voz própria.",
    approach: [
      "Paleta de três tons inspirada na luz do fim de expediente.",
      "Campanha em loops curtos para redes e totens de degustação.",
      "Embalagem com relevo tátil e gravação a laser no vidro.",
    ],
    outcome: "Sistema de identidade, campanha em 6 formatos e manual de motion para parceiros de bar.",
    metrics: [
      { value: "6 formatos", label: "Peças de campanha (demonstrativo)" },
      { value: "1 lote", label: "Produção piloto esgotada (demonstrativo)" },
    ],
    services: ["Branding", "Motion"],
  },
];

export const services = [
  {
    id: "branding",
    title: "Branding",
    summary: "Identidades que funcionam em tela, em embalagem e em silêncio.",
    deliverables: ["Estratégia de marca", "Logotipo e variações", "Sistema tipográfico e cromático", "Manual de aplicação"],
  },
  {
    id: "websites",
    title: "Websites",
    summary: "Sites rápidos, acessíveis e pensados como experiência, não como vitrine.",
    deliverables: ["Arquitetura de informação", "Design de interface", "Desenvolvimento front-end", "SEO técnico e publicação"],
  },
  {
    id: "motion",
    title: "Motion",
    summary: "Movimento com função: explica, orienta e cria memória.",
    deliverables: ["Filmes de produto", "Loops para redes", "Animações de interface", "Sistemas de movimento"],
  },
  {
    id: "direcao",
    title: "Direção criativa",
    summary: "Uma ideia central que orienta todas as peças, do rótulo ao anúncio.",
    deliverables: ["Conceito criativo", "Direção de arte", "Acompanhamento de produção", "Governança de marca"],
  },
];

export const processSteps = [
  { title: "Escuta", text: "Entrevistas, dados e imersão no território da marca antes de qualquer desenho." },
  { title: "Territórios", text: "Duas ou três direções conceituais, cada uma com justificativa escrita." },
  { title: "Construção", text: "Protótipos em tela e no mundo real, com revisões em ciclos curtos." },
  { title: "Lançamento", text: "Publicação, documentação e acompanhamento depois da entrega." },
];

export const manifesto = [
  "Acreditamos que uma marca é uma decisão, não um arquivo.",
  "Recusamos o template porque ele resolve o problema de outra pessoa.",
  "Trabalhamos com menos peças e mais intenção.",
  "Cada projeto começa com uma pergunta difícil e termina quando a resposta cabe em uma frase.",
];

/** Equipe FICTÍCIA — apenas demonstração. Substitua pelos dados reais antes de publicar. */
export const team = [
  { name: "Ana Lívia Moraes", role: "Direção criativa" },
  { name: "Rafael Duarte", role: "Motion e direção de arte" },
  { name: "Helena Prado", role: "Front-end e interação" },
  { name: "Caio Nakamura", role: "Branding e tipografia" },
];
