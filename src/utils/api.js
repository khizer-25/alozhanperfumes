/**
 * Thin fetch wrapper for the Al Özhan API.
 *
 * - Base URL from VITE_API_URL (falls back to local backend).
 * - Sends the in-memory access token as a Bearer header.
 * - Sends cookies (the refresh token lives in an httpOnly cookie).
 * - On a 401 it transparently tries POST /auth/refresh once, then replays
 *   the original request.
 */

const BASE_URL =import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://alozhan-backend.onrender.com/api";

let accessToken = null;
let onAuthLost = null; // set by AuthContext — called when refresh fails

export const setAccessToken = (token) => {
  accessToken = token || null;
  try {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  } catch {
    /* private mode */
  }
};

export const getAccessToken = () => {
  if (accessToken) return accessToken;
  try {
    accessToken = localStorage.getItem("authToken");
  } catch {
    accessToken = null;
  }
  return accessToken;
};

export const setAuthLostHandler = (fn) => {
  onAuthLost = fn;
};

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}
export { ApiError };

const buildHeaders = (hasBody, isForm) => {
  const headers = {};
  if (hasBody && !isForm) headers["Content-Type"] = "application/json";
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

let refreshPromise = null;

const tryRefresh = async () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("refresh failed");
        const json = await res.json();
        const token = json?.data?.accessToken;
        if (!token) throw new Error("no token in refresh");
        setAccessToken(token);
        return token;
      })
      .catch((err) => {
        setAccessToken(null);
        if (onAuthLost) onAuthLost();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const request = async (method, endpoint, body, { retry = true, headers = {} } = {}) => {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    credentials: "include",
    headers: { ...buildHeaders(body !== undefined, isForm), ...headers },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  if (res.status === 401 && retry && !endpoint.startsWith("/auth/login") && !endpoint.startsWith("/auth/register")) {
    try {
      await tryRefresh();
      return request(method, endpoint, body, { retry: false, headers });
    } catch {
      /* fall through to error below */
    }
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    const message =
      json?.message ||
      (json?.errors && json.errors[0]?.message) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, json);
  }

  return json;
};

export const api = {
  raw: request,
  get: (endpoint, opts) => request("GET", endpoint, undefined, opts),
  post: (endpoint, body, opts) => request("POST", endpoint, body ?? {}, opts),
  put: (endpoint, body, opts) => request("PUT", endpoint, body ?? {}, opts),
  patch: (endpoint, body, opts) => request("PATCH", endpoint, body ?? {}, opts),
  delete: (endpoint, opts) => request("DELETE", endpoint, undefined, opts),
};

export { BASE_URL };
