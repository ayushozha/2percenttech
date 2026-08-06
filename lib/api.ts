/* The HTTP client for api.2percenttech.com.

   The site is a static export with no server of its own, so the browser talks
   to the API directly. Sessions ride on httpOnly cookies issued by the API on
   the parent domain, which is why every request sets `credentials: 'include'`
   and why no token is ever readable from JavaScript here. */

const DEFAULT_BASE = 'https://api.2percenttech.com';

/* Baked in at build time by the static export. The Dockerfile passes it as a
   build arg so a local `npm run dev` can point at a local API instead. */
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || DEFAULT_BASE).replace(/\/$/, '');

/** A failed request that carries the API's own error code, so callers can
    branch on `code` rather than parsing a message. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Options = { method?: string; body?: unknown };

export async function api<T>(path: string, { method = 'GET', body }: Options = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    /* Offline, DNS failure, blocked by an extension — never a useful message
       from the browser, so give the caller one it can show. */
    throw new ApiError(0, 'network', 'Could not reach the server. Check your connection and try again.');
  }

  if (res.status === 204) return undefined as T;

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const code = (payload as { error?: string })?.error ?? 'server_error';
    const message = (payload as { message?: string })?.message ?? 'Something went wrong.';
    throw new ApiError(res.status, code, message);
  }

  return payload as T;
}
