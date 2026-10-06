/**
 * Server-side "pre-render" for the SPA (every non-static URL is rewritten
 * here — see vercel.json).
 *
 * Takes the built index.html and bakes in the page's real <title>,
 * description, canonical, robots, Open Graph/Twitter tags and JSON-LD, so
 * crawlers and link-preview bots (WhatsApp, Facebook, Bing…) that don't run
 * JavaScript see correct metadata. Product pages also get their name, image,
 * description and prices in the body; React replaces it on mount.
 *
 * Unknown routes and missing products return a real 404 status.
 * On any failure it falls back to the plain template — the SPA still works.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE_URL, SITE_NAME, API_URL, escape, fetchWithTimeout } from "./_shared.js";

const DEFAULT_IMAGE = `${SITE_URL}/media/hero-poster.jpg`;
const DEFAULT_DESCRIPTION =
  "Al Özhan Perfumes — artisanal perfumes and attars, composed by hand in small batches. Shop long-lasting Eau de Parfum and pure attars online across India.";

// Keep in sync with src/content/legal.js
const LEGAL_TITLES = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  returns: "Returns & Refunds",
  shipping: "Shipping Policy",
};

// SPA routes that exist but must not be indexed (mirrors App.jsx).
const PRIVATE_ROUTES = {
  "/login": "Sign in",
  "/reset-password": "Reset password",
  "/verify-email": "Verify email",
  "/account": "My account",
  "/checkout": "Checkout",
  "/admin": "Admin",
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

let templateCache = null;

async function loadTemplate(origin) {
  if (templateCache) return templateCache;
  // dist/index.html exists locally after a build; on Vercel we fetch the
  // deployed copy. Static files win over rewrites, so /index.html is served
  // from the filesystem and never loops back into this function.
  try {
    templateCache = await readFile(path.join(process.cwd(), "dist", "index.html"), "utf8");
  } catch {
    const res = await fetch(`${origin}/index.html`);
    if (!res.ok) throw new Error(`template fetch ${res.status}`);
    templateCache = await res.text();
  }
  return templateCache;
}

// Removes the tags we manage from the template's <head> and inserts ours.
function renderHead(template, meta) {
  const stripped = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="(description|robots|twitter:[^"]+)"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "");

  const title = meta.title ? `${meta.title} | ${SITE_NAME}` : `${SITE_NAME} — Artisanal Perfumes & Attars`;
  const description = meta.description || DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${meta.path}`;
  const image = meta.image || DEFAULT_IMAGE;

  const tags = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, nofollow" : "index, follow"}" />`,
    !meta.noindex && `<link rel="canonical" href="${escape(url)}" />`,
    `<meta property="og:site_name" content="${escape(SITE_NAME)}" />`,
    `<meta property="og:type" content="${meta.type || "website"}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:image" content="${escape(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${escape(image)}" />`,
    meta.jsonLd &&
      // "<" escaped so product text can never close the script tag.
      `<script type="application/ld+json" data-seo="page">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>`,
  ]
    .filter(Boolean)
    .map((t) => `    ${t}`)
    .join("\n");

  let html = stripped.replace("</head>", `${tags}\n  </head>`);
  if (meta.body) {
    html = html.replace('<div id="root"></div>', `<div id="root">${meta.body}</div>`);
  }
  return html;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

async function fetchProduct(slug) {
  const res = await fetchWithTimeout(`${API_URL}/products/slug/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API responded ${res.status}`);
  const { data } = await res.json();
  return data && data.isActive !== false ? data : null;
}

const describe = (p) => {
  const text = `${p.name} — ${p.tagline ? `${p.tagline} ` : ""}${p.description || ""}`.trim();
  return text.length > 150 ? `${text.slice(0, 147).trimEnd()}…` : text;
};

function productMeta(p) {
  const kind = p.type === "attar" ? "Attar" : "Eau de Parfum";
  const productPath = `/products/${p.slug}`;
  const url = `${SITE_URL}${productPath}`;
  const images = (p.images || []).map((i) => i.url).filter(Boolean);
  const variants = (p.variants || [])
    .filter((v) => v.isActive !== false)
    .map((v) => ({
      label: `${v.size} ${v.unit || "ml"}`,
      price: v.discountPrice ?? v.price,
      inStock: (v.stock ?? 0) > 0,
    }));
  const rating = p.ratings?.average || 0;
  const reviewCount = p.ratings?.count || 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: p.name,
        description: p.description || p.tagline,
        image: images,
        sku: p._id,
        category: kind,
        brand: { "@type": "Brand", name: p.brand || "Al Özhan" },
        url,
        offers: variants.length
          ? variants.map((v) => ({
              "@type": "Offer",
              name: `${p.name} ${v.label}`,
              price: v.price,
              priceCurrency: "INR",
              availability: v.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
              url,
            }))
          : undefined,
        aggregateRating:
          reviewCount > 0
            ? { "@type": "AggregateRating", ratingValue: rating, reviewCount }
            : undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/products` },
          { "@type": "ListItem", position: 3, name: p.name, item: url },
        ],
      },
    ],
  };

  // Mirrors the ProductDetails layout so the swap to React is barely visible.
  const body = `
      <div class="container-lux py-10 md:py-16">
        <div class="mt-8 grid gap-12 md:grid-cols-2 lg:gap-16">
          <div>
            <div class="aspect-[4/5] overflow-hidden bg-[#efe9dd]">
              ${images[0] ? `<img src="${escape(images[0])}" alt="${escape(p.name)}" class="h-full w-full object-cover" />` : ""}
            </div>
          </div>
          <div>
            <p class="eyebrow">${escape(p.type === "attar" ? "Concentrated attar" : "Eau de Parfum")}${p.family ? ` · ${escape(p.family)}` : ""}</p>
            <h1 class="mt-2 text-4xl md:text-5xl">${escape(p.name)}</h1>
            ${p.tagline ? `<p class="mt-2 font-serif text-lg italic text-muted">${escape(p.tagline)}</p>` : ""}
            <p class="mt-6 text-sm font-light leading-[1.9] text-muted">${escape(p.description)}</p>
            <ul class="mt-8 flex flex-wrap gap-2">
              ${variants
                .map(
                  (v) =>
                    `<li class="min-w-[92px] border border-line px-4 py-3 text-sm">${escape(v.label)} · ${
                      v.inStock ? escape(inr.format(v.price)) : "Sold out"
                    }</li>`
                )
                .join("")}
            </ul>
            <p class="mt-8"><a href="/products" class="btn-outline">Back to the collection</a></p>
          </div>
        </div>
      </div>`;

  return {
    title: `${p.name} ${kind}`,
    description: describe(p),
    image: images[0],
    path: productPath,
    type: "product",
    jsonLd,
    body,
  };
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

const NOT_FOUND = { status: 404, meta: { title: "Page not found", noindex: true } };

async function resolve(pathname, query) {
  if (pathname === "/") {
    return {
      meta: {
        path: "/",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/favicon.png`,
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: SITE_NAME,
              url: SITE_URL,
              publisher: { "@id": `${SITE_URL}/#organization` },
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/products?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
          ],
        },
      },
    };
  }

  if (pathname === "/products") {
    const type = query.type === "attar" || query.type === "perfume" ? query.type : null;
    return {
      meta: {
        title: type === "attar" ? "Attars" : type === "perfume" ? "Perfumes" : "Shop All Fragrances",
        description:
          type === "attar"
            ? "Shop pure, alcohol-free attars from Al Özhan — concentrated perfume oils composed by hand in small batches."
            : type === "perfume"
            ? "Shop Al Özhan Eau de Parfum — long-lasting, small-batch perfumes built from rare naturals."
            : "Browse every Al Özhan perfume and attar. Filter by category and wear — every order ships with samples.",
        path: type ? `/products?type=${type}` : "/products",
        noindex: Boolean(query.q),
      },
    };
  }

  const productMatch = pathname.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const product = await fetchProduct(decodeURIComponent(productMatch[1]));
    if (!product) return { status: 404, meta: { title: "Fragrance not found", noindex: true } };
    return { meta: productMeta(product) };
  }

  if (pathname === "/contact") {
    return {
      meta: {
        title: "Contact Us",
        description:
          "Get in touch with Al Özhan Perfumes — questions about fragrances, orders, shipping or returns.",
        path: "/contact",
      },
    };
  }

  const legalMatch = pathname.match(/^\/legal\/([^/]+)$/);
  if (legalMatch) {
    const title = LEGAL_TITLES[legalMatch[1]];
    if (!title) return NOT_FOUND;
    return {
      meta: {
        title,
        description: `${title} for Al Özhan Perfumes — how we handle orders, shipping, returns and your data.`,
        path: pathname,
      },
    };
  }

  if (PRIVATE_ROUTES[pathname]) {
    return { private: true, meta: { title: PRIVATE_ROUTES[pathname], noindex: true } };
  }

  return NOT_FOUND;
}

export default async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  // vercel.json passes the original path as ?path=; strip it from the query.
  const rawPath = url.searchParams.get("path");
  url.searchParams.delete("path");
  const pathname = ("/" + (rawPath ?? url.pathname).replace(/^\/+/, "")).replace(/\/+$/, "") || "/";
  const query = Object.fromEntries(url.searchParams);
  const origin = `https://${req.headers["x-forwarded-host"] || req.headers.host}`;

  let template;
  try {
    template = await loadTemplate(origin);
  } catch (err) {
    console.error("render: template unavailable", err);
    res.status(500).send("Temporarily unavailable");
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  try {
    const result = await resolve(pathname, query);
    res.setHeader(
      "Cache-Control",
      result.private
        ? "private, no-store"
        : "public, max-age=0, s-maxage=600, stale-while-revalidate=86400"
    );
    res.status(result.status || 200).send(renderHead(template, result.meta));
  } catch (err) {
    // API down / slow: serve the plain SPA shell, cache briefly, retry soon.
    console.error("render: falling back to plain shell", err);
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=30");
    res.status(200).send(template);
  }
}
