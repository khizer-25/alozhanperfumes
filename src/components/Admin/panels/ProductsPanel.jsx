import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { api } from "../../../utils/api";
import { formatPrice } from "../../../utils/format";
import { PanelHeader, EmptyState, StatusPill } from "../ui";
import ProductForm from "./ProductForm";

const PAGE_SIZE = 25;

const query = (page, search) =>
  `/products?limit=${PAGE_SIZE}&page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`;

export default function ProductsPanel({ notify }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1); // last page loaded
  const [pages, setPages] = useState(1);
  const [state, setState] = useState("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState(""); // debounced search sent to the API
  const [editing, setEditing] = useState(null); // product | "new" | null
  const requestId = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setTerm(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Fresh load: first chunk of 25 for the current search.
  const load = useCallback(
    (keepPages = 1) => {
      const id = ++requestId.current;
      setState((s) => (s === "done" ? "done" : "loading")); // keep the list visible while refreshing
      // After an edit/delete, re-fetch every chunk already on screen so the list doesn't jump back.
      Promise.all(Array.from({ length: keepPages }, (_, i) => api.get(query(i + 1, term))))
        .then((results) => {
          if (id !== requestId.current) return; // a newer search/refresh superseded this one
          const last = results[results.length - 1];
          setProducts(results.flatMap((r) => r.data));
          setTotal(last.total);
          setPages(last.pages || 1);
          setPage(keepPages);
          setState("done");
        })
        .catch(() => id === requestId.current && setState("error"));
    },
    [term]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    const id = requestId.current;
    try {
      const res = await api.get(query(page + 1, term));
      if (id !== requestId.current) return; // search changed while this chunk was loading
      setProducts((prev) => {
        const seen = new Set(prev.map((p) => p._id));
        return [...prev, ...res.data.filter((p) => !seen.has(p._id))];
      });
      setTotal(res.total);
      setPages(res.pages || 1);
      setPage(page + 1);
    } catch (e) {
      notify(e.message || "Couldn't load more products");
    } finally {
      setLoadingMore(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      notify("Product deleted");
      load(page);
    } catch (e) {
      notify(e.message);
    }
  };

  const shown = products;
  const hasMore = page < pages;

  return (
    <>
      <PanelHeader
        title="Catalogue"
        subtitle={`${total} products`}
        action={
          <button onClick={() => setEditing("new")} className="btn-primary">
            <Plus size={14} /> New product
          </button>
        }
      />

      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="w-full border border-line bg-paper py-2 pl-9 pr-3 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      {state === "loading" && <EmptyState>Loading catalogue…</EmptyState>}
      {state === "error" && <EmptyState>Couldn't load products.</EmptyState>}
      {state === "done" && products.length === 0 && <EmptyState>No products found.</EmptyState>}

      {state === "done" && products.length > 0 && (
        <div className="divide-y divide-line border border-line bg-paper">
          {shown.map((p) => {
            const stock = (p.variants || []).reduce((s, v) => s + (v.stock || 0), 0);
            return (
              <div key={p._id} className="flex items-center gap-4 px-4 py-3">
                <div className="h-14 w-12 shrink-0 overflow-hidden bg-[#efe9dd]">
                  {p.images?.[0] && (
                    <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {p.name}
                    {p.featured && (
                      <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-gold">
                        Featured
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] font-light text-muted">
                    {p.type} · {p.gender} · {(p.variants || []).length} {(p.variants || []).length === 1 ? "size" : "sizes"}
                  </p>
                </div>
                <div className="hidden text-right text-sm sm:block">
                  <p className="tabular-nums">
                    {p.startingPrice != null ? `From ${formatPrice(p.startingPrice)}` : "—"}
                  </p>
                  <p
                    className={`text-[11px] ${
                      stock === 0 ? "text-[#7a3b34]" : stock <= 10 ? "text-gold-deep" : "text-muted"
                    }`}
                  >
                    {stock} in stock
                  </p>
                </div>
                <div className="hidden md:block">
                  <StatusPill status={p.isActive ? "live" : "hidden"} />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(p)}
                    className="p-2 text-muted hover:text-ink"
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(p)}
                    className="p-2 text-muted hover:text-ink"
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {state === "done" && hasMore && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
            Showing {shown.length} of {total}
          </p>
          <button onClick={loadMore} disabled={loadingMore} className="btn-outline">
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => load(page)}
          notify={notify}
        />
      )}
    </>
  );
}
