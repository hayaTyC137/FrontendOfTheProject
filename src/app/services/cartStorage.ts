export type StoredCartLine = {
  pkgId: string;
  quantity: number;
};

const CART_STORAGE_KEY = "egorkacoins-cart-lines";

function isValidLine(value: unknown): value is StoredCartLine {
  if (!value || typeof value !== "object") return false;

  const line = value as Partial<StoredCartLine>;
  return (
    typeof line.pkgId === "string" &&
    line.pkgId.length > 0 &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  );
}

export function readCartLines(): StoredCartLine[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidLine);
  } catch {
    return [];
  }
}

export function writeCartLines(lines: StoredCartLine[]) {
  if (typeof window === "undefined") return;

  if (lines.length === 0) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}
