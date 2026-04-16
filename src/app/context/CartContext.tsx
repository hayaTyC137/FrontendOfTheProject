import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { Package } from "../../data/packages";
import { getGameById, getPackageById } from "../../data/packages";
import { readCartLines, writeCartLines } from "../services/cartStorage.ts";

export type CartItem = {
  pkg: Package;
  quantity: number;
  gameName: string;
  gameColor: string;
  gameEmoji: string;
  gameIcon?: string | null;
};

type CartContextType = {
  items: CartItem[];
  addItem: (pkg: Package) => void;
  removeItem: (pkgId: string) => void;
  setQuantity: (pkgId: string, quantity: number) => void;
  updateQuantity: (pkgId: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

function toCartItem(pkg: Package): CartItem {
  const game = getGameById(pkg.gameId);
  return {
    pkg,
    quantity: 1,
    gameName: game?.name ?? pkg.gameId,
    gameColor: game?.color ?? "#B47AFF",
    gameEmoji: "🎮",
    gameIcon: game?.icon ?? null,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const restored = readCartLines()
      .map((line) => {
        const pkg = getPackageById(line.pkgId);
        if (!pkg) return null;
        return { ...toCartItem(pkg), quantity: line.quantity };
      })
      .filter((item): item is CartItem => !!item);

    setItems(restored);
  }, []);

  useEffect(() => {
    writeCartLines(
      items.map((item) => ({
        pkgId: item.pkg.id,
        quantity: item.quantity,
      })),
    );
  }, [items]);

  const addItem = useCallback((pkg: Package) => {
    setItems(prev => {
      const existing = prev.find(i => i.pkg.id === pkg.id);
      if (existing) {
        return prev.map(i =>
          i.pkg.id === pkg.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, toCartItem(pkg)];
    });
  }, []);

  const removeItem = useCallback((pkgId: string) => {
    setItems(prev => prev.filter(i => i.pkg.id !== pkgId));
  }, []);

  const setQuantity = useCallback((pkgId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.pkg.id !== pkgId);
      }
      return prev.map((i) => (i.pkg.id === pkgId ? { ...i, quantity } : i));
    });
  }, []);

  const updateQuantity = useCallback((pkgId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((i) => (i.pkg.id === pkgId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.pkg.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQuantity, updateQuantity, clearCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
