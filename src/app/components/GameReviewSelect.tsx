import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import type { GameApi } from "../../api/games";

interface GameReviewSelectProps {
  games: GameApi[];
  value: string;
  onChange: (gameId: string) => void;
  label?: string;
}

export function GameReviewSelect({
  games,
  value,
  onChange,
  label = "Игра",
}: GameReviewSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedGame = games.find((game) => game.id === value) ?? games[0];
  const accent = selectedGame?.color ?? "#B47AFF";

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>
        {label}
      </span>

      <motion.button
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={games.length === 0}
        className="flex h-12 w-full items-center justify-between rounded-xl px-3 text-left outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: "rgba(8,8,14,0.74)",
          border: `1px solid ${open ? `${accent}55` : "rgba(255,255,255,0.09)"}`,
          boxShadow: open ? `0 0 22px ${accent}18` : "none",
        }}
        whileHover={games.length ? { background: "rgba(255,255,255,0.055)" } : undefined}
      >
        {selectedGame ? (
          <span className="flex min-w-0 items-center gap-3">
            <span
              className="h-8 w-8 flex-shrink-0 rounded-lg"
              style={{
                background: `${accent}18`,
                border: `1px solid ${accent}35`,
                boxShadow: `0 0 14px ${accent}18`,
              }}
            >
              <span className="flex h-full w-full items-center justify-center">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm text-white" style={{ fontWeight: 800 }}>
                {selectedGame.name}
              </span>
              <span className="block truncate text-xs text-white/32" style={{ fontWeight: 600 }}>
                {selectedGame.currency}
              </span>
            </span>
          </span>
        ) : (
          <span className="text-sm text-white/35" style={{ fontWeight: 700 }}>
            Игры загружаются
          </span>
        )}

        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={16} style={{ color: accent }} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl"
            style={{
              background: "rgba(12,12,20,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 22px 70px rgba(0,0,0,0.55)",
              backdropFilter: "blur(18px)",
            }}
          >
            {games.map((game) => {
              const selected = game.id === selectedGame?.id;
              return (
                <motion.button
                  key={game.id}
                  type="button"
                  onClick={() => {
                    onChange(game.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors"
                  style={{
                    background: selected ? `${game.color}12` : "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.035)",
                  }}
                  whileHover={{ background: `${game.color}14` }}
                >
                  <span
                    className="h-8 w-8 flex-shrink-0 rounded-lg"
                    style={{
                      background: `${game.color}18`,
                      border: `1px solid ${game.color}32`,
                    }}
                  >
                    <span className="flex h-full w-full items-center justify-center">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: game.color, boxShadow: `0 0 8px ${game.color}` }} />
                    </span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-white" style={{ fontWeight: 800 }}>
                      {game.name}
                    </span>
                    <span className="block truncate text-xs text-white/35" style={{ fontWeight: 600 }}>
                      {game.currency}
                    </span>
                  </span>

                  {selected && <Check size={15} style={{ color: game.color }} />}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
