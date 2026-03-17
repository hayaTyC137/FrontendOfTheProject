import { useState, forwardRef } from "react";
import { motion } from "motion/react";

export const games = [
  {
    id: "valorant",
    name: "Valorant",
    currency: "Valorant Points",
    abbr: "VP",
    color: "#FF8A8A",
    colorDim: "rgba(255,138,138,0.12)",
    colorGlow: "rgba(255,138,138,0.25)",
    emoji: "⚡",
    description: "Боевые пасы, скины, агенты",
    tag: "Популярно",
  },
  {
    id: "clashroyale",
    name: "Clash Royale",
    currency: "Gems",
    abbr: "GEM",
    color: "#7ABAFF",
    colorDim: "rgba(122,186,255,0.12)",
    colorGlow: "rgba(122,186,255,0.25)",
    emoji: "💎",
    description: "Карточки, сундуки, пасы",
    tag: "Топ продаж",
  },
  {
    id: "fortnite",
    name: "Fortnite",
    currency: "V-Bucks",
    abbr: "VB",
    color: "#B47AFF",
    colorDim: "rgba(180,122,255,0.12)",
    colorGlow: "rgba(180,122,255,0.25)",
    emoji: "🎮",
    description: "Скины, эмоции, боевой пропуск",
    tag: "Хит",
  },
  {
    id: "apex",
    name: "Apex Legends",
    currency: "Apex Coins",
    abbr: "AC",
    color: "#FFB07A",
    colorDim: "rgba(255,176,122,0.12)",
    colorGlow: "rgba(255,176,122,0.25)",
    emoji: "🔥",
    description: "Скины, боевые пасы, бандлы",
    tag: "Новинки",
  },
];

interface GameSelectorProps {
  selectedGame: string | null;
  onSelect: (gameId: string) => void;
}

export const GameSelector = forwardRef<HTMLElement, GameSelectorProps>(
  function GameSelector({ selectedGame, onSelect }, ref) {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="relative py-24 px-6"
        style={{ background: "#08080E" }}
      >
        {/* Section glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(180,122,255,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs text-white/50"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
              }}
            >
              🎮 Выбери свою игру
            </div>
            <h2
              className="text-white mb-3"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
              }}
            >
              Для каких игр мы работаем?
            </h2>
            <p
              className="text-white/40 max-w-md mx-auto"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", lineHeight: 1.65 }}
            >
              Кликни на карточку игры, чтобы увидеть доступные пакеты валюты
            </p>
          </motion.div>

          {/* Game cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {games.map((game, i) => {
              const isActive = selectedGame === game.id;
              const isHovered = hovered === game.id;

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onMouseEnter={() => setHovered(game.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelect(game.id)}
                  className="relative cursor-pointer rounded-2xl p-6 flex flex-col gap-4 overflow-hidden transition-all"
                  style={{
                    background: isActive
                      ? game.colorDim
                      : isHovered
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.025)",
                    border: `1px solid ${
                      isActive
                        ? `${game.color}50`
                        : isHovered
                        ? `${game.color}25`
                        : "rgba(255,255,255,0.07)"
                    }`,
                    boxShadow: isActive
                      ? `0 0 30px ${game.colorGlow}, 0 0 60px ${game.colorGlow}`
                      : isHovered
                      ? `0 0 20px ${game.colorGlow}`
                      : "none",
                    transform: isHovered || isActive ? "translateY(-4px) scale(1.02)" : "none",
                    transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {/* Glow orb */}
                  {(isHovered || isActive) && (
                    <div
                      className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${game.color}30 0%, transparent 70%)`,
                        filter: "blur(12px)",
                      }}
                    />
                  )}

                  {/* Tag */}
                  <div className="flex items-start justify-between">
                    <span
                      className="text-2xl"
                      style={{ filter: `drop-shadow(0 0 8px ${game.color}60)` }}
                    >
                      {game.emoji}
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px]"
                      style={{
                        background: `${game.color}18`,
                        color: game.color,
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        border: `1px solid ${game.color}30`,
                      }}
                    >
                      {game.tag}
                    </span>
                  </div>

                  {/* Game name */}
                  <div>
                    <h3
                      className="text-white mb-1"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      {game.name}
                    </h3>
                    <p
                      className="text-white/40 text-xs"
                      style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}
                    >
                      {game.description}
                    </p>
                  </div>

                  {/* Currency label */}
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: game.color,
                        boxShadow: `0 0 6px ${game.color}`,
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        color: game.color,
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        opacity: 0.85,
                      }}
                    >
                      {game.currency}
                    </span>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto text-[10px] text-white/50 flex items-center gap-1"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Выбрано ✓
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
);
