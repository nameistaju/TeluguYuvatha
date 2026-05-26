const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const DEFAULT_TIMEOUT_MS = 15_000;

export interface ApiSession {
  token?: string;
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, session?: ApiSession): Promise<T> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: options.signal ?? controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
        ...options.headers
      }
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiRequestError("Request timed out. Please try again.", 408);
    }
    throw new ApiRequestError("Network request failed. Please check your connection.", 0);
  } finally {
    globalThis.clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiRequestError(payload.error ?? "Request failed", response.status, payload.details);
  return payload.data as T;
}

export const api = {
  get: <T>(path: string, session?: ApiSession) => apiRequest<T>(path, {}, session),
  post: <T>(path: string, body: unknown, session?: ApiSession) =>
    apiRequest<T>(path, { method: "POST", body: JSON.stringify(body) }, session),
  delete: <T>(path: string, session?: ApiSession) => apiRequest<T>(path, { method: "DELETE" }, session),
  put: <T>(path: string, body: unknown, session?: ApiSession) =>
    apiRequest<T>(path, { method: "PUT", body: JSON.stringify(body) }, session)
};
