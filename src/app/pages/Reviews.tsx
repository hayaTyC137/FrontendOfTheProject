import { motion } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { fallbackReviews } from "../../data/reviews";

export function Reviews() {
  const navigate = useNavigate();
  const reviews = fallbackReviews.slice(0, 4);

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
          <motion.button
            type="button"
            onClick={() => navigate("/reviews")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm text-white"
            style={{
              background: "rgba(180,122,255,0.12)",
              border: "1px solid rgba(180,122,255,0.24)",
              boxShadow: "0 0 22px rgba(180,122,255,0.14)",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
            }}
            whileHover={{ scale: 1.03, background: "rgba(180,122,255,0.18)" }}
            whileTap={{ scale: 0.97 }}
          >
            Все отзывы
            <ArrowRight size={14} />
          </motion.button>
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
                borderColor: `${review.gameColor}30`,
                background: "rgba(255,255,255,0.045)",
                y: -3,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <Star key={j} size={13} style={{ color: review.gameColor }} fill={review.gameColor} />
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
                    background: `${review.gameColor}20`,
                    color: review.gameColor,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    border: `1px solid ${review.gameColor}30`,
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
                    style={{ color: review.gameColor, fontFamily: "Inter, sans-serif", opacity: 0.75 }}
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
