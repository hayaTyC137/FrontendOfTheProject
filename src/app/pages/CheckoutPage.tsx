import { useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  Bitcoin,
  Home,
  CreditCard,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { createPayment, type PaymentMethod } from "../../api/payments";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { renderGameMark } from "../utils/renderGameMark";

const fieldStyle = {
  background: "rgba(255,255,255,0.045)",
  border: "1px solid rgba(255,255,255,0.09)",
  fontFamily: "Inter, sans-serif",
} as const;

const cryptoCurrencies = ["USDT", "BTC", "ETH", "TON", "BNB"];
const cryptoNetworks = ["TRC20", "ERC20", "BEP20", "TON", "Bitcoin", "Ethereum"];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardholder, setCardholder] = useState(user?.username ?? "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("USDT");
  const [cryptoNetwork, setCryptoNetwork] = useState("TRC20");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const payloadItems = useMemo(
    () => items.map((item) => ({ packageId: item.pkg.id, quantity: item.quantity })),
    [items],
  );

  async function handlePay() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await createPayment({
      method,
      items: payloadItems,
      card: method === "card"
        ? { cardholder, number: cardNumber, expiry, cvc }
        : undefined,
      crypto: method === "crypto"
        ? { currency: cryptoCurrency, network: cryptoNetwork, txHash }
        : undefined,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Не удалось провести оплату");
      return;
    }

    await refreshUser();
    clearCart();
    navigate("/dashboard");
  }

  if (items.length === 0) {
    return (
      <CheckoutShell>
        <div className="mx-auto max-w-xl py-28 text-center">
          <Wallet size={38} className="mx-auto mb-4 text-white/25" />
          <h1 className="text-white text-2xl" style={{ fontWeight: 800 }}>Корзина пуста</h1>
          <p className="mt-2 text-white/40 text-sm">Добавьте товары перед оплатой.</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl px-5 py-3 text-sm text-white"
            style={{ background: "linear-gradient(135deg, #B47AFF, #FF8A8A)", fontWeight: 700 }}
          >
            Вернуться в каталог
          </button>
        </div>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="mb-8 flex items-center gap-2 text-sm text-white/38 transition-colors hover:text-white/70"
          style={{ fontWeight: 600 }}
        >
          <ArrowLeft size={16} />
          Вернуться в корзину
        </button>

        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-white text-3xl" style={{ fontWeight: 800 }}>
            Оплата заказа
          </h1>
          <p className="text-white/42 text-sm">
            Выберите способ оплаты и подтвердите покупку. Заказы появятся в кабинете после успешной оплаты.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <PaymentMethodButton
                active={method === "card"}
                icon={CreditCard}
                title="Банковская карта"
                text="Оплата картой в тестовом режиме"
                onClick={() => setMethod("card")}
              />
              <PaymentMethodButton
                active={method === "crypto"}
                icon={Bitcoin}
                title="Crypto"
                text="Подтверждение по tx hash"
                onClick={() => setMethod("crypto")}
              />
            </div>

            <motion.div
              key={method}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {method === "card" ? (
                <div className="grid gap-4">
                  <TextField label="Имя держателя" value={cardholder} onChange={setCardholder} placeholder="IVAN IVANOV" />
                  <TextField
                    label="Номер карты"
                    value={cardNumber}
                    onChange={(value) => setCardNumber(formatCardNumber(value))}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      label="Срок"
                      value={expiry}
                      onChange={(value) => setExpiry(formatExpiry(value))}
                      placeholder="12/28"
                      inputMode="numeric"
                    />
                    <TextField
                      label="CVC"
                      value={cvc}
                      onChange={(value) => setCvc(onlyDigits(value).slice(0, 4))}
                      placeholder="123"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <OptionPicker
                    label="Валюта"
                    value={cryptoCurrency}
                    options={cryptoCurrencies}
                    onChange={setCryptoCurrency}
                  />
                  <OptionPicker
                    label="Сеть"
                    value={cryptoNetwork}
                    options={cryptoNetworks}
                    onChange={setCryptoNetwork}
                  />
                  <TextField label="Tx hash" value={txHash} onChange={setTxHash} placeholder="0x..." />
                  <div className="rounded-xl p-4 text-sm text-white/48" style={{ background: "rgba(180,122,255,0.08)", border: "1px solid rgba(180,122,255,0.18)" }}>
                    Тестовый адрес: <span className="text-white/75">TQ8qdemoEgorkaCoinsPaymentAddress</span>
                  </div>
                </div>
              )}
            </motion.div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm text-red-200" style={{ background: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.16)" }}>
                {error}
              </div>
            )}
          </section>

          <aside className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-white text-base" style={{ fontWeight: 800 }}>Состав заказа</h2>
            <div className="mt-5 flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.pkg.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl" style={{ background: `${item.gameColor}18`, border: `1px solid ${item.gameColor}30` }}>
                    {item.gameIcon ? renderGameMark({ icon: item.gameIcon, name: item.gameName, className: "w-8 h-8 object-contain" }) : item.gameEmoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-white text-sm" style={{ fontWeight: 700 }}>{item.pkg.label}</p>
                    <p className="text-xs text-white/35">{item.gameName} x {item.quantity}</p>
                  </div>
                  <span className="text-white text-sm" style={{ fontWeight: 800 }}>
                    ${(item.pkg.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">К оплате</span>
              <span className="text-white text-3xl" style={{ fontWeight: 800 }}>${totalPrice.toFixed(2)}</span>
            </div>

            <motion.button
              type="button"
              onClick={handlePay}
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)", fontWeight: 800 }}
              whileHover={submitting ? undefined : { scale: 1.02 }}
              whileTap={submitting ? undefined : { scale: 0.97 }}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <LockKeyhole size={16} />}
              {submitting ? "Проводим оплату..." : "Оплатить заказ"}
            </motion.button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm text-white/62 transition-colors hover:text-white"
              style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 700 }}
            >
              <Home size={15} />
              На главную
            </button>

            <div className="mt-4 grid gap-2 text-xs text-white/38">
              <div className="flex items-center gap-2"><ShieldCheck size={13} style={{ color: "#7ABAFF" }} /> Сумма проверяется на сервере</div>
              <div className="flex items-center gap-2"><BadgeCheck size={13} style={{ color: "#B47AFF" }} /> Заказ создается после оплаты</div>
            </div>
          </aside>
        </div>
      </div>
    </CheckoutShell>
  );
}

function CheckoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#08080E", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[560px] w-[760px] -translate-x-1/2 rounded-full opacity-[0.14]" style={{ background: "radial-gradient(circle, #B47AFF 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full opacity-[0.1]" style={{ background: "radial-gradient(circle, #FF8A8A 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function PaymentMethodButton({
  active,
  icon: Icon,
  title,
  text,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl p-5 text-left transition-colors"
      style={{
        background: active ? "rgba(180,122,255,0.13)" : "rgba(255,255,255,0.035)",
        border: active ? "1px solid rgba(180,122,255,0.36)" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Icon size={20} style={{ color: active ? "#B47AFF" : "rgba(255,255,255,0.45)" }} />
      <p className="mt-3 text-white text-sm" style={{ fontWeight: 800 }}>{title}</p>
      <p className="mt-1 text-xs text-white/40">{text}</p>
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "search" | "email" | "url";
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-white/40" style={{ fontWeight: 700 }}>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="rounded-xl px-3 py-3 text-sm text-white outline-none placeholder:text-white/22"
        style={fieldStyle}
      />
    </label>
  );
}

function OptionPicker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-white/40" style={{ fontWeight: 700 }}>{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className="rounded-xl px-3 py-2 text-xs transition-colors"
              style={{
                background: active ? "rgba(180,122,255,0.16)" : "rgba(255,255,255,0.045)",
                border: active ? "1px solid rgba(180,122,255,0.42)" : "1px solid rgba(255,255,255,0.09)",
                color: active ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                fontWeight: 800,
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string) {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
