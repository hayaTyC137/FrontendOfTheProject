import { motion } from "motion/react";

const stats = [
  { value: "150K+", label: "Довольных клиентов", color: "#FF8A8A" },
  { value: "4", label: "Игры в каталоге", color: "#7ABAFF" },
  { value: "1–5 мин", label: "Время доставки", color: "#B47AFF" },
  { value: "99.9%", label: "Успешных операций", color: "#FFB07A" },
];

export function Stats() {
  return (
    <section
      className="relative py-20 px-6"
      style={{
        background: "linear-gradient(180deg, #0C0C16 0%, #08080E 100%)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <motion.div
                className="text-4xl mb-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: stat.color,
                  textShadow: `0 0 30px ${stat.color}50`,
                }}
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <div
                className="text-white/40 text-sm"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
