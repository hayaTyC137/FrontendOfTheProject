const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7023';

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const token = getToken();

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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