import { motion } from "motion/react";
import { ShieldCheck, Sparkles, TimerReset } from "lucide-react";

const points = [
  {
    icon: Sparkles,
    title: "Фокус на удобстве",
    text: "Пользователь должен за несколько кликов выбрать игру, увидеть понятные пакеты и быстро оформить покупку без перегруженного интерфейса.",
    color: "#B47AFF",
  },
  {
    icon: TimerReset,
    title: "Быстрый сценарий покупки",
    text: "Основной акцент сделан на скорости: от выбора игры до перехода к конкретному товару и оформлению без лишних шагов.",
    color: "#FF8A8A",
  },
  {
    icon: ShieldCheck,
    title: "Прозрачная витрина",
    text: "Игра, цена, пакет и ожидаемый результат покупки подаются ясно, чтобы пользователь принимал решение без скрытых условий.",
    color: "#7ABAFF",
  },
];

export function AboutSection() {
  return (
    <section
      id="about-section"
      className="relative px-6 py-24"
      style={{ background: "#090912" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full opacity-[0.14]"
          style={{
            background: "radial-gradient(circle, rgba(180,122,255,0.32) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12 text-center"
        >
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-white/58"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "#FF8A8A", boxShadow: "0 0 10px #FF8A8A" }}
            />
            О проекте
          </div>
          <h2
            className="mx-auto max-w-3xl text-white"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.9rem, 4vw, 3.1rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Магазин построен вокруг быстрого и понятного пополнения игровых аккаунтов
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-white/48"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              lineHeight: 1.75,
            }}
          >
            EgorkaCoins задуман как витрина без визуального шума: пользователь быстро доходит до нужной игры,
            сравнивает пакеты и понимает, за что именно платит.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {points.map(({ icon: Icon, title, text, color }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="rounded-[28px] p-6"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 18px 60px rgba(0,0,0,0.24)",
              }}
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                }}
              >
                <Icon size={19} style={{ color }} />
              </div>
              <h3
                className="text-white"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.04rem",
                  letterSpacing: "-0.025em",
                }}
              >
                {title}
              </h3>
              <p
                className="mt-3 text-sm text-white/50"
                style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.75 }}
              >
                {text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
