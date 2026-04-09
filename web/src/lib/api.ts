export function getApiBaseUrl(): string | undefined {
  return (import.meta.env.VITE_API_BASE_URL as string | undefined)
    ?.trim()
    .replace(/\/$/, "");
}

/** Body of GET /api/auth/me (camelCase JSON). */
export type AuthMeResponse = {
  email: string;
  roles: string[];
  supporterId: number | null;
};

export async function apiGetJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("API base URL not configured");
  }
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { ...init, credentials: "include" });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPostJson<TResponse>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<TResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("API base URL not configured");
  }
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    let detail = res.statusText;
    try {
      const parsed = JSON.parse(text) as { error?: string; title?: string; detail?: string };
      detail = parsed.detail ?? parsed.error ?? parsed.title ?? detail;
    } catch {
      if (text) detail = text;
    }
    throw new Error(detail || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<TResponse>;
}
