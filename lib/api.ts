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
  created_at?: string;
  updated_at?: string;
};

// Paginated response type
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// ✅ BASE ควรจบที่ /api
const RAW_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim().replace(/\/+$/, "") ||
  "http://localhost:8080";
const BASE = RAW_BASE.endsWith("/api") ? RAW_BASE : `${RAW_BASE}/api`;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  // ✅ บังคับให้ path มี /
  const p = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE}${p}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
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
    throw new Error(msg);
  }

  // 204 no content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function listJudgments(
  search?: string,
  page: number = 1,
  limit: number = 10
) {
  const params = new URLSearchParams();
  if (search?.trim()) params.set("search", search.trim());
  params.set("page", String(page));
  params.set("limit", String(limit));

  const q = params.toString() ? `?${params.toString()}` : "";
  return await http<PaginatedResponse<Judgment>>(`/judgments${q}`);
}

export async function getJudgment(id: string) {
  return await http<Judgment>(`/judgments/${encodeURIComponent(id)}`);
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
