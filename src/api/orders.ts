import { apiRequest } from './client';

export interface OrderApi {
  id: number;
  userId: number;
  gameName: string;
  gameColor: string;
  item: string;
  amount: string;
  price: number;
  status: string;
  createdAt: string;
}

export interface CreateOrderItem {
  gameName: string;
  gameColor: string;
  item: string;
  amount: string;
  price: number;
}

export async function fetchMyOrders(): Promise<OrderApi[]> {
  const res = await apiRequest<OrderApi[]>('/api/orders');
  return res.data ?? [];
}

export async function createOrders(
  items: CreateOrderItem[]
): Promise<{ ok: boolean; error?: string }> {
  const res = await apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(items),
  });
  return res;
}