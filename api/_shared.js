// Shared by the serverless functions in this folder. Files starting with "_"
// are not deployed as functions by Vercel.

export const SITE_URL = "https://www.alozhanperfumes.com";
export const SITE_NAME = "Al Özhan Perfumes";
export const API_URL = (
  process.env.VITE_API_URL || "https://ozhan-back.onrender.com/api"
).replace(/\/$/, "");

// Escapes text for use in HTML/XML element content and attribute values.
export const escape = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** fetch() that gives up after `ms` so a sleeping backend can't stall a page. */
export async function fetchWithTimeout(url, ms = 3500) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}
