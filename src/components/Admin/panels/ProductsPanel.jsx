import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { api } from "../../../utils/api";
import { formatPrice } from "../../../utils/format";
import { PanelHeader, EmptyState, StatusPill } from "../ui";
import ProductForm from "./ProductForm";

const PAGE_SIZE = 25;

const fetchAllProducts = async () => {
  const first = await api.get("/products?limit=100");
  const rest = await Promise.all(
    Array.from({ length: (first.pages || 1) - 1 }, (_, i) =>
      api.get(`/products?limit=100&page=${i + 2}`)
    )
  );
  return [first, ...rest].flatMap((res) => res.data);
};

export default function ProductsPanel({ notify }) {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState("loading");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // product | "new" | null
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const load = useCallback(() => {
    setState("loading");
    fetchAllProducts()
      .then((data) => {
        setProducts(data);
        setState("done");
      })
      .catch(() => setState("error"));
  }, []);

  useEffect(load, [load]);

  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [search]);

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      notify("Product deleted");
      load();
    } catch (e) {
      notify(e.message);
    }
  };

  const filtered = products.filter((p) =>
    `${p.name} ${p.brand} ${p.family}`.toLowerCase().includes(search.toLowerCase())
  );

  const shown = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  return (
    <>
      <PanelHeader
        title="Catalogue"
        subtitle={`${products.length} products`}
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
      {state === "done" && filtered.length === 0 && <EmptyState>No products found.</EmptyState>}

      {state === "done" && filtered.length > 0 && (
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
            Showing {shown.length} of {filtered.length}
          </p>
          <button onClick={() => setDisplayCount((c) => c + PAGE_SIZE)} className="btn-outline">
            Load more
          </button>
        </div>
      )}

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={load}
          notify={notify}
        />
      )}
    </>
  );
}
