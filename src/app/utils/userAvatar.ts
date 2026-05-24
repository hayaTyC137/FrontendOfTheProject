import { buildApiUrl } from "../../api/client";

export function getUserInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "EC";

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return name.trim().slice(0, 2).toUpperCase() || "EC";
}

export function resolveUserAvatar(avatar?: string | null) {
  const value = avatar?.trim();
  if (!value) return null;

  if (value.startsWith("/") || /^https?:\/\//i.test(value)) {
    return buildApiUrl(value);
  }

  return null;
}
