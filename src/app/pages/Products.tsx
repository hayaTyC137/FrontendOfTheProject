import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Star, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router";
import { games, getPackagesByGame, type Package } from "../../data/packages";
import { useCart } from "../context/CartContext";

interface ProductsProps {
  selectedGame: string | null;
}

export const Products = forwardRef<HTMLElement, ProductsProps>(
  function Products({ selectedGame }, ref) {
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
    const navigate = useNavigate();
    const { addItem } = useCart();

    const game = games.find((g) => g.id === selectedGame);
    const packages = selectedGame ? getPackagesByGame(selectedGame) : null;

    function handleAdd(pkg: Package) {
      setAddedIds((prev) => new Set([...prev, pkg.id]));
      addItem(pkg);
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(pkg.id);
          return next;
        });
      }, 2000);
    }

    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="relative py-24 px-6"
        style={{
          background: "linear-gradient(180deg, #08080E 0%, #0C0C16 100%)",
        }}
      >
        {/* Section glow */}
        {game && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 30% at 50% 0%, ${game.colorGlow}18 0%, transparent 70%)`,
            }}
          />
        )}

        <div className="relative z-10 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedGame ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-5">🎮</div>
                <h3
                  className="text-white/60 mb-2"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                  }}
                >
                  Выбери игру выше
                </h3>
                <p
                  className="text-white/30 text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Чтобы увидеть доступные пакеты валюты
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedGame}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: game!.color,
                          boxShadow: `0 0 10px ${game!.color}`,
                        }}
                      />
                      <h2
                        className="text-white"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {game!.name} — {game!.currency}
                      </h2>
                    </div>
                    <p
                      className="text-white/40 text-sm"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Выбери подходящий пакет и пополни баланс мгновенно
                    </p>
                  </div>

                  <div className="sm:ml-auto flex items-center gap-2 text-xs text-white/40 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "Inter, sans-serif" }}
                  >
                    <Zap size={12} style={{ color: game!.color }} />
                    Мгновенная доставка
                  </div>
                </div>

                {/* Packages grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages!.map((pkg, i) => {
                    const isAdded = addedIds.has(pkg.id);
                    return (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => navigate(`/product/${pkg.id}`)}
                        className="group relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden cursor-pointer"
                        style={{
                          background: pkg.popular
                            ? `${game!.colorDim}`
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${
                            pkg.popular
                              ? `${game!.color}40`
                              : "rgba(255,255,255,0.07)"
                          }`,
                          transition: "all 0.2s ease",
                        }}
                        whileHover={{
                          y: -4,
                          boxShadow: `0 10px 40px ${game!.colorGlow}`,
                          borderColor: `${game!.color}50`,
                          background: pkg.popular
                            ? `${game!.colorDim}`
                            : "rgba(255,255,255,0.05)",
                        }}
                      >
                        {/* Popular badge */}
                        {pkg.badge && (
                          <div
                            className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px]"
                            style={{
                              background: `${game!.color}20`,
                              color: game!.color,
                              border: `1px solid ${game!.color}35`,
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 700,
                            }}
                          >
                            {pkg.badge}
                          </div>
                        )}

                        {/* Amount */}
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: `${game!.color}18`,
                              border: `1px solid ${game!.color}25`,
                            }}
                          >
                            {pkg.popular ? (
                              <Star
                                size={18}
                                style={{ color: game!.color }}
                                fill={game!.color}
                              />
                            ) : (
                              <TrendingUp size={18} style={{ color: game!.color }} />
                            )}
                          </div>
                          <div>
                            <div
                              className="text-white"
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 700,
                                fontSize: "1.05rem",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {pkg.label}
                            </div>
                            {pkg.bonus && (
                              <div
                                className="text-xs mt-0.5"
                                style={{
                                  color: game!.color,
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 500,
                                  opacity: 0.8,
                                }}
                              >
                                🎁 {pkg.bonus}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Divider */}
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

                        {/* Price + button */}
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div
                              className="text-white"
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 800,
                                fontSize: "1.25rem",
                                letterSpacing: "-0.02em",
                              }}
                            >
                              ${pkg.price}
                            </div>
                            {pkg.oldPrice && (
                              <div
                                className="text-white/30 text-xs line-through"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                ${pkg.oldPrice}
                              </div>
                            )}
                          </div>

                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdd(pkg);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white transition-all"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 600,
                              background: isAdded
                                ? `${game!.color}22`
                                : `${game!.color}18`,
                              border: `1px solid ${game!.color}35`,
                              color: isAdded ? game!.color : game!.color,
                              minWidth: "110px",
                              justifyContent: "center",
                            }}
                            whileHover={{
                              scale: 1.04,
                              background: `${game!.color}28`,
                              boxShadow: `0 0 16px ${game!.colorGlow}`,
                            }}
                            whileTap={{ scale: 0.96 }}
                          >
                            <AnimatePresence mode="wait">
                              {isAdded ? (
                                <motion.span
                                  key="added"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="flex items-center gap-1.5"
                                >
                                  ✓ Добавлено
                                </motion.span>
                              ) : (
                                <motion.span
                                  key="buy"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="flex items-center gap-1.5"
                                >
                                  <ShoppingCart size={13} />
                                  Купить
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Info strip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 rounded-2xl px-6 py-4 flex flex-wrap gap-4 items-center justify-between"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {[
                    { icon: "⚡", text: "Доставка 1-5 минут" },
                    { icon: "🔒", text: "Безопасная оплата" },
                    { icon: "💬", text: "Поддержка 24/7" },
                    { icon: "✅", text: "Официальные методы" },
                  ].map(({ icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 text-white/40 text-xs"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span>{icon}</span>
                      {text}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  }
);