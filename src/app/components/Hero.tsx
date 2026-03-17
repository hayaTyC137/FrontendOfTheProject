import { motion } from "motion/react";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";

interface HeroProps {
  onCTA: () => void;
}

const features = [
  { icon: Zap, label: "Мгновенная доставка", color: "#B47AFF" },
  { icon: Shield, label: "100% безопасно", color: "#7ABAFF" },
  { icon: Clock, label: "Поддержка 24/7", color: "#FFB07A" },
];

export function Hero({ onCTA }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pb-5 overflow-hidden"
      style={{ background: "#08080E" }}
    >
      {/* Background glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #B47AFF 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #FF8A8A 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #7ABAFF 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 px-4 py-1.5 rounded-full text-xs text-white/60 flex items-center gap-2"
        style={{
          border: "1px solid rgba(180,122,255,0.25)",
          background: "rgba(180,122,255,0.07)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "#B47AFF", boxShadow: "0 0 6px #B47AFF" }}
        />
        Премиальный игровой магазин
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 max-w-3xl mb-6"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(2.2rem, 6vw, 4.2rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "#FFFFFF",
        }}
      >
        Покупка игровой{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #FF8A8A 0%, #B47AFF 50%, #7ABAFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          валюты
        </span>{" "}
        быстро и безопасно
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 max-w-xl mb-10 text-white/50"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "1.05rem",
          lineHeight: 1.7,
        }}
      >
        Пополняй баланс для Valorant, Clash Royale, Fortnite и Apex Legends
        — мгновенно, по выгодным ценам.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 flex flex-wrap gap-4 items-center justify-center"
      >
        <motion.button
          onClick={onCTA}
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
            boxShadow: "0 0 30px rgba(180,122,255,0.35), 0 4px 20px rgba(0,0,0,0.3)",
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 40px rgba(180,122,255,0.5), 0 4px 24px rgba(0,0,0,0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Выбрать игру
          <ArrowRight size={16} />
        </motion.button>

        <motion.button
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white/70 text-sm hover:text-white transition-colors"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          whileHover={{ scale: 1.03, background: "rgba(255,255,255,0.08)" }}
          whileTap={{ scale: 0.97 }}
        >
          Узнать больше
        </motion.button>
      </motion.div>

      {/* Feature badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="relative z-10 flex flex-wrap gap-4 mt-14 items-center justify-center pb-20"
      >
        {features.map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Icon size={15} style={{ color }} />
            <span
              className="text-white/60 text-xs"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/25 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
          Прокрутите вниз
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
