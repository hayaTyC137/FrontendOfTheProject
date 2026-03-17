import { motion } from "motion/react";
import { Zap, Heart } from "lucide-react";
import { RiTelegram2Line, RiVkLine, RiDiscordLine } from "react-icons/ri";

const links = {
  Услуги: ["Valorant Points", "Gems CR", "V-Bucks", "Apex Coins"],
  Компания: ["О нас", "FAQ", "Блог", "Вакансии"],
  Поддержка: ["Контакты", "Гарантии", "Возврат", "Telegram"],
};

const socialLinks = [
  { id: "tg", href: "https://t.me/your_channel", label: "Telegram", icon: RiTelegram2Line },
  { id: "vk", href: "https://vk.com/your_page", label: "VK", icon: RiVkLine },
  { id: "ds", href: "https://discord.gg/your_invite", label: "Discord", icon: RiDiscordLine },
];

export function Footer() {
  return (
    <footer
      className="relative pt-16 pb-8 px-6"
      style={{
        background: "#06060C",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #FF8A8A 0%, #B47AFF 100%)",
                  boxShadow: "0 0 16px rgba(180, 122, 255, 0.3)",
                }}
              >
                <Zap size={16} className="text-white" />
              </div>
              <span
                className="text-white"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  letterSpacing: "-0.02em",
                }}
              >
                EgorkaCoins
              </span>
            </div>
            <p
              className="text-white/35 text-sm leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Быстрая и безопасная покупка игровой валюты. Работаем с 2021 года.
            </p>
            
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ id, href, label, icon: Icon }) => (
                <motion.a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg text-white/40 hover:text-white text-sm flex items-center justify-center transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  whileHover={{
                  scale: 1.08,
                  background: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(180, 122, 255, 0.5)",
                  boxShadow: "0 0 0 1px rgba(180,122,255,0.25), 0 0 14px rgba(180,122,255,0.35), 0 0 28px rgba(255,138,138,0.22)",
                  }}
                  whileTap={{ scale: 0.92 }}
                  transition={{type: "spring", stiffness: 380, damping: 22}}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>

          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4
                className="text-white mb-4 text-sm"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="text-white/35 hover:text-white/75 text-sm transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-white/25 text-xs flex items-center gap-1.5"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            © 2025 GameVault. Сделано с{" "}
            <Heart size={11} style={{ color: "#FF8A8A" }} fill="#FF8A8A" /> на Телецентре
          </p>
          <div className="flex items-center gap-4 text-white/25 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            <a href="#" className="hover:text-white/50 transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white/50 transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
