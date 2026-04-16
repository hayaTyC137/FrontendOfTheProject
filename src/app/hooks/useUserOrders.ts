import { useEffect, useMemo, useState } from "react";
import {
  readOrdersByUser,
  subscribeOrdersUpdated,
  type OrderRecord,
} from "../services/ordersStorage.ts";

export function useUserOrders(userId: string | null | undefined) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }

    const sync = () => setOrders(readOrdersByUser(userId));
    sync();

    return subscribeOrdersUpdated(sync);
  }, [userId]);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + order.price, 0);
    return {
      totalSpent: Number(totalSpent.toFixed(2)),
      ordersCount: orders.length,
    };
  }, [orders]);

  return {
    orders,
    ...stats,
  };
}
