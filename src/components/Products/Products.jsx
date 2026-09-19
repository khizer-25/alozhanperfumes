import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { api } from "../../utils/api";
import { normalizeProducts } from "../../utils/normalize";
import ProductCard from "./ProductCard";

const SORTS = [
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price · low to high" },
  { value: "-price", label: "Price · high to low" },
  { value: "name", label: "A–Z" },
];

const PAGE_SIZE = 9;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [state, setState] = useState("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const type = params.get("type") || "all";
  const gender = params.get("gender") || "all";
  const sort = params.get("sort") || "-createdAt";
  const search = params.get("q") || "";

  // The page counter is tied to the current filters, so any filter/search/sort
  // change (including via a link) starts again from page 1.
  const filterKey = `${type}|${gender}|${sort}|${search}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    let alive = true;
    if (page === 1) setState("loading");
    else setLoadingMore(true);

    // The API caps a request at 100 items, so fetch one page of PAGE_SIZE at a time and append.
    const queryParams = new URLSearchParams({
      limit: String(PAGE_SIZE),
      page: String(page),
      isActive: "true",
    });
    if (type !== "all") queryParams.set("type", type);
    if (gender !== "all") queryParams.set("gender", gender);
    if (sort) queryParams.set("sort", sort);
    if (search) queryParams.set("search", search);

    api
      .get(`/products?${queryParams.toString()}`)
      .then((res) => {
        if (!alive) return;
        const list = normalizeProducts(res.data || []);
        setProducts((prev) => {
          if (page === 1) return list;
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...list.filter((p) => !seen.has(p.id))];
        });
        setTotalProducts(res.total ?? list.length);
        setState("done");
        setLoadingMore(false);
      })
      .catch(() => {
        if (!alive) return;
        if (page === 1) setState("error");
        setLoadingMore(false);
      });

    return () => {
      alive = false;
    };
  }, [filterKey, page]);

  const hasMore = products.length < totalProducts;

  const activeFilterCount = (type !== "all") + (gender !== "all") + (search ? 1 : 0);

  const FilterControls = () => (
    <div className="space-y-6">
      <div>
        <p className="label">Category</p>
        <div className="flex flex-wrap gap-2">
          {["all", "perfume", "attar"].map((t) => (
            <button
              key={t}
              onClick={() => setParam("type", t)}
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                type === t ? "bg-ink text-alabaster" : "border border-line hover:border-ink"
              }`}
            >
              {t === "all" ? "All" : t === "perfume" ? "Perfume" : "Attar"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="label">Worn by</p>
        <div className="flex flex-wrap gap-2">
          {["all", "women", "men", "unisex"].map((g) => (
            <button
              key={g}
              onClick={() => setParam("gender", g)}
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                gender === g ? "bg-ink text-alabaster" : "border border-line hover:border-ink"
              }`}
            >
              {g === "all" ? "Anyone" : g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-lux py-14 md:py-20">
      <header className="mx-auto max-w-xl text-center">
        <p className="eyebrow">The Library</p>
        <h1 className="mt-3 text-4xl md:text-5xl">
          {type === "attar" ? "Attars" : type === "perfume" ? "Perfumes" : "Every Fragrance"}
        </h1>
        <div className="rule mx-auto mt-5" />
        <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-muted">
          Filter by category and wear. Every order ships with samples.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search notes, names…"
            className="w-full border border-line bg-paper py-2.5 pl-9 pr-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="btn border border-line px-4 py-2.5 md:hidden"
          >
            <SlidersHorizontal size={14} /> Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-gold px-1.5 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
            Sort
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="border border-line bg-paper px-3 py-2 text-[11px] uppercase tracking-[0.12em] focus:border-gold focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-[210px_1fr]">
        <aside className="hidden md:block">
          <FilterControls />
        </aside>

        {showFilters && (
          <div className="rounded-none border border-line bg-paper p-5 md:hidden">
            <div className="mb-4 flex items-center justify-between">
              <span className="label mb-0">Filters</span>
              <button onClick={() => setShowFilters(false)}>
                <X size={16} />
              </button>
            </div>
            <FilterControls />
          </div>
        )}

        <div>
          {state === "loading" && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-[#ece5d7]" />
                  <div className="mx-auto mt-4 h-3 w-2/3 bg-[#ece5d7]" />
                </div>
              ))}
            </div>
          )}
          {state === "error" && (
            <p className="py-20 text-center text-sm text-muted">
              Unable to load the catalogue. Please refresh.
            </p>
          )}
          {state === "done" && (
            <>
              <p className="mb-6 text-[11px] uppercase tracking-[0.16em] text-muted">
                Showing {products.length} of {totalProducts} {totalProducts === 1 ? "fragrance" : "fragrances"}
              </p>
              {products.length === 0 ? (
                <div className="border border-line bg-paper py-20 text-center">
                  <p className="text-sm text-muted">Nothing matches those filters.</p>
                  <button
                    onClick={() => setParams({}, { replace: true })}
                    className="mt-4 btn-outline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
                    {products.map((p, i) => (
                      <ProductCard key={p.id} product={p} index={i} />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={() => setPageState({ key: filterKey, page: page + 1 })}
                        disabled={loadingMore}
                        className="btn-outline"
                      >
                        {loadingMore ? "Loading…" : "Load more"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
