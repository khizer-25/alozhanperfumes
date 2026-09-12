import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, MapPin, Plus, Trash2, Package, RefreshCw } from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import useSettings from "../../hooks/useSettings";
import { formatPrice, formatDate, titleCase } from "../../utils/format";
import ReturnFlow from "./ReturnFlow";

const STATUS_STYLES = {
  pending: "bg-[#efe9dd] text-muted",
  processing: "bg-[#e8eef0] text-[#3d5a63]",
  shipped: "bg-[#eae6f0] text-[#4b3f66]",
  delivered: "bg-[#e6efe6] text-[#3c5a3c]",
  cancelled: "bg-[#f2e4e2] text-[#7a3b34]",
  refunded: "bg-[#e6efe6] text-[#3c5a3c]",
};

const emptyAddress = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

function AddressBook({ addresses, onChange }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.post("/auth/me/addresses", form);
      onChange(res.data);
      setForm(emptyAddress);
      setAdding(false);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    const res = await api.delete(`/auth/me/addresses/${id}`);
    onChange(res.data);
  };

  return (
    <section className="border border-line bg-paper p-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h2 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow text-gold">
          <MapPin size={14} /> Saved addresses
        </h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink"
          >
            <Plus size={13} /> Add
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {addresses.length === 0 && !adding && (
          <p className="text-sm font-light text-muted">No addresses saved yet.</p>
        )}
        {addresses.map((a) => (
          <div
            key={a._id}
            className="flex items-start justify-between border border-line px-4 py-3 text-sm font-light"
          >
            <div>
              <p className="font-normal text-ink">
                {a.fullName}{" "}
                {a.isDefault && (
                  <span className="ml-1 text-[10px] uppercase tracking-[0.14em] text-gold">
                    Default
                  </span>
                )}
              </p>
              <p className="text-muted">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}, {a.city} {a.postalCode}
              </p>
              <p className="text-muted">{a.phone}</p>
            </div>
            <button
              onClick={() => remove(a._id)}
              className="text-muted hover:text-ink"
              aria-label="Delete address"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {adding && (
        <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input required placeholder="Full name" className="field" value={form.fullName} onChange={set("fullName")} />
          <input required placeholder="Phone" className="field" value={form.phone} onChange={set("phone")} />
          <input required placeholder="Address line 1" className="field sm:col-span-2" value={form.line1} onChange={set("line1")} />
          <input placeholder="Address line 2 (optional)" className="field sm:col-span-2" value={form.line2} onChange={set("line2")} />
          <input required placeholder="City" className="field" value={form.city} onChange={set("city")} />
          <input placeholder="State" className="field" value={form.state} onChange={set("state")} />
          <input required placeholder="Postal code" className="field" value={form.postalCode} onChange={set("postalCode")} />
          <input required placeholder="Country" className="field" value={form.country} onChange={set("country")} />
          <div className="flex gap-3 sm:col-span-2">
            <button disabled={busy} className="btn-primary">
              {busy ? "Saving…" : "Save address"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState(user?.addresses || []);

  const loadOrders = () => {
    setLoading(true);
    Promise.all([
      api.get("/orders/mine").then((r) => setOrders(r.data)),
      api.get("/returns/mine").then((r) => setReturns(r.data)).catch(() => {}),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const returnForOrder = (orderId) =>
    returns.find(
      (r) => r.order === orderId && !["cancelled", "rejected"].includes(r.status)
    ) || returns.find((r) => r.order === orderId);

  useEffect(loadOrders, []);
  useEffect(() => setAddresses(user?.addresses || []), [user]);

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.patch(`/orders/${id}/cancel`);
      loadOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="container-lux py-14 md:py-20">
      <header className="text-center">
        <p className="eyebrow">Your account</p>
        <h1 className="mt-3 text-4xl md:text-5xl">{user?.name}</h1>
        <div className="rule mx-auto mt-4" />
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <section className="border border-line bg-paper p-6">
            <h2 className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">
              Details
            </h2>
            <dl className="mt-4 space-y-2 text-sm font-light">
              <div className="flex justify-between">
                <dt className="text-muted">Name</dt>
                <dd>{user?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Email</dt>
                <dd className="truncate pl-4">{user?.email}</dd>
              </div>
              {user?.phone && (
                <div className="flex justify-between">
                  <dt className="text-muted">Phone</dt>
                  <dd>{user.phone}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Member since</dt>
                <dd>{formatDate(user?.createdAt)}</dd>
              </div>
            </dl>
            <button
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className="mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gold-deep hover:text-ink"
            >
              <LogOut size={13} /> Sign out
            </button>
          </section>

          <AddressBook
            addresses={addresses}
            onChange={(next) => {
              setAddresses(next);
              refreshUser();
            }}
          />
        </div>

        <section className="border border-line bg-paper p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow text-gold">
              <Package size={14} /> Orders ({orders.length})
            </h2>
            <button onClick={loadOrders} className="text-muted hover:text-ink" aria-label="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>

          {loading ? (
            <p className="py-16 text-center text-sm text-muted">Loading your orders…</p>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted">You haven't placed an order yet.</p>
              <button onClick={() => navigate("/products")} className="mt-4 btn-outline">
                Start shopping
              </button>
            </div>
          ) : (
            <ul className="mt-4 space-y-5">
              {orders.map((o) => (
                <li key={o._id} className="border border-line">
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-alabaster px-4 py-3">
                    <div>
                      <p className="text-sm">{o.orderNumber}</p>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                        {formatDate(o.createdAt)} · {o.paymentMethod === "cod" ? "Cash on delivery" : "Paid online"}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
                        STATUS_STYLES[o.status] || "bg-[#efe9dd] text-muted"
                      }`}
                    >
                      {titleCase(o.status)}
                    </span>
                  </div>
                  <div className="divide-y divide-line px-4">
                    {o.items.map((it) => (
                      <div key={it._id} className="flex items-center gap-3 py-3">
                        <div className="h-14 w-12 shrink-0 overflow-hidden bg-[#efe9dd]">
                          {it.image && <img src={it.image} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-serif">{it.name}</p>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                            {it.size} {it.unit} · Qty {it.qty}
                          </p>
                        </div>
                        <p className="text-sm tabular-nums">{formatPrice(it.price * it.qty)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-line px-4 py-3">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
                      Total
                    </span>
                    <span className="font-serif text-lg">{formatPrice(o.totalPrice)}</span>
                  </div>
                  {o.trackingNumber && (
                    <div className="border-t border-line px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-muted">
                      Tracking: <span className="text-ink">{o.trackingNumber}</span>
                      {o.carrier ? ` · ${o.carrier}` : ""}
                    </div>
                  )}
                  {["pending", "processing"].includes(o.status) && (
                    <div className="border-t border-line px-4 py-2 text-right">
                      <button
                        onClick={() => cancelOrder(o._id)}
                        className="text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
                      >
                        Cancel order
                      </button>
                    </div>
                  )}
                  <ReturnFlow
                    order={o}
                    existingReturn={returnForOrder(o._id)}
                    returnWindowDays={settings.returnWindowDays}
                    onDone={loadOrders}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
