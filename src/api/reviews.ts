import { apiRequest } from "./client";

export type ReviewApi = {
  id: number | string;
  userId?: number | null;
  name: string;
  game: string;
  gameColor?: string;
  text: string;
  stars: number;
  avatar?: string;
  createdAt?: string;
};

export type CreateReviewPayload = {
  game: string;
  gameColor: string;
  text: string;
  stars: number;
};

export type FetchReviewsResult =
  | { ok: true; data: ReviewApi[] }
  | { ok: false; error: string };

export async function fetchReviews(): Promise<FetchReviewsResult> {
  const res = await apiRequest<ReviewApi[]>("/api/reviews");

  if (!res.ok) {
    return { ok: false, error: res.error ?? "Отзывы временно недоступны" };
  }

  if (!Array.isArray(res.data)) {
    return { ok: false, error: "Некорректный ответ сервера" };
  }

  return { ok: true, data: res.data };
}

export async function fetchMyReviews(): Promise<FetchReviewsResult> {
  const res = await apiRequest<ReviewApi[]>("/api/reviews/my");

  if (!res.ok) {
    return { ok: false, error: res.error ?? "Отзывы временно недоступны" };
  }

  if (!Array.isArray(res.data)) {
    return { ok: false, error: "Некорректный ответ сервера" };
  }

  return { ok: true, data: res.data };
}

export async function createReview(
  payload: CreateReviewPayload
): Promise<{ ok: true; data: ReviewApi } | { ok: false; error: string }> {
  const res = await apiRequest<ReviewApi>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.data) {
    return { ok: false, error: res.error ?? "Не удалось отправить отзыв" };
  }

  return { ok: true, data: res.data };
}

export async function updateReview(
  id: number | string,
  payload: CreateReviewPayload
): Promise<{ ok: true; data: ReviewApi } | { ok: false; error: string }> {
  const res = await apiRequest<ReviewApi>(`/api/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.data) {
    return { ok: false, error: res.error ?? "Не удалось сохранить отзыв" };
  }

  return { ok: true, data: res.data };
}

export async function deleteMyReview(
  id: number | string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await apiRequest(`/api/reviews/my/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return { ok: false, error: res.error ?? "Не удалось удалить отзыв" };
  }

  return { ok: true };
}

export async function deleteReview(
  id: number | string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await apiRequest(`/api/reviews/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return { ok: false, error: res.error ?? "Не удалось удалить отзыв" };
  }

  return { ok: true };
}
