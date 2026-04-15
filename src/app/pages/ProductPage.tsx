import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingCart, Zap, Shield, Clock, Star, CheckCircle2 } from "lucide-react";
import { getPackageById, getPackagesByGame, getGameById } from "../../data/packages";
import { renderGameMark } from "../utils/renderGameMark";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = getPackageById(id ?? "");
  
  const game = product ? getGameById(product.gameId) : undefined;
  const similarPackages = product
    ? getPackagesByGame(product.gameId).filter((p) => p.id !== product.id)
    : [];

  if (!product || !game) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#08080E", fontFamily: "Inter, sans-serif" }}
      >
        <p className="text-white/50 text-lg">Товар не найден</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-xl text-white text-sm"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          На главную
        </button>
      </div>
    );
  }
  const productIconClass = game.productIconClass;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#08080E", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* ── БАННЕР ── */}
      <div className="relative w-full h-64 overflow-hidden">
        {game.banner ? (
          <img
            src={game.banner}
            alt={game.name}
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.6)" }}
          />
        ) : (
          /* Заглушка — градиент в цветах игры */
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${game.color}30 0%, #08080E 60%)`,
              borderBottom: `1px solid ${game.color}20`,
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center text-8xl opacity-10"
              style={{ filter: `drop-shadow(0 0 40px ${game.color})` }}
            >
              {renderGameMark({ icon: game.icon, name: game.name, className: "w-12 h-12 rounded-xl" })}
            </div>
          </div>
        )}

        {/* Затемнение снизу */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(8,8,14,0.2) 0%, rgba(8,8,14,0.7) 70%, #08080E 100%)",
          }}
        />

        {/* Название игры поверх баннера */}
        <div className="absolute bottom-5 left-8 flex items-center gap-3">
          <span className="text-3xl" style={{ filter: `drop-shadow(0 0 12px ${game.color})` }}>
            {renderGameMark({ icon: game.icon, name: game.name, className: "w-12 h-12 rounded-xl" })}
          </span>
          <div>
            <h2 className="text-white text-xl" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              {game.name}
            </h2>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full"
              style={{
                background: `${game.color}20`,
                color: game.color,
                border: `1px solid ${game.color}35`,
                fontWeight: 600,
              }}
            >
              {game.currency}
            </span>
          </div>
        </div>
      </div>

      {/* ── ОСНОВНОЙ КОНТЕНТ ── */}
      <div className="relative px-6 py-8 max-w-6xl mx-auto">

        {/* Кнопка назад */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-sm transition-colors hover:text-white/70"
          style={{ color: "rgba(255,255,255,0.35)", fontWeight: 500 }}
        >
          <ArrowLeft size={16} />
          Назад к каталогу
        </motion.button>

        {/* Три колонки */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">

          {/* ── Колонка 1: иконка + фичи ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-5"
          >
            <div
              className="w-32 h-32 rounded-2xl flex items-center justify-center text-6xl"
              style={{
                background: game.colorDim,
                border: `1px solid ${game.color}40`,
                boxShadow: `0 0 40px ${game.colorGlow}, 0 0 80px ${game.colorGlow}`,
              }}
            >
              {renderGameMark({ icon: game.icon, name: game.name, className: productIconClass })}
            </div>

            <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
              {game.description}
            </p>

            <div className="flex flex-col gap-2 w-full">
              {[
                { icon: Zap,    label: "Мгновенная доставка", color: "#B47AFF" },
                { icon: Shield, label: "100% безопасно",      color: "#7ABAFF" },
                { icon: Clock,  label: "Поддержка 24/7",      color: "#FFB07A" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Icon size={14} style={{ color }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Колонка 2: карточка товара ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative rounded-2xl p-7 flex flex-col gap-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
            }}
          >
            {product.badge && (
              <span
                className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs"
                style={{
                  background: "linear-gradient(135deg, #B47AFF, #FF8A8A)",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {product.badge}
              </span>
            )}

            <div>
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                Пакет валюты
              </p>
              <h1
                className="text-white"
                style={{ fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
              >
                {product.label}
              </h1>
              {product.bonus && (
                <div className="flex items-center gap-2 mt-2">
                  <Star size={12} style={{ color: "#7AFF9B" }} />
                  <span className="text-sm" style={{ color: "#7AFF9B", fontWeight: 600 }}>
                    {product.bonus}
                  </span>
                </div>
              )}
            </div>

            <div className="py-4 border-y" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              {product.oldPrice && (
                <p className="text-sm line-through mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  ${product.oldPrice}
                </p>
              )}
              <p className="text-white" style={{ fontWeight: 800, fontSize: "2.2rem", letterSpacing: "-0.03em", lineHeight: 1 }}>
                ${product.price}
              </p>
              {product.oldPrice && (
                <p className="text-xs mt-1" style={{ color: "#7AFF9B", fontWeight: 600 }}>
                  Экономия ${(product.oldPrice - product.price).toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <motion.button
                className="w-full py-3.5 rounded-xl text-white text-sm"
                style={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
                  boxShadow: "0 0 28px rgba(180,122,255,0.35), 0 4px 20px rgba(0,0,0,0.3)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(180,122,255,0.55)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Купить сейчас
              </motion.button>

              <motion.button
                className="w-full py-3 rounded-xl text-white/70 text-sm flex items-center justify-center gap-2 hover:text-white transition-colors"
                style={{
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.97 }}
              >
                <ShoppingCart size={14} />
                Добавить в корзину
              </motion.button>
            </div>

            <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
              Безопасная оплата · Мгновенная доставка · Возврат 14 дней
            </p>
          </motion.div>

          {/* ── Колонка 3: инфо панель ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* О валюте */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h3
                className="text-white mb-3 text-sm"
                style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                О валюте
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {game.about}
              </p>
            </div>

            {/* На что потратить */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h3
                className="text-white mb-3 text-sm"
                style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                На что потратить
              </h3>
              <div className="flex flex-col gap-2">
                {game.usedFor.map((item: string) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} style={{ color: game.color, flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Тег игры */}
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: `${game.color}10`,
                border: `1px solid ${game.color}25`,
              }}
            >
              <span className="text-2xl">{renderGameMark({ icon: game.icon, name: game.name, className: "w-12 h-12 rounded-xl" })}</span>
              <div>
                <p className="text-white text-sm" style={{ fontWeight: 700 }}>{game.name}</p>
                <p className="text-xs" style={{ color: game.color, fontWeight: 600 }}>{game.tag}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Похожие товары ── */}
        {similarPackages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <h3 className="text-white mb-5" style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              Другие пакеты {game.name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {similarPackages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  onClick={() => navigate(`/product/${pkg.id}`)}
                  className="relative cursor-pointer rounded-xl p-4 flex flex-col gap-1.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  whileHover={{
                    scale: 1.03,
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${game.color}40`,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {pkg.badge && (
                    <span
                      className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px]"
                      style={{
                        background: `${game.color}25`,
                        color: game.color,
                        fontWeight: 700,
                        border: `1px solid ${game.color}40`,
                      }}
                    >
                      {pkg.badge}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                    {pkg.label}
                  </span>
                  <span className="text-white text-sm" style={{ fontWeight: 700 }}>
                    ${pkg.price}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}