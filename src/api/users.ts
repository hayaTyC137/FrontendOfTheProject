import { apiRequest } from "./client";
import type { AuthUser } from "../app/context/AuthContext";

export type UpdateMyProfilePayload = {
  username: string;
  notifyOrders: boolean;
  notifyPromo: boolean;
  notifySecurity: boolean;
};

export type ChangeMyPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export async function updateMyProfile(
  payload: UpdateMyProfilePayload,
): Promise<{ ok: true; data: AuthUser } | { ok: false; error: string }> {
  const res = await apiRequest<AuthUser>("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.data) {
    return { ok: false, error: res.error ?? "Не удалось сохранить профиль" };
  }

  return { ok: true, data: res.data };
}

export async function changeMyPassword(
  payload: ChangeMyPasswordPayload,
): Promise<{ ok: true; message?: string } | { ok: false; error: string }> {
  const res = await apiRequest<{ message?: string }>("/api/users/me/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { ok: false, error: res.error ?? "Не удалось обновить пароль" };
  }

  return { ok: true, message: res.data?.message };
}

export async function uploadMyAvatar(
  file: File,
): Promise<{ ok: true; data: AuthUser } | { ok: false; error: string }> {
  const body = new FormData();
  body.append("avatar", file);

  const res = await apiRequest<AuthUser>("/api/users/me/avatar", {
    method: "POST",
    body,
  });

  if (!res.ok || !res.data) {
    return { ok: false, error: res.error ?? "Не удалось загрузить аватар" };
  }

  return { ok: true, data: res.data };
}
