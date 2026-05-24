const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7023';

function isFormDataBody(body: BodyInit | null | undefined): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function buildApiUrl(path: string) {
  if (!path) return BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!isFormDataBody(options?.body)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(buildApiUrl(endpoint), {
      headers,
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
