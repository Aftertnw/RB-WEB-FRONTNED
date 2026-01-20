export type Judgment = {
  id: string;
  doc_no?: string | null;

  title: string;
  case_no?: string | null;
  court?: string | null;
  judgment_date?: string | null;

  parties?: string | null;
  facts?: string | null;
  issues?: string | null;
  holding?: string | null;
  notes?: string | null;

  tags: string[];
  status?: string; // pending, approved
  created_at?: string;
  updated_at?: string;
  created_by_name?: string | null;
};

// Paginated response type
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type YearlyStat = {
  year: string;
  count: number;
};

export type CourtStat = {
  court: string;
  count: number;
};

export type ContributorStat = {
  name: string;
  count: number;
};

export interface DashboardStats {
  total_judgments: number;
  total_users?: number;
  active_users?: number;
  pending_users?: number;
  pending_judgments?: number;
  yearly_stats: YearlyStat[];
  contributor_stats?: ContributorStat[];
  court_stats?: CourtStat[];
}

export async function getDashboardStats() {
  return await http<DashboardStats>("/dashboard/stats");
}

// ✅ BASE ควรจบที่ /api
const RAW_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim().replace(/\/+$/, "") ||
  "http://localhost:8080";
const BASE = RAW_BASE.endsWith("/api") ? RAW_BASE : `${RAW_BASE}/api`;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// Helper to get token (Browser only)
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const p = path.startsWith("/") ? path : `/${path}`;
  const token = getToken();

  const res = await fetch(`${BASE}${p}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.error || msg;
    } catch {
      // ignore parse error
    }
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:session-expired"));
      }
    }
    throw new ApiError(res.status, msg);
  }

  // 204 no content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function approveJudgment(id: string): Promise<void> {
  await http(`/judgments/${id}/approve`, {
    method: "PUT",
  });
}

export async function rejectJudgment(id: string): Promise<void> {
  await http(`/judgments/${id}/reject`, {
    method: "PUT",
  });
}

export async function listJudgments(
  search?: string,
  page: number = 1,
  limit: number = 10,
  status: string = "",
) {
  const params = new URLSearchParams();
  if (search?.trim()) params.set("search", search.trim());
  if (status?.trim()) params.set("status", status.trim());
  params.set("page", String(page));
  params.set("limit", String(limit));

  const q = params.toString() ? `?${params.toString()}` : "";
  const res = await http<PaginatedResponse<Judgment & { Parties?: string }>>(
    `/judgments${q}`,
  );
  if (res.items) {
    res.items = res.items.map((item) => {
      if (item.Parties && !item.parties) {
        return { ...item, parties: item.Parties };
      }
      return item;
    });
  }
  return res;
}

export async function getJudgment(id: string) {
  const j = await http<Judgment & { Parties?: string }>(
    `/judgments/${encodeURIComponent(id)}`,
  );
  // Fix casing mismatch: API returns 'Parties' but frontend expects 'parties'
  if (j.Parties && !j.parties) {
    j.parties = j.Parties;
  }
  return j;
}

export async function createJudgment(payload: Partial<Judgment>) {
  return await http<{ id: string; doc_no?: string }>(`/judgments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateJudgment(id: string, payload: Partial<Judgment>) {
  await http<void>(`/judgments/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteJudgment(id: string) {
  await http<void>(`/judgments/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// --- Users Management ---

export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "owner";
  avatar_url?: string | null;
  is_approved?: boolean;
  created_at?: string;
};

// สร้างชนิดสำหรับ create จาก User โดย “ตัด id/created_at/avatar_url” แล้วเพิ่ม password
export type UserCreateInput = Omit<User, "id" | "created_at" | "avatar_url"> & {
  password: string;
};

export async function createUser(payload: UserCreateInput) {
  return await http<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listUsers() {
  return await http<User[]>("/users");
}

export async function updateUser(
  userId: string,
  payload: Partial<User> & { password?: string },
) {
  await http<void>(`/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(userId: string) {
  await http<void>(`/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

// --- Notifications ---

export type Notification = {
  id: string;
  user_id: string;
  type: "info" | "alert" | "success";
  title: string;
  message: string;
  is_read: boolean;
  link?: string | null;
  created_at: string;
};

export async function listNotifications() {
  return await http<Notification[]>("/notifications");
}

export async function markNotificationRead(id: string) {
  await http<void>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsRead() {
  await http<void>("/notifications/read-all", {
    method: "POST",
  });
}

export async function deleteNotification(id: string) {
  await http<void>(`/notifications/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function deleteAllNotifications() {
  await http<void>("/notifications", {
    method: "DELETE",
  });
}
