export type ReviewView = {
  id: number | string;
  name: string;
  game: string;
  gameColor: string;
  text: string;
  stars: number;
  avatar?: string;
  createdAt?: string;
};

export const fallbackReviews: ReviewView[] = [
  {
    id: "fallback-1",
    name: "Алексей К.",
    game: "Valorant",
    gameColor: "#FF8A8A",
    text: "Покупал VP несколько раз - всегда все приходит за 2-3 минуты. Цены ниже, чем везде.",
    stars: 5,
    avatar: "АК",
    createdAt: "2026-05-10T12:00:00Z",
  },
  {
    id: "fallback-2",
    name: "Мария В.",
    game: "Fortnite",
    gameColor: "#B47AFF",
    text: "Отличный сервис! V-Bucks пришли моментально. Поддержка очень быстро ответила на вопрос.",
    stars: 5,
    avatar: "МВ",
    createdAt: "2026-05-08T15:30:00Z",
  },
  {
    id: "fallback-3",
    name: "Дмитрий Р.",
    game: "Clash Royale",
    gameColor: "#7ABAFF",
    text: "Gems купил на 2500 - пришли мгновенно. Буду заказывать снова, надежный магазин.",
    stars: 5,
    avatar: "ДР",
    createdAt: "2026-05-06T09:20:00Z",
  },
  {
    id: "fallback-4",
    name: "Егор Ф.",
    game: "Apex Legends",
    gameColor: "#FFB07A",
    text: "Apex Coins без проблем! Уже 4-й раз покупаю, всегда доволен. Рекомендую!",
    stars: 5,
    avatar: "ЕФ",
    createdAt: "2026-05-03T18:10:00Z",
  },
  {
    id: "fallback-5",
    name: "Илья М.",
    game: "Valorant",
    gameColor: "#FF8A8A",
    text: "Заказ оформился быстро, ничего лишнего. Валюта пришла раньше, чем я успел открыть игру.",
    stars: 5,
    avatar: "ИМ",
    createdAt: "2026-04-30T11:45:00Z",
  },
  {
    id: "fallback-6",
    name: "София Н.",
    game: "Fortnite",
    gameColor: "#B47AFF",
    text: "Понравился интерфейс и скорость. Оплатила, проверила аккаунт - все уже было на месте.",
    stars: 5,
    avatar: "СН",
    createdAt: "2026-04-27T16:05:00Z",
  },
  {
    id: "fallback-7",
    name: "Никита П.",
    game: "Clash Royale",
    gameColor: "#7ABAFF",
    text: "Брал набор для Clash Royale. Четко, быстро и без странных подтверждений.",
    stars: 4,
    avatar: "НП",
    createdAt: "2026-04-24T20:00:00Z",
  },
  {
    id: "fallback-8",
    name: "Арина С.",
    game: "Apex Legends",
    gameColor: "#FFB07A",
    text: "Хороший магазин для пополнений. Карточки понятные, цена сразу видна, доставка быстрая.",
    stars: 5,
    avatar: "АС",
    createdAt: "2026-04-20T13:15:00Z",
  },
];
