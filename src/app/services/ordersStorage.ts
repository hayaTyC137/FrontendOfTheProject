import type { CartItem } from "../context/CartContext";
import { getGameById } from "../../data/packages";

export type OrderStatus = "completed" | "pending" | "failed";

export type OrderRecord = {
  id: string;
  userId: string;
  game: string;
  gameColor: string;
  item: string;
  amount: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
};

const ORDERS_STORAGE_KEY = "egorkacoins-orders";
const ORDERS_UPDATED_EVENT = "egorkacoins-orders-updated";

function safeParseOrders(raw: string | null): OrderRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is OrderRecord => {
      if (!value || typeof value !== "object") return false;
      const order = value as Partial<OrderRecord>;
      return (
        typeof order.id === "string" &&
        typeof order.userId === "string" &&
        typeof order.game === "string" &&
        typeof order.gameColor === "string" &&
        typeof order.item === "string" &&
        typeof order.amount === "string" &&
        typeof order.price === "number" &&
        (order.status === "completed" || order.status === "pending" || order.status === "failed") &&
        typeof order.createdAt === "string"
      );
    });
  } catch {
    return [];
  }
}

export function readAllOrders(): OrderRecord[] {
  if (typeof window === "undefined") return [];
  return safeParseOrders(window.localStorage.getItem(ORDERS_STORAGE_KEY));
}

export function readOrdersByUser(userId: string): OrderRecord[] {
  return readAllOrders()
    .filter((order) => order.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function writeOrders(orders: OrderRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent(ORDERS_UPDATED_EVENT));
}

function shortDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function randomOrderId() {
  return `#ORD-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export function createOrdersFromCart(params: { userId: string; items: CartItem[]; status?: OrderStatus }) {
  const { userId, items, status = "pending" } = params;
  if (items.length === 0) return [] as OrderRecord[];

  const now = new Date();

  const nextOrders: OrderRecord[] = items.map((item) => {
    const game = getGameById(item.pkg.gameId);

    return {
      id: randomOrderId(),
      userId,
      game: game?.name ?? item.gameName,
      gameColor: game?.color ?? item.gameColor,
      item: item.pkg.label,
      amount: `${item.pkg.amount} ${game?.abbr ?? ""}`.trim(),
      price: Number((item.pkg.price * item.quantity).toFixed(2)),
      status,
      createdAt: now.toISOString(),
    };
  });

  const existing = readAllOrders();
  writeOrders([...nextOrders, ...existing]);
  return nextOrders;
}

export function subscribeOrdersUpdated(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleCustomUpdate = () => listener();
  const handleStorageUpdate = (event: StorageEvent) => {
    if (event.key === ORDERS_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener(ORDERS_UPDATED_EVENT, handleCustomUpdate);
  window.addEventListener("storage", handleStorageUpdate);

  return () => {
    window.removeEventListener(ORDERS_UPDATED_EVENT, handleCustomUpdate);
    window.removeEventListener("storage", handleStorageUpdate);
  };
}
