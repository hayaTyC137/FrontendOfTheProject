import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Star, TrendingUp, Zap } from "lucide-react";
import { games } from "./GameSelector";

const allPackages: Record<
  string,
  {
    id: string;
    amount: number;
    label: string;
    price: number;
    oldPrice?: number;
    bonus?: string;
    badge?: string;
    popular?: boolean;
  }[]
> = {
  valorant: [
    { id: "vp1", amount: 475, label: "475 VP", price: 4.99 },
    { id: "vp2", amount: 1000, label: "1 000 VP", price: 9.99, oldPrice: 11.99, bonus: "+50 VP бонус" },
    { id: "vp3", amount: 2050, label: "2 050 VP", price: 19.99, badge: "Выгодно", popular: true },
    { id: "vp4", amount: 4100, label: "4 100 VP", price: 34.99, oldPrice: 39.99, bonus: "+200 VP бонус" },
    { id: "vp5", amount: 8700, label: "8 700 VP", price: 69.99, bonus: "+700 VP бонус", badge: "Максимум" },
    { id: "vp6", amount: 11000, label: "11 000 VP", price: 79.99, oldPrice: 99.99, bonus: "+1000 VP бонус" },
  ],
  clashroyale: [
    { id: "gem1", amount: 80, label: "80 Gems", price: 0.99 },
    { id: "gem2", amount: 500, label: "500 Gems", price: 4.99 },
    { id: "gem3", amount: 1200, label: "1 200 Gems", price: 9.99, popular: true, badge: "Хит" },
    { id: "gem4", amount: 2500, label: "2 500 Gems", price: 19.99, oldPrice: 24.99, bonus: "+200 Gems бонус" },
    { id: "gem5", amount: 6500, label: "6 500 Gems", price: 49.99, badge: "Выгодно" },
    { id: "gem6", amount: 14000, label: "14 000 Gems", price: 99.99, oldPrice: 129.99, bonus: "+2000 Gems" },
  ],
  fortnite: [
    { id: "vb1", amount: 1000, label: "1 000 V-Bucks", price: 7.99 },
    { id: "vb2", amount: 2800, label: "2 800 V-Bucks", price: 19.99, popular: true, badge: "Популярно" },
    { id: "vb3", amount: 5000, label: "5 000 V-Bucks", price: 31.99, oldPrice: 39.99, bonus: "+300 V-Bucks" },
    { id: "vb4", amount: 7500, label: "7 500 V-Bucks", price: 47.99, badge: "Выгодно" },
    { id: "vb5", amount: 13500, label: "13 500 V-Bucks", price: 79.99, bonus: "+1500 V-Bucks", oldPrice: 99.99 },
    { id: "vb6", amount: 40000, label: "40 000 V-Bucks", price: 199.99, badge: "Максимум" },
  ],
  apex: [
    { id: "ac1", amount: 1000, label: "1 000 Coins", price: 9.99 },
    { id: "ac2", amount: 2150, label: "2 150 Coins", price: 19.99, popular: true, badge: "Хит" },
    { id: "ac3", amount: 4350, label: "4 350 Coins", price: 39.99, oldPrice: 49.99, bonus: "+150 Coins" },
    { id: "ac4", amount: 6700, label: "6 700 Coins", price: 59.99, badge: "Выгодно" },
    { id: "ac5", amount: 11500, label: "11 500 Coins", price: 99.99, bonus: "+500 Coins" },
    { id: "ac6", amount: 20000, label: "20 000 Coins", price: 159.99, oldPrice: 199.99, badge: "Максимум" },
  ],
};

interface ProductsProps {
  selectedGame: string | null;
  onAddToCart: () => void;
}

export const Products = forwardRef<HTMLElement, ProductsProps>(
  function Products({ selectedGame, onAddToCart }, ref) {
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

    const game = games.find((g) => g.id === selectedGame);
    const packages = selectedGame ? allPackages[selectedGame] : null;

    function handleAdd(id: string) {
      setAddedIds((prev) => new Set([...prev, id]));
      onAddToCart();
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
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
                        className="group relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
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
                            onClick={() => handleAdd(pkg.id)}
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
