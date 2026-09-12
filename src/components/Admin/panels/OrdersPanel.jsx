import { useEffect, useState, useCallback } from "react";
import { ChevronDown, Search } from "lucide-react";
import { api } from "../../../utils/api";
import { formatPrice, formatDate } from "../../../utils/format";
import { PanelHeader, StatusPill, EmptyState } from "../ui";

function TrackingForm({ order, saving, onSave }) {
  const [tracking, setTracking] = useState(order.trackingNumber || "");
  const [carrier, setCarrier] = useState(order.carrier || "");
  return (
    <div className="mt-1.5 space-y-2">
      <input
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        placeholder="Tracking number"
        className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      <input
        value={carrier}
        onChange={(e) => setCarrier(e.target.value)}
        placeholder="Carrier (e.g. Delhivery)"
        className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      <button
        disabled={saving || !tracking}
        onClick={() => onSave(tracking, carrier)}
        className="text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink disabled:opacity-40"
      >
        Save & notify customer
      </button>
    </div>
  );
}

const STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default function OrdersPanel({ notify }) {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("loading");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(() => {
    setState("loading");
    const qs = new URLSearchParams({ limit: "100" });
    if (statusFilter) qs.set("status", statusFilter);
    if (search) qs.set("search", search);
    api
      .get(`/orders?${qs.toString()}`)
      .then((res) => {
        setOrders(res.data);
        setState("done");
      })
      .catch(() => setState("error"));
  }, [statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const updateStatus = async (id, body) => {
    setSavingId(id);
    try {
      await api.patch(`/orders/${id}/status`, body);
      notify(body.status ? `Order marked ${body.status}` : "Order updated");
      load();
    } catch (e) {
      notify(e.message);
    } finally {
      setSavingId(null);
    }
  };

  const markPaid = async (id) => {
    setSavingId(id);
    try {
      await api.patch(`/orders/${id}/pay`, {});
      notify("Payment recorded");
      load();
    } catch (e) {
      notify(e.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <PanelHeader title="Orders" subtitle={`${orders.length} shown`} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order no. or name"
            className="border border-line bg-paper py-2 pl-9 pr-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${
              !statusFilter ? "bg-ink text-alabaster" : "border border-line text-muted"
            }`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${
                statusFilter === s ? "bg-ink text-alabaster" : "border border-line text-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {state === "loading" && <EmptyState>Loading orders…</EmptyState>}
      {state === "error" && <EmptyState>Couldn't load orders.</EmptyState>}
      {state === "done" && orders.length === 0 && <EmptyState>No orders match.</EmptyState>}

      {state === "done" && orders.length > 0 && (
        <div className="divide-y divide-line border border-line bg-paper">
          {orders.map((o) => (
            <div key={o._id}>
              <button
                onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 py-3.5 text-left hover:bg-alabaster md:grid-cols-[160px_1fr_120px_110px_90px_20px]"
              >
                <span className="text-sm">{o.orderNumber}</span>
                <span className="hidden text-sm font-light text-muted md:block">
                  {o.user?.name || o.shippingAddress.fullName}
                </span>
                <span className="hidden text-[11px] font-light text-muted md:block">
                  {formatDate(o.createdAt)}
                </span>
                <span className="hidden md:block">
                  <StatusPill status={o.status} />
                </span>
                <span className="text-right text-sm tabular-nums">{formatPrice(o.totalPrice)}</span>
                <ChevronDown
                  size={15}
                  className={`hidden justify-self-end text-muted transition-transform md:block ${
                    expanded === o._id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expanded === o._id && (
                <div className="border-t border-line bg-alabaster px-4 py-5">
                  <div className="grid gap-6 md:grid-cols-[1fr_260px]">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                        Items
                      </p>
                      <ul className="mt-2 divide-y divide-line">
                        {o.items.map((it) => (
                          <li key={it._id} className="flex items-center gap-3 py-2 text-sm">
                            <div className="h-12 w-10 shrink-0 overflow-hidden bg-[#efe9dd]">
                              {it.image && <img src={it.image} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <span className="flex-1">
                              {it.name}{" "}
                              <span className="text-[11px] font-light text-muted">
                                {it.size}
                                {it.unit} · ×{it.qty}
                              </span>
                            </span>
                            <span className="tabular-nums">{formatPrice(it.price * it.qty)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 space-y-1 text-sm font-light">
                        <div className="flex justify-between">
                          <span className="text-muted">Items</span>
                          <span className="tabular-nums">{formatPrice(o.itemsPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Shipping</span>
                          <span className="tabular-nums">{formatPrice(o.shippingPrice)}</span>
                        </div>
                        {o.taxPrice > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted">Tax</span>
                            <span className="tabular-nums">{formatPrice(o.taxPrice)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-line pt-1 text-base">
                          <span>Total</span>
                          <span className="font-serif tabular-nums">{formatPrice(o.totalPrice)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm font-light">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                          Ship to
                        </p>
                        <p className="mt-1 text-ink">{o.shippingAddress.fullName}</p>
                        <p className="text-muted">
                          {o.shippingAddress.line1}
                          {o.shippingAddress.line2 ? `, ${o.shippingAddress.line2}` : ""}
                          <br />
                          {o.shippingAddress.city} {o.shippingAddress.postalCode}
                          <br />
                          {o.shippingAddress.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                          Payment
                        </p>
                        <p className="mt-1">
                          {o.paymentMethod === "cod" ? "Cash on delivery" : "Online"} ·{" "}
                          <StatusPill status={o.isPaid ? "paid" : "unpaid"} />
                        </p>
                        {!o.isPaid && (
                          <button
                            onClick={() => markPaid(o._id)}
                            disabled={savingId === o._id}
                            className="mt-2 text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
                          >
                            Mark as paid
                          </button>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                          Update status
                        </p>
                        <select
                          value={o.status}
                          disabled={savingId === o._id}
                          onChange={(e) => updateStatus(o._id, { status: e.target.value })}
                          className="mt-1.5 w-full border border-line bg-paper px-3 py-2 text-sm focus:border-gold focus:outline-none"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s[0].toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                          Tracking
                        </p>
                        <TrackingForm
                          order={o}
                          saving={savingId === o._id}
                          onSave={(tracking, carrier) =>
                            updateStatus(o._id, {
                              status: o.status === "processing" ? "shipped" : o.status,
                              trackingNumber: tracking,
                              carrier,
                              note: "Tracking added",
                            })
                          }
                        />
                      </div>
                      {o.refundedAmount > 0 && (
                        <p className="text-[11px] text-gold-deep">
                          {formatPrice(o.refundedAmount)} refunded
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
