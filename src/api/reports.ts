import { apiRequest } from "./client";

export type ReportStatus = "open" | "in_review" | "resolved" | "rejected";

export type ReportApi = {
  id: number;
  reportedUserId: number;
  reportedUsername: string;
  reporterUserId: number;
  reporterUsername: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  statusChangedAt?: string | null;
  resolvedAt?: string | null;
  moderatorComment: string;
  reviewedByUserId?: number | null;
  reviewedByUsername: string;
};

export type CreateReportPayload = {
  reportedUserId: number;
  reason: string;
};

export type UpdateReportStatusPayload = {
  status: Exclude<ReportStatus, "open">;
  moderatorComment?: string;
};

export async function fetchReports(): Promise<{ ok: true; data: ReportApi[] } | { ok: false; error: string }> {
  const res = await apiRequest<ReportApi[]>("/api/reports");

  if (!res.ok || !Array.isArray(res.data)) {
    return { ok: false, error: res.error ?? "Не удалось загрузить жалобы" };
  }

  return { ok: true, data: res.data };
}

export async function fetchOpenReports(): Promise<{ ok: true; data: ReportApi[] } | { ok: false; error: string }> {
  const res = await apiRequest<ReportApi[]>("/api/reports/open");

  if (!res.ok || !Array.isArray(res.data)) {
    return { ok: false, error: res.error ?? "Не удалось загрузить открытые жалобы" };
  }

  return { ok: true, data: res.data };
}

export async function fetchMyReports(): Promise<{ ok: true; data: ReportApi[] } | { ok: false; error: string }> {
  const res = await apiRequest<ReportApi[]>("/api/reports/my");

  if (!res.ok || !Array.isArray(res.data)) {
    return { ok: false, error: res.error ?? "Не удалось загрузить ваши жалобы" };
  }

  return { ok: true, data: res.data };
}

export async function createReport(
  payload: CreateReportPayload
): Promise<{ ok: true; data: ReportApi } | { ok: false; error: string }> {
  const res = await apiRequest<ReportApi>("/api/reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.data) {
    return { ok: false, error: res.error ?? "Не удалось отправить жалобу" };
  }

  return { ok: true, data: res.data };
}

export async function updateReportStatus(
  id: number,
  payload: UpdateReportStatusPayload
): Promise<{ ok: true; data: ReportApi } | { ok: false; error: string }> {
  const res = await apiRequest<ReportApi>(`/api/reports/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.data) {
    return { ok: false, error: res.error ?? "Не удалось обновить жалобу" };
  }

  return { ok: true, data: res.data };
}
