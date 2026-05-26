const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export interface ApiSession {
  token: string;
}

async function request<T>(path: string, options: RequestInit = {}, session?: ApiSession): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers
    },
    cache: "no-store"
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error ?? "Request failed");
  return payload.data as T;
}

export const api = {
  get: <T>(path: string, session?: ApiSession) => request<T>(path, {}, session),
  post: <T>(path: string, body: unknown, session?: ApiSession) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }, session),
  put: <T>(path: string, body: unknown, session?: ApiSession) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }, session),
  delete: <T>(path: string, session?: ApiSession) => request<T>(path, { method: "DELETE" }, session)
};
