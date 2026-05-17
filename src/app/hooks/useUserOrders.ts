import { useEffect, useState } from "react";
import { fetchMyOrders, type OrderApi } from "../../api/orders";

export type OrderRecord = {
  id: string;
  userId: string;
  game: string;
  gameColor: string;
  item: string;
  amount: string;
  price: number;
  status: "completed" | "pending" | "failed";
  createdAt: string;
};

function mapApiToRecord(order: OrderApi): OrderRecord {
  return {
    id: String(order.id),
    userId: String(order.userId),
    game: order.gameName,
    gameColor: order.gameColor,
    item: order.item,
    amount: order.amount,
    price: order.price,
    status: order.status as "completed" | "pending" | "failed",
    createdAt: order.createdAt,
  };
}

export function useUserOrders(userId: string | null | undefined) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }

    fetchMyOrders().then(apiOrders => {
      setOrders(apiOrders.map(mapApiToRecord));
    });
  }, [userId]);

  const totalSpent = Number(
    orders.reduce((sum, o) => sum + o.price, 0).toFixed(2)
  );

  return {
    orders,
    totalSpent,
    ordersCount: orders.length,
  };
}