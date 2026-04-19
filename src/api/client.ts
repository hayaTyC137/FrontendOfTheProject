const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7023';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // важно для cookie сессии
      ...options,
    });

    if (res.status === 204) return { ok: true };

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data.message ?? 'Ошибка сервера' };
    }

    return { ok: true, data };
  } catch {
    return { ok: false, error: 'Сервер недоступен' };
  }
}