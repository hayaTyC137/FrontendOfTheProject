
export const games = [
  {
    id: "valorant",
    name: "Valorant",
    currency: "Valorant Points",
    abbr: "VP",
    color: "#FF8A8A",
    colorDim: "rgba(255,138,138,0.12)",
    colorGlow: "rgba(255,138,138,0.25)",
    icon: "/images/Valorant-Logo-PNG.png",
    description: "Боевые пасы, скины, агенты",
    tag: "Популярно",
    banner: "/images/valorant-banner.jpg",
    about: "Valorant Points — официальная валюта тактического шутера Valorant от Riot Games. Используется для покупки косметических предметов в игровом магазине.",
    usedFor: [
      "Скины на оружие и агентов",
      "Боевые пропуска и бандлы",
      "Карточки игрока и спреи",
      "Разблокировка новых агентов",
    ],
  },
  {
    id: "clashroyale",
    name: "Clash Royale",
    currency: "Gems",
    abbr: "GEM",
    color: "#7ABAFF",
    colorDim: "rgba(122,186,255,0.12)",
    colorGlow: "rgba(122,186,255,0.25)",
    emoji: "💎",
    description: "Карточки, сундуки, пасы",
    tag: "Топ продаж",
    banner: null,
    about: "Gems — премиальная валюта Clash Royale от Supercell. Позволяет ускорить прогресс, открывать сундуки и участвовать в специальных событиях.",
    usedFor: [
      "Открытие магических сундуков",
      "Покупка редких карточек",
      "Участие в турнирах",
      "Золото и ресурсы для прокачки",
    ],
  },
  {
    id: "fortnite",
    name: "Fortnite",
    currency: "V-Bucks",
    abbr: "VB",
    color: "#B47AFF",
    colorDim: "rgba(180,122,255,0.12)",
    colorGlow: "rgba(180,122,255,0.25)",
    emoji: "🎮",
    description: "Скины, эмоции, боевой пропуск",
    tag: "Хит",
    banner: null,
    about: "V-Bucks — внутриигровая валюта Fortnite от Epic Games. Самая популярная игровая валюта в мире, используется для персонализации персонажа.",
    usedFor: [
      "Скины персонажей и оружия",
      "Эмоции и танцы",
      "Боевой пропуск сезона",
      "Планер и рюкзак",
    ],
  },
  {
    id: "apex",
    name: "Apex Legends",
    currency: "Apex Coins",
    abbr: "AC",
    color: "#FFB07A",
    colorDim: "rgba(255,176,122,0.12)",
    colorGlow: "rgba(255,176,122,0.25)",
    emoji: "🔥",
    description: "Скины, боевые пасы, бандлы",
    tag: "Новинки",
    banner: null,
    about: "Apex Coins — премиальная валюта Apex Legends от EA и Respawn. Открывает доступ к эксклюзивным скинам легенд и оружия.",
    usedFor: [
      "Скины легенд и оружия",
      "Боевой пропуск Apex",
      "Эксклюзивные бандлы",
      "Разблокировка новых легенд",
    ],
  },
];

export type Package = {
  id: string;
  gameId: string;
  amount: number;
  label: string;
  price: number;
  oldPrice?: number;
  bonus?: string;
  badge?: string;
  popular?: boolean;
};

export const allPackages: Package[] = [
  // Valorant
  { id: "vp1", gameId: "valorant", amount: 475,   label: "475 VP",    price: 4.99 },
  { id: "vp2", gameId: "valorant", amount: 1000,  label: "1 000 VP",  price: 9.99,  oldPrice: 11.99, bonus: "+50 VP бонус" },
  { id: "vp3", gameId: "valorant", amount: 2050,  label: "2 050 VP",  price: 19.99, badge: "Выгодно", popular: true },
  { id: "vp4", gameId: "valorant", amount: 4100,  label: "4 100 VP",  price: 34.99, oldPrice: 39.99, bonus: "+200 VP бонус" },
  { id: "vp5", gameId: "valorant", amount: 8700,  label: "8 700 VP",  price: 69.99, bonus: "+700 VP бонус", badge: "Максимум" },
  { id: "vp6", gameId: "valorant", amount: 11000, label: "11 000 VP", price: 79.99, oldPrice: 99.99, bonus: "+1000 VP бонус" },

  // Clash Royale
  { id: "gem1", gameId: "clashroyale", amount: 80,    label: "80 Gems",      price: 0.99 },
  { id: "gem2", gameId: "clashroyale", amount: 500,   label: "500 Gems",     price: 4.99 },
  { id: "gem3", gameId: "clashroyale", amount: 1200,  label: "1 200 Gems",   price: 9.99,  popular: true, badge: "Хит" },
  { id: "gem4", gameId: "clashroyale", amount: 2500,  label: "2 500 Gems",   price: 19.99, oldPrice: 24.99, bonus: "+200 Gems бонус" },
  { id: "gem5", gameId: "clashroyale", amount: 6500,  label: "6 500 Gems",   price: 49.99, badge: "Выгодно" },
  { id: "gem6", gameId: "clashroyale", amount: 14000, label: "14 000 Gems",  price: 99.99, oldPrice: 129.99, bonus: "+2000 Gems" },

  // Fortnite
  { id: "vb1", gameId: "fortnite", amount: 1000,  label: "1 000 V-Bucks",  price: 7.99 },
  { id: "vb2", gameId: "fortnite", amount: 2800,  label: "2 800 V-Bucks",  price: 19.99, popular: true, badge: "Популярно" },
  { id: "vb3", gameId: "fortnite", amount: 5000,  label: "5 000 V-Bucks",  price: 31.99, oldPrice: 39.99, bonus: "+300 V-Bucks" },
  { id: "vb4", gameId: "fortnite", amount: 7500,  label: "7 500 V-Bucks",  price: 47.99, badge: "Выгодно" },
  { id: "vb5", gameId: "fortnite", amount: 13500, label: "13 500 V-Bucks", price: 79.99, bonus: "+1500 V-Bucks", oldPrice: 99.99 },
  { id: "vb6", gameId: "fortnite", amount: 40000, label: "40 000 V-Bucks", price: 199.99, badge: "Максимум" },

  // Apex Legends
  { id: "ac1", gameId: "apex", amount: 1000,  label: "1 000 Coins",  price: 9.99 },
  { id: "ac2", gameId: "apex", amount: 2150,  label: "2 150 Coins",  price: 19.99, popular: true, badge: "Хит" },
  { id: "ac3", gameId: "apex", amount: 4350,  label: "4 350 Coins",  price: 39.99, oldPrice: 49.99, bonus: "+150 Coins" },
  { id: "ac4", gameId: "apex", amount: 6700,  label: "6 700 Coins",  price: 59.99, badge: "Выгодно" },
  { id: "ac5", gameId: "apex", amount: 11500, label: "11 500 Coins", price: 99.99, bonus: "+500 Coins" },
  { id: "ac6", gameId: "apex", amount: 20000, label: "20 000 Coins", price: 159.99, oldPrice: 199.99, badge: "Максимум" },
];

export function getPackageById(id: string): Package | undefined {
  return allPackages.find((p) => p.id === id);
}

export function getPackagesByGame(gameId: string): Package[] {
  return allPackages.filter((p) => p.gameId === gameId);
}

export function getGameById(id: string) {
  return games.find((g) => g.id === id);
}