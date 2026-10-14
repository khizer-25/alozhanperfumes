/** Last few products a shopper opened, kept in this browser only. */
const KEY = "alozhan_recent_v1";
const MAX = 8;

export const getRecentlyViewed = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (p) => {
  if (!p?.id) return;
  const entry = {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    image: p.image,
    startingPrice: p.startingPrice,
    type: p.type,
  };
  const next = [entry, ...getRecentlyViewed().filter((x) => x.id !== entry.id)].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked */
  }
};
