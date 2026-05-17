import { apiRequest } from './client';

export interface AdminStats {
  totalUsers: number;
  ordersToday: number;
  totalRevenue: number;
  openReports: number;
}

export interface UserAdmin {
  id: number;
  username: string;
  email: string;
  role: string;
  ordersCount: number;
  totalSpent: number;
  isBanned: boolean;
}

export async function fetchAdminStats(): Promise<AdminStats | null> {
  const res = await apiRequest<AdminStats>('/api/admin/stats');
  return res.data ?? null;
}

export async function fetchAllUsers(): Promise<UserAdmin[]> {
  const res = await apiRequest<UserAdmin[]>('/api/users');
  return res.data ?? [];
}

export async function banUser(id: number, isBanned: boolean) {
  return apiRequest(`/api/users/${id}/ban`, {
    method: 'PUT',
    body: JSON.stringify({ isBanned }),
  });
}

export async function deleteUser(id: number) {
  return apiRequest(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

export async function setUserRole(id: number, role: string) {
  return apiRequest(`/api/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
}