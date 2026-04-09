import { motion } from "motion/react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Алексей К.",
    game: "Valorant",
    color: "#FF8A8A",
    text: "Покупал VP несколько раз — всегда всё приходит за 2-3 минуты. Цены ниже, чем везде.",
    stars: 5,
    avatar: "АК",
  },
  {
    name: "Мария В.",
    game: "Fortnite",
    color: "#B47AFF",
    text: "Отличный сервис! V-Bucks пришли моментально. Поддержка очень быстро ответила на вопрос.",
    stars: 5,
    avatar: "МВ",
  },
  {
    name: "Дмитрий Р.",
    game: "Clash Royale",
    color: "#7ABAFF",
    text: "Gems купил на 2500 — пришли мгновенно. Буду заказывать снова, надёжный магазин.",
    stars: 5,
    avatar: "ДР",
  },
  {
    name: "Егор Ф.",
    game: "Apex Legends",
    color: "#FFB07A",
    text: "Apex Coins без проблем! Уже 4-й раз покупаю, всегда доволен. Рекомендую!",
    stars: 5,
    avatar: "ЕМ",
  },
];

export function Reviews() {
  return (
    <section
      className="relative py-24 px-6"
      style={{ background: "#08080E" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs text-white/50"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            ⭐ Отзывы покупателей
          </div>
          <h2
            className="text-white"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            Нам доверяют тысячи игроков
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.09 }}
              className="rounded-2xl p-5 flex flex-col gap-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              whileHover={{
                borderColor: `${review.color}30`,
                background: "rgba(255,255,255,0.045)",
                y: -3,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <Star key={j} size={13} style={{ color: review.color }} fill={review.color} />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-white/55 text-sm leading-relaxed flex-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {review.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{
                    background: `${review.color}20`,
                    color: review.color,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    border: `1px solid ${review.color}30`,
                  }}
                >
                  {review.avatar}
                </div>
                <div>
                  <div
                    className="text-white text-sm"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    {review.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: review.color, fontFamily: "Inter, sans-serif", opacity: 0.75 }}
                  >
                    {review.game}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
