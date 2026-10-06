import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Per-route <head> tags: title, description, canonical, robots, Open Graph,
 * Twitter card and optional JSON-LD. Updates the tags that index.html ships
 * with (so crawlers that don't run JS still get sensible defaults) instead of
 * appending duplicates.
 */

export const SITE_URL = "https://www.alozhanperfumes.com";
export const SITE_NAME = "Al Özhan Perfumes";
const DEFAULT_DESCRIPTION =
  "Al Özhan Perfumes — artisanal perfumes and attars, composed by hand in small batches. Shop long-lasting Eau de Parfum and pure attars online across India.";
const DEFAULT_IMAGE = `${SITE_URL}/media/hero-poster.jpg`;

const absolute = (url) =>
  !url ? DEFAULT_IMAGE : url.startsWith("http") ? url : `${SITE_URL}${url}`;

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  path, // canonical path; defaults to the current pathname (query dropped)
  type = "website",
  noindex = false,
  jsonLd,
}) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Artisanal Perfumes & Attars`;
  const url = `${SITE_URL}${path ?? pathname}`;
  const img = absolute(image);
  const ld = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setCanonical(url);

    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:type", type);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);

    // Replace JSON-LD from the server render (api/render.js) or a prior page.
    document.head.querySelectorAll('script[data-seo="page"]').forEach((el) => el.remove());
    if (!ld) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "page";
    script.textContent = ld;
    document.head.appendChild(script);
    return () => script.remove();
  }, [fullTitle, description, url, img, type, noindex, ld]);

  return null;
}
