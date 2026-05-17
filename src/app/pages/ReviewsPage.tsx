import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";
import { fetchReviews, type ReviewApi } from "../../api/reviews";
import { fallbackReviews, type ReviewView } from "../../data/reviews";
import { Footer } from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

type ReviewsSource = "api" | "fallback";

function clampStars(value: number) {
  if (!Number.isFinite(value)) return 5;
  return Math.min(5, Math.max(1, Math.round(value)));
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "EC";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatReviewDate(createdAt?: string) {
  if (!createdAt) return "Недавно";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Недавно";

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeReview(review: ReviewApi | ReviewView, index: number): ReviewView {
  const name = review.name?.trim() || "Покупатель";

  return {
    id: review.id ?? `review-${index}`,
    name,
    game: review.game?.trim() || "EgorkaCoins",
    gameColor: review.gameColor || "#B47AFF",
    text: review.text?.trim() || "Все прошло быстро и удобно.",
    stars: clampStars(review.stars),
    avatar: review.avatar || getInitials(name),
    createdAt: review.createdAt,
  };
}

function ReviewCard({ review, index }: { review: ReviewView; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group relative flex min-h-[260px] flex-col gap-5 overflow-hidden rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
      }}
      whileHover={{
        y: -4,
        background: "rgba(255,255,255,0.05)",
        borderColor: `${review.gameColor}40`,
        boxShadow: `0 22px 70px rgba(0,0,0,0.34), 0 0 32px ${review.gameColor}18`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${review.gameColor}, transparent)` }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm"
            style={{
              background: `${review.gameColor}18`,
              border: `1px solid ${review.gameColor}32`,
              color: review.gameColor,
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
            }}
          >
            {review.avatar}
          </div>
          <div className="min-w-0">
            <h3
              className="truncate text-white text-sm"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            >
              {review.name}
            </h3>
            <p
              className="truncate text-xs"
              style={{ color: review.gameColor, fontFamily: "Inter, sans-serif", fontWeight: 600 }}
            >
              {review.game}
            </p>
          </div>
        </div>

        <span
          className="flex-shrink-0 rounded-full px-2.5 py-1 text-[11px]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          {formatReviewDate(review.createdAt)}
        </span>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, starIndex) => {
          const filled = starIndex < review.stars;
          return (
            <Star
              key={starIndex}
              size={15}
              style={{ color: filled ? review.gameColor : "rgba(255,255,255,0.14)" }}
              fill={filled ? review.gameColor : "transparent"}
            />
          );
        })}
      </div>

      <p
        className="flex-1 text-sm leading-relaxed text-white/58"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {review.text}
      </p>

      <div className="flex items-center gap-2 border-t border-white/[0.06] pt-4 text-xs text-white/30">
        <ShieldCheck size={13} style={{ color: review.gameColor }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Проверенный покупатель</span>
      </div>
    </motion.article>
  );
}

export function ReviewsPage() {
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<ReviewView[]>([]);
  const [source, setSource] = useState<ReviewsSource>("fallback");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchReviews().then((result) => {
      if (!mounted) return;

      if (result.ok) {
        setReviews(result.data.map(normalizeReview));
        setSource("api");
        setError(null);
      } else {
        setReviews(fallbackReviews.map(normalizeReview));
        setSource("fallback");
        setError(result.error);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, review) => sum + review.stars, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const gamesCount = useMemo(() => new Set(reviews.map((review) => review.game)).size, [reviews]);
  const visibleReviews = isLoading ? fallbackReviews.slice(0, 6).map(normalizeReview) : reviews;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "#08080E",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full opacity-[0.16]"
          style={{ background: "radial-gradient(circle, #B47AFF 0%, transparent 70%)", filter: "blur(90px)" }}
        />
        <div
          className="absolute bottom-1/4 left-0 h-[360px] w-[360px] rounded-full opacity-[0.09]"
          style={{ background: "radial-gradient(circle, #FF8A8A 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute right-0 top-1/3 h-[360px] w-[360px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #7ABAFF 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <header
        className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12"
        style={{
          background: "rgba(8, 8, 14, 0.84)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-xl outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-white/20"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, #FF8A8A 0%, #B47AFF 100%)",
              boxShadow: "0 0 16px rgba(180, 122, 255, 0.4)",
            }}
          >
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white" style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
            EgorkaCoins
          </span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white/60 transition-colors hover:text-white"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <ShoppingCart size={18} />
            {totalCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"
                style={{ background: "#FF8A8A", fontWeight: 700 }}
              >
                {totalCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/60 transition-colors hover:text-white"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <User size={18} />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-14 md:pt-18">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-10 flex items-center gap-2 text-sm text-white/35 transition-colors hover:text-white/70"
          style={{ fontWeight: 600 }}
        >
          <ArrowLeft size={16} />
          На главную
        </button>

        <section className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-white/55"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontWeight: 600,
              }}
            >
              <MessageCircle size={13} style={{ color: "#B47AFF" }} />
              Отзывы покупателей
            </div>
            <h1
              className="max-w-3xl text-white"
              style={{
                fontWeight: 850,
                fontSize: "clamp(2.2rem, 6vw, 4.6rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.98,
              }}
            >
              Реальные впечатления игроков
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/45 md:text-base">
              Собираем отзывы после покупок игровой валюты. Когда backend будет готов, эта страница начнет брать данные из сервера автоматически.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: "Рейтинг", value: averageRating, color: "#FFB07A" },
              { label: "Отзывов", value: String(isLoading ? fallbackReviews.length : reviews.length), color: "#B47AFF" },
              { label: "Игр", value: String(isLoading ? 4 : gamesCount), color: "#7ABAFF" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="text-2xl text-white" style={{ color: stat.color, fontWeight: 850, letterSpacing: "-0.03em" }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-white/35" style={{ fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {(source === "fallback" || error) && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl px-5 py-4 text-sm text-white/45"
            style={{
              background: "rgba(180,122,255,0.08)",
              border: "1px solid rgba(180,122,255,0.16)",
            }}
          >
            Backend для отзывов пока не подключен, поэтому показаны демо-отзывы. Страница уже готова к `GET /api/reviews`.
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleReviews.map((review, index) => (
              <div
                key={review.id}
                className="min-h-[260px] animate-pulse rounded-2xl"
                style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <ReviewCard review={review} index={index} />
              </div>
            ))}
          </div>
        ) : visibleReviews.length === 0 ? (
          <div
            className="rounded-2xl px-6 py-16 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-white text-lg" style={{ fontWeight: 700 }}>
              Отзывов пока нет
            </p>
            <p className="mt-2 text-sm text-white/35">
              Как только backend вернет первые записи, они появятся здесь.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleReviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
