// src/app/utils/renderGameMark.tsx
import type { ReactNode } from "react";

type GameMarkProps = {
  icon?: string | null;
  name: string;
  emoji?: string;
  className?: string;
};

export function renderGameMark({ icon, name, emoji = "🎮", className = "" }: GameMarkProps): ReactNode {
  if (icon) {
    return <img src={icon} alt={name} className={`${className} object-contain block`} />;
  }

  return <span className={className}>{emoji}</span>;
}