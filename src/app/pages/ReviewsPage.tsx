import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";
import { fetchGames, type GameApi } from "../../api/games";
import { createReview, fetchReviews, type ReviewApi } from "../../api/reviews";
import { fallbackReviews, type ReviewView } from "../../data/reviews";
import { GameReviewSelect } from "../components/GameReviewSelect";
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
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<ReviewView[]>([]);
  const [source, setSource] = useState<ReviewsSource>("fallback");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<GameApi[]>([]);
  const [selectedGameId, setSelectedGameId] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(5);
  const [formOpen, setFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadReviews = useCallback(() => {
    let mounted = true;
    setIsLoading(true);

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

  useEffect(() => {
    return loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    let mounted = true;

    fetchGames().then((items) => {
      if (!mounted) return;
      setGames(items);
      setSelectedGameId((current) => current || items[0]?.id || "");
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
  const selectedGame = games.find((game) => game.id === selectedGameId) ?? games[0];

  function handleLeaveReview() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setFormOpen(true);
  }

  async function handleCreateReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = reviewText.trim();
    if (!selectedGame) {
      setFormError("Выберите игру");
      return;
    }

    if (text.length < 5) {
      setFormError("Напишите отзыв чуть подробнее");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const result = await createReview({
      game: selectedGame.name,
      gameColor: selectedGame.color || "#B47AFF",
      text,
      stars: reviewStars,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    const created = normalizeReview(result.data, 0);
    setReviews((current) => [created, ...current.filter((review) => review.id !== created.id)]);
    setSource("api");
    setReviewText("");
    setReviewStars(5);
    setFormOpen(false);
  }

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
              Собираем отзывы игроков после покупок игровой валюты. Авторизуйтесь и оставьте свой отзыв - он сразу появится в общем списке.
            </p>
            <motion.button
              type="button"
              onClick={handleLeaveReview}
              className="mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm text-white"
              style={{
                background: "rgba(180,122,255,0.16)",
                border: "1px solid rgba(180,122,255,0.28)",
                boxShadow: "0 0 24px rgba(180,122,255,0.16)",
                fontWeight: 800,
              }}
              whileHover={{ scale: 1.03, background: "rgba(180,122,255,0.22)" }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={16} />
              Оставить отзыв
            </motion.button>
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

        {formOpen && isAuthenticated && (
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreateReview}
            className="mb-8 rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
            }}
          >
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-white text-base" style={{ fontWeight: 800 }}>
                  Новый отзыв
                </h2>
                <p className="mt-1 text-xs text-white/35">
                  От имени {user?.username}. Имя и avatar подставятся автоматически.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="self-start rounded-xl px-3 py-2 text-xs text-white/45 transition-colors hover:text-white/70"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", fontWeight: 700 }}
              >
                Закрыть
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
              <GameReviewSelect
                games={games}
                value={selectedGameId}
                onChange={setSelectedGameId}
              />

              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>
                  Оценка
                </span>
                <div className="flex h-11 items-center gap-1 rounded-xl px-3" style={{ background: "rgba(8,8,14,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;
                    const filled = value <= reviewStars;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setReviewStars(value)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
                        aria-label={`Оценка ${value}`}
                      >
                        <Star
                          size={18}
                          style={{ color: filled ? selectedGame?.color ?? "#B47AFF" : "rgba(255,255,255,0.18)" }}
                          fill={filled ? selectedGame?.color ?? "#B47AFF" : "transparent"}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <label className="mt-4 flex flex-col gap-2">
              <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>
                Текст отзыва
              </span>
              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                rows={4}
                className="resize-none rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
                placeholder="Расскажите, как прошла покупка"
                style={{
                  background: "rgba(8,8,14,0.55)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  lineHeight: 1.55,
                }}
              />
            </label>

            {formError && <p className="mt-3 text-sm text-red-300">{formError}</p>}

            <div className="mt-5 flex justify-end">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: selectedGame ? `${selectedGame.color}28` : "rgba(180,122,255,0.16)",
                  border: `1px solid ${selectedGame?.color ?? "#B47AFF"}44`,
                  fontWeight: 800,
                }}
                whileHover={isSubmitting ? undefined : { scale: 1.03 }}
                whileTap={isSubmitting ? undefined : { scale: 0.97 }}
              >
                {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                Отправить
              </motion.button>
            </div>
          </motion.form>
        )}

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
            Не удалось получить отзывы с сервера, поэтому временно показаны демо-отзывы.
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
