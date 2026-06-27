// Low-level HTTP client for the ScholarGen Live API.
//
// - Sends/receives JSON and always includes credentials so the signed httpOnly
//   session cookie set by /auth/login flows on every subsequent request. React
//   Native's native networking layer persists cookies automatically, and the
//   API responds with `Access-Control-Allow-Credentials: true` for web.
// - Unwraps the standard `{ status, message, data }` envelope, returning `data`
//   on success and throwing a typed ApiError on failure.
import { API_BASE_URL } from '../config/env';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function buildQuery(query) {
  if (!query) return '';
  const parts = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return parts.length ? `?${parts.join('&')}` : '';
}

export async function request(method, path, { body, query, headers } = {}) {
  const url = `${API_BASE_URL}${path}${buildQuery(query)}`;

  const options = {
    method,
    credentials: 'include',
    headers: { Accept: 'application/json', ...(headers || {}) },
  };

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new ApiError('Network error — please check your connection and try again.', 0, null);
  }

  // Some endpoints (logout, webhook) may return an empty body.
  const text = await res.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
  }

  const failed = !res.ok || payload?.status === 'error';
  if (failed) {
    const message = payload?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, payload);
  }

  // Prefer the unwrapped `data` field; fall back to the whole payload.
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
}

export const apiGet = (path, opts) => request('GET', path, opts);
export const apiPost = (path, body, opts) => request('POST', path, { ...opts, body });
export const apiPut = (path, body, opts) => request('PUT', path, { ...opts, body });
export const apiDelete = (path, opts) => request('DELETE', path, opts);
