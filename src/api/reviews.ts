import { apiRequest } from "./client";

export type ReviewApi = {
  id: number | string;
  name: string;
  game: string;
  gameColor?: string;
  text: string;
  stars: number;
  avatar?: string;
  createdAt?: string;
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
