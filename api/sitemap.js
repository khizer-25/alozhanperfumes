/**
 * Vercel serverless function behind /sitemap.xml (see vercel.json).
 * Lists the static storefront pages plus every active product, pulled live
 * from the API so new products show up without a redeploy. Cached at the
 * edge for an hour so a cold Render backend rarely delays a crawler.
 */

import { SITE_URL, API_URL, escape as xmlEscape } from "./_shared.js";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/products", priority: "0.9", changefreq: "daily" },
  { path: "/products?type=perfume", priority: "0.8", changefreq: "daily" },
  { path: "/products?type=attar", priority: "0.8", changefreq: "daily" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/legal/privacy", priority: "0.2", changefreq: "yearly" },
  { path: "/legal/terms", priority: "0.2", changefreq: "yearly" },
  { path: "/legal/returns", priority: "0.3", changefreq: "yearly" },
  { path: "/legal/shipping", priority: "0.3", changefreq: "yearly" },
];

async function fetchAllProducts() {
  const products = [];
  for (let page = 1, pages = 1; page <= pages && page <= 50; page++) {
    const res = await fetch(`${API_URL}/products?isActive=true&limit=100&page=${page}`);
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const body = await res.json();
    products.push(...(body.data || []));
    pages = body.pages || 1;
  }
  return products;
}

const urlEntry = ({ loc, lastmod, changefreq, priority, image }) =>
  [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod && `    <lastmod>${lastmod}</lastmod>`,
    changefreq && `    <changefreq>${changefreq}</changefreq>`,
    priority && `    <priority>${priority}</priority>`,
    image && `    <image:image><image:loc>${xmlEscape(image)}</image:loc></image:image>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");

export default async function handler(req, res) {
  let products = [];
  try {
    products = await fetchAllProducts();
  } catch (err) {
    // Still serve the static pages; a short cache so we retry soon.
    console.error("sitemap: product fetch failed", err);
    res.setHeader("Cache-Control", "public, s-maxage=300");
  }

  const entries = [
    ...STATIC_PAGES.map((p) => urlEntry({ ...p, loc: `${SITE_URL}${p.path}` })),
    ...products
      .filter((p) => p.slug)
      .map((p) =>
        urlEntry({
          loc: `${SITE_URL}/products/${encodeURIComponent(p.slug)}`,
          lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : undefined,
          changefreq: "weekly",
          priority: "0.7",
          image: p.images?.[0]?.url,
        })
      ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>
`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  if (products.length) {
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  }
  res.status(200).send(xml);
}
