import { config } from "./config";

export class UpstreamError extends Error {
  constructor(message: string, public readonly statusCode = 502) {
    super(message);
    this.name = "UpstreamError";
  }
}

export async function fakeStoreRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = new URL(`${config.fakeStoreApiBaseUrl}${path}`);
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(config.upstreamTimeoutMs),
      headers: { "content-type": "application/json", ...init?.headers }
    });
  } catch {
    throw new UpstreamError("Fake Store API is unavailable", 502);
  }

  const body = await response.text();
  if (!response.ok) {
    throw new UpstreamError(body || "Fake Store API request failed", response.status);
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new UpstreamError("Fake Store API returned an invalid response", 502);
  }
}