import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  Zap, Shield, Clock, ArrowRight, Package
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { renderGameMark } from "../utils/renderGameMark";
import { useAuth } from "../context/AuthContext";
import { createOrdersFromCart } from "../services/ordersStorage.ts";

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalCount } = useCart();
  const { user } = useAuth();

  const isEmpty = items.length === 0;

  function handleCheckout() {
    if (items.length === 0) return;

    if (!user) {
      navigate("/login");
      return;
    }

    createOrdersFromCart({
      userId: user.id,
      items,
      status: "pending",
    });
    clearCart();
    navigate("/dashboard");
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#08080E", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #B47AFF 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-08"
          style={{ background: "radial-gradient(circle, #FF8A8A 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Шапка */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white/70"
            style={{ color: "rgba(255,255,255,0.35)", fontWeight: 500 }}
          >
            <ArrowLeft size={16} />
            Продолжить покупки
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #B47AFF, #FF8A8A)" }}
              >
                <ShoppingCart size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl" style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
                  Корзина
                </h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {totalCount > 0 ? `${totalCount} ${declension(totalCount, ["товар", "товара", "товаров"])}` : "Пусто"}
                </p>
              </div>
            </div>

            {!isEmpty && (
              <motion.button
                onClick={clearCart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors"
                style={{
                  color: "rgba(255,138,138,0.7)",
                  background: "rgba(255,138,138,0.08)",
                  border: "1px solid rgba(255,138,138,0.15)",
                  fontWeight: 500,
                }}
                whileHover={{ background: "rgba(255,138,138,0.14)", color: "#FF8A8A" }}
                whileTap={{ scale: 0.97 }}
              >
                <Trash2 size={14} />
                Очистить
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Пустая корзина */}
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-28 gap-6"
            >
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Package size={36} style={{ color: "rgba(255,255,255,0.2)" }} />
              </div>
              <div className="text-center">
                <p className="text-white text-lg mb-2" style={{ fontWeight: 600 }}>
                  Корзина пуста
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Добавьте игровую валюту из каталога
                </p>
              </div>
              <motion.button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm"
                style={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
                  boxShadow: "0 0 24px rgba(180,122,255,0.3)",
                }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(180,122,255,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                Перейти в каталог
                <ArrowRight size={15} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="filled"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Список товаров */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                <AnimatePresence>
                  {items.map((item, i) => (
                    <motion.div
                      key={item.pkg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl p-5 flex items-center gap-4"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${item.gameColor}20`,
                      }}
                    >
                      {/* Иконка игры */}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl overflow-hidden"
                        style={{
                          background: `${item.gameColor}18`,
                          border: `1px solid ${item.gameColor}30`,
                          boxShadow: `0 0 20px ${item.gameColor}20`,
                        }}
                      >
                        {item.gameIcon
                          ? renderGameMark({ icon: item.gameIcon, name: item.gameName, className: "w-10 h-10 object-contain" })
                          : item.gameEmoji
                        }
                      </div>

                      {/* Инфо о товаре */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: `${item.gameColor}18`,
                              color: item.gameColor,
                              border: `1px solid ${item.gameColor}30`,
                              fontWeight: 600,
                            }}
                          >
                            {item.gameName}
                          </span>
                          {item.pkg.badge && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: "linear-gradient(135deg, #B47AFF40, #FF8A8A40)",
                                color: "rgba(255,255,255,0.7)",
                                fontWeight: 600,
                              }}
                            >
                              {item.pkg.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-white font-bold text-base" style={{ letterSpacing: "-0.01em" }}>
                          {item.pkg.label}
                        </p>
                        {item.pkg.bonus && (
                          <p className="text-xs mt-0.5" style={{ color: "#7AFF9B", fontWeight: 500 }}>
                            🎁 {item.pkg.bonus}
                          </p>
                        )}
                      </div>

                      {/* Цена */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-bold text-lg" style={{ letterSpacing: "-0.02em" }}>
                          ${(item.pkg.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                            ${item.pkg.price} × {item.quantity}
                          </p>
                        )}
                      </div>

                      {/* Количество */}
                      <div
                        className="flex items-center gap-1 rounded-xl p-1"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <motion.button
                          onClick={() => updateQuantity(item.pkg.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors"
                          whileHover={{ background: "rgba(255,255,255,0.08)" }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus size={12} />
                        </motion.button>
                        <span
                          className="w-6 text-center text-sm text-white"
                          style={{ fontWeight: 700 }}
                        >
                          {item.quantity}
                        </span>
                        <motion.button
                          onClick={() => updateQuantity(item.pkg.id, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors"
                          whileHover={{ background: "rgba(255,255,255,0.08)" }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus size={12} />
                        </motion.button>
                      </div>

                      {/* Удалить */}
                      <motion.button
                        onClick={() => removeItem(item.pkg.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ color: "rgba(255,138,138,0.5)" }}
                        whileHover={{ background: "rgba(255,138,138,0.1)", color: "#FF8A8A" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Итого — правая колонка */}
              <div className="flex flex-col gap-4">
                {/* Сводка */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl p-6 flex flex-col gap-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <h3 className="text-white font-bold text-base" style={{ letterSpacing: "-0.01em" }}>
                    Итого
                  </h3>

                  {/* Позиции */}
                  <div className="flex flex-col gap-2">
                    {items.map(item => (
                      <div key={item.pkg.id} className="flex items-center justify-between gap-2">
                        <span className="text-sm truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
                          {item.pkg.label} × {item.quantity}
                        </span>
                        <span className="text-sm text-white flex-shrink-0" style={{ fontWeight: 600 }}>
                          ${(item.pkg.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

                  {/* Итоговая сумма */}
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">К оплате</span>
                    <span
                      className="text-2xl text-white"
                      style={{ fontWeight: 800, letterSpacing: "-0.03em" }}
                    >
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Кнопка оплаты */}
                  <motion.button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-xl text-white text-sm"
                    style={{
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
                      boxShadow: "0 0 28px rgba(180,122,255,0.35)",
                    }}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(180,122,255,0.55)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    Оформить заказ
                  </motion.button>

                  <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Безопасная оплата · Мгновенная доставка
                  </p>
                </motion.div>

                {/* Гарантии */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-2xl p-4 flex flex-col gap-2"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {[
                    { icon: Zap,    label: "Мгновенная доставка", color: "#B47AFF" },
                    { icon: Shield, label: "100% безопасно",      color: "#7ABAFF" },
                    { icon: Clock,  label: "Поддержка 24/7",      color: "#FFB07A" },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon size={13} style={{ color }} />
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function declension(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100;
  const mod = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (mod > 1 && mod < 5) return forms[1];
  if (mod === 1) return forms[0];
  return forms[2];
}
