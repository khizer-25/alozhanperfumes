import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  LogOut,
  MapPin,
  Plus,
  Trash2,
  Package,
  RefreshCw,
  Bookmark,
  LayoutGrid,
  ShieldCheck,
  Star,
  ChevronRight,
} from "lucide-react";
import { api, setAccessToken } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import useSettings from "../../hooks/useSettings";
import { formatPrice, formatDate, titleCase } from "../../utils/format";
import { getRecentlyViewed } from "../../utils/recentlyViewed";
import { WishlistGrid } from "../Wishlist";
import ReturnFlow from "./ReturnFlow";

const STATUS_STYLES = {
  pending: "bg-[#efe9dd] text-muted",
  processing: "bg-[#e8eef0] text-[#3d5a63]",
  shipped: "bg-[#eae6f0] text-[#4b3f66]",
  delivered: "bg-[#e6efe6] text-[#3c5a3c]",
  cancelled: "bg-[#f2e4e2] text-[#7a3b34]",
  refunded: "bg-[#e6efe6] text-[#3c5a3c]",
};

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Bookmark },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "security", label: "Profile & security", icon: ShieldCheck },
];

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

const Panel = ({ title, icon: Icon, action, children }) => (
  <section className="border border-line bg-paper p-6">
    <div className="flex items-center justify-between border-b border-line pb-4">
      <h2 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow text-gold">
        {Icon && <Icon size={14} />} {title}
      </h2>
      {action}
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

const Notice = ({ tone = "ok", children }) =>
  children ? (
    <p
      className={`border-l-2 px-4 py-3 text-xs ${
        tone === "ok" ? "border-[#3c5a3c] bg-[#e6efe6] text-[#3c5a3c]" : "border-red-500 bg-red-50 text-red-800"
      }`}
    >
      {children}
    </p>
  ) : null;

/* ------------------------------------------------------------------ */

function OrderCard({ order: o, existingReturn, returnWindowDays, onCancel, onChanged }) {
  return (
    <li className="border border-line">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-alabaster px-4 py-3">
        <div>
          <p className="text-sm">{o.orderNumber}</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
            {formatDate(o.createdAt)} ·{" "}
            {o.channel === "pos" ? "In store" : o.paymentMethod === "cod" ? "Cash on delivery" : "Paid online"}
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
      <div className="space-y-1 border-t border-line px-4 py-3 text-sm font-light">
        {o.taxPrice > 0 && (
          <div className="flex justify-between text-muted">
            <span>{o.taxInclusive ? "Includes GST" : "GST"}</span>
            <span className="tabular-nums">{formatPrice(o.taxPrice)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted">Total</span>
          <span className="font-serif text-lg">{formatPrice(o.totalPrice)}</span>
        </div>
      </div>
      {o.trackingNumber && (
        <div className="border-t border-line px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-muted">
          Tracking: <span className="text-ink">{o.trackingNumber}</span>
          {o.carrier ? ` · ${o.carrier}` : ""}
        </div>
      )}
      {["pending", "processing"].includes(o.status) && o.channel !== "pos" && (
        <div className="border-t border-line px-4 py-2 text-right">
          <button
            onClick={() => onCancel(o._id)}
            className="text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
          >
            Cancel order
          </button>
        </div>
      )}
      {o.channel !== "pos" && (
        <ReturnFlow order={o} existingReturn={existingReturn} returnWindowDays={returnWindowDays} onDone={onChanged} />
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */

function AddressBook({ addresses, onChange }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const run = async (fn) => {
    setError("");
    try {
      const res = await fn();
      onChange(res.data);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await run(() => api.post("/auth/me/addresses", form));
    setBusy(false);
    if (ok) {
      setForm(emptyAddress);
      setAdding(false);
    }
  };

  return (
    <Panel
      title="Saved addresses"
      icon={MapPin}
      action={
        !adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink"
          >
            <Plus size={13} /> Add
          </button>
        )
      }
    >
      <Notice tone="bad">{error}</Notice>
      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.length === 0 && !adding && (
          <p className="text-sm font-light text-muted">No addresses saved yet. Add one for a faster checkout.</p>
        )}
        {addresses.map((a) => (
          <div key={a._id} className={`flex flex-col border px-4 py-3 text-sm font-light ${a.isDefault ? "border-gold" : "border-line"}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-normal text-ink">
                {a.fullName}
                {a.isDefault && <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-gold">Default</span>}
              </p>
              <button
                onClick={() => run(() => api.delete(`/auth/me/addresses/${a._id}`))}
                className="text-muted hover:text-ink"
                aria-label={`Delete address for ${a.fullName}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <p className="mt-1 text-muted">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
            </p>
            <p className="text-muted">
              {[a.city, a.state, a.postalCode].filter(Boolean).join(", ")}
            </p>
            <p className="text-muted">{a.phone}</p>
            {!a.isDefault && (
              <button
                onClick={() => run(() => api.patch(`/auth/me/addresses/${a._id}`, { isDefault: true }))}
                className="mt-2 self-start text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
              >
                Make default
              </button>
            )}
          </div>
        ))}
      </div>

      {adding && (
        <form onSubmit={save} className="mt-5 grid gap-3 sm:grid-cols-2">
          <input required placeholder="Full name" className="field" value={form.fullName} onChange={set("fullName")} />
          <input required placeholder="Phone" className="field" value={form.phone} onChange={set("phone")} />
          <input required placeholder="Address line 1" className="field sm:col-span-2" value={form.line1} onChange={set("line1")} />
          <input placeholder="Address line 2 (optional)" className="field sm:col-span-2" value={form.line2} onChange={set("line2")} />
          <input required placeholder="City" className="field" value={form.city} onChange={set("city")} />
          <input required placeholder="State" className="field" value={form.state} onChange={set("state")} />
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
    </Panel>
  );
}

/* ------------------------------------------------------------------ */

function Security({ user, onSaved, onSignedOutEverywhere }) {
  const [details, setDetails] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [pw, setPw] = useState({ currentPassword: "", password: "", confirm: "" });
  const [msg, setMsg] = useState({ details: null, pw: null, all: null });
  const [busy, setBusy] = useState("");

  useEffect(() => setDetails({ name: user?.name || "", phone: user?.phone || "" }), [user]);

  const saveDetails = async (e) => {
    e.preventDefault();
    setBusy("details");
    try {
      await api.patch("/auth/me", { name: details.name.trim(), phone: details.phone.trim() });
      await onSaved();
      setMsg((m) => ({ ...m, details: { tone: "ok", text: "Details saved." } }));
    } catch (err) {
      setMsg((m) => ({ ...m, details: { tone: "bad", text: err.message } }));
    } finally {
      setBusy("");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pw.password !== pw.confirm) {
      setMsg((m) => ({ ...m, pw: { tone: "bad", text: "The new passwords don't match." } }));
      return;
    }
    setBusy("pw");
    try {
      const res = await api.patch("/auth/update-password", { currentPassword: pw.currentPassword, password: pw.password });
      if (res.data?.accessToken) setAccessToken(res.data.accessToken); // other devices are signed out
      setPw({ currentPassword: "", password: "", confirm: "" });
      setMsg((m) => ({ ...m, pw: { tone: "ok", text: "Password changed. Other devices have been signed out." } }));
    } catch (err) {
      setMsg((m) => ({ ...m, pw: { tone: "bad", text: err.message } }));
    } finally {
      setBusy("");
    }
  };

  const signOutAll = async () => {
    if (!window.confirm("Sign out of every device, including this one?")) return;
    setBusy("all");
    try {
      await api.post("/auth/logout-all");
      await onSignedOutEverywhere();
    } catch (err) {
      setMsg((m) => ({ ...m, all: { tone: "bad", text: err.message } }));
      setBusy("");
    }
  };

  return (
    <div className="space-y-6">
      <Panel title="Your details" icon={ShieldCheck}>
        <form onSubmit={saveDetails} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="pf-name">Name</label>
            <input id="pf-name" required minLength={2} className="field" value={details.name} onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))} />
          </div>
          <div>
            <label className="label" htmlFor="pf-phone">Phone</label>
            <input id="pf-phone" className="field" inputMode="tel" value={details.phone} onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Email</label>
            <p className="text-sm font-light">{user?.email}</p>
          </div>
          <div className="space-y-3 sm:col-span-2">
            <Notice tone={msg.details?.tone}>{msg.details?.text}</Notice>
            <button disabled={busy === "details"} className="btn-primary">
              {busy === "details" ? "Saving…" : "Save details"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Change password">
        <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="pw-cur">Current password</label>
            <input id="pw-cur" type="password" autoComplete="current-password" required className="field" value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} />
          </div>
          <div>
            <label className="label" htmlFor="pw-new">New password</label>
            <input id="pw-new" type="password" autoComplete="new-password" required minLength={8} className="field" value={pw.password} onChange={(e) => setPw((p) => ({ ...p, password: e.target.value }))} />
          </div>
          <div>
            <label className="label" htmlFor="pw-confirm">Confirm new password</label>
            <input id="pw-confirm" type="password" autoComplete="new-password" required className="field" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
          </div>
          <p className="text-xs font-light text-muted sm:col-span-3">
            At least 8 characters with upper- and lower-case letters and a number.
          </p>
          <div className="space-y-3 sm:col-span-3">
            <Notice tone={msg.pw?.tone}>{msg.pw?.text}</Notice>
            <button disabled={busy === "pw"} className="btn-primary">
              {busy === "pw" ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Sessions">
        <p className="text-sm font-light text-muted">Lost a phone or used a shared computer? Sign out everywhere at once.</p>
        <div className="mt-4 space-y-3">
          <Notice tone={msg.all?.tone}>{msg.all?.text}</Notice>
          <button onClick={signOutAll} disabled={busy === "all"} className="btn-outline">
            {busy === "all" ? "Signing out…" : "Sign out of all devices"}
          </button>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Overview({ user, orders, returns, loading, onGo }) {
  const { count: savedCount } = useWishlist();
  const recent = useMemo(() => getRecentlyViewed(), []);
  const live = orders.filter((o) => !["cancelled", "refunded"].includes(o.status));
  const spent = live.reduce((s, o) => s + (o.totalPrice || 0), 0) - orders.reduce((s, o) => s + (o.refundedAmount || 0), 0);
  const inProgress = orders.filter((o) => ["pending", "processing", "shipped"].includes(o.status));
  const openReturns = returns.filter((r) => ["requested", "approved", "received"].includes(r.status));
  const latest = orders[0];

  const tiles = [
    { label: "Orders", value: loading ? "—" : orders.length, tab: "orders" },
    { label: "On the way", value: loading ? "—" : inProgress.length, tab: "orders" },
    { label: "Saved items", value: savedCount, tab: "wishlist" },
    { label: "Total spent", value: loading ? "—" : formatPrice(Math.max(0, spent)), tab: "orders" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <button key={t.label} onClick={() => onGo(t.tab)} className="border border-line bg-paper p-5 text-left transition-colors hover:border-gold">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted">{t.label}</p>
            <p className="mt-2 font-serif text-3xl tabular-nums">{t.value}</p>
          </button>
        ))}
      </div>

      <Panel
        title="Latest order"
        icon={Package}
        action={
          orders.length > 0 && (
            <button onClick={() => onGo("orders")} className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink">
              All orders <ChevronRight size={13} />
            </button>
          )
        }
      >
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : !latest ? (
          <div className="text-center">
            <p className="text-sm text-muted">You haven't placed an order yet.</p>
            <Link to="/products" className="mt-4 inline-block btn-outline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {latest.items.slice(0, 3).map((it) => (
                <div key={it._id} className="h-14 w-12 overflow-hidden border-2 border-paper bg-[#efe9dd]">
                  {it.image && <img src={it.image} alt="" className="h-full w-full object-cover" />}
                </div>
              ))}
            </div>
            <div className="flex-1 text-sm">
              <p>{latest.orderNumber}</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                {formatDate(latest.createdAt)} · {latest.items.reduce((s, i) => s + i.qty, 0)} item(s) · {formatPrice(latest.totalPrice)}
              </p>
              {latest.trackingNumber && (
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                  Tracking {latest.trackingNumber}
                  {latest.carrier ? ` · ${latest.carrier}` : ""}
                </p>
              )}
            </div>
            <span className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${STATUS_STYLES[latest.status] || ""}`}>
              {titleCase(latest.status)}
            </span>
          </div>
        )}
        {openReturns.length > 0 && (
          <p className="mt-4 border-t border-line pt-3 text-[11px] uppercase tracking-[0.14em] text-gold-deep">
            {openReturns.length} return{openReturns.length === 1 ? "" : "s"} in progress
          </p>
        )}
      </Panel>

      {recent.length > 0 && (
        <Panel title="Recently viewed" icon={Star}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {recent.slice(0, 4).map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} className="group">
                <div className="aspect-[4/5] overflow-hidden bg-[#efe9dd]">
                  {p.image && <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />}
                </div>
                <p className="mt-2 font-serif text-base leading-tight">{p.name}</p>
                {p.startingPrice != null && <p className="text-xs text-muted">From {formatPrice(p.startingPrice)}</p>}
              </Link>
            ))}
          </div>
        </Panel>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button onClick={() => onGo("addresses")} className="flex items-center justify-between border border-line bg-paper p-5 text-left hover:border-gold">
          <span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-muted">Addresses</span>
            <span className="mt-1 block text-sm">{(user?.addresses || []).length} saved</span>
          </span>
          <ChevronRight size={16} className="text-muted" />
        </button>
        <button onClick={() => onGo("security")} className="flex items-center justify-between border border-line bg-paper p-5 text-left hover:border-gold">
          <span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-muted">Profile & security</span>
            <span className="mt-1 block text-sm">Details, password, sessions</span>
          </span>
          <ChevronRight size={16} className="text-muted" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const { count: savedCount } = useWishlist();
  const settings = useSettings();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get("tab")) ? params.get("tab") : "overview";
  const go = (id) => setParams(id === "overview" ? {} : { tab: id });

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
    returns.find((r) => r.order === orderId && !["cancelled", "rejected"].includes(r.status)) ||
    returns.find((r) => r.order === orderId);

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

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const counts = { orders: orders.length, wishlist: savedCount, addresses: addresses.length };

  return (
    <div className="container-lux py-14 md:py-20">
      <header className="text-center">
        <p className="eyebrow">Your account</p>
        <h1 className="mt-3 text-4xl md:text-5xl">{user?.name}</h1>
        <p className="mt-2 text-sm font-light text-muted">
          {user?.email} · member since {formatDate(user?.createdAt)}
        </p>
        <div className="rule mx-auto mt-4" />
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Account sections" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:border lg:border-line lg:bg-paper">
            {TABS.map(({ id, label, icon: Icon }) => (
              <li key={id} className="shrink-0">
                <button
                  onClick={() => go(id)}
                  aria-current={tab === id ? "page" : undefined}
                  className={`flex w-full items-center gap-3 whitespace-nowrap border px-4 py-3 text-left text-[11px] uppercase tracking-[0.16em] transition-colors lg:border-0 lg:border-l-2 ${
                    tab === id
                      ? "border-gold bg-alabaster text-ink lg:border-l-gold"
                      : "border-line text-muted hover:text-ink lg:border-l-transparent"
                  }`}
                >
                  <Icon size={14} />
                  <span className="flex-1">{label}</span>
                  {counts[id] > 0 && <span className="tabular-nums text-gold">{counts[id]}</span>}
                </button>
              </li>
            ))}
            <li className="shrink-0 lg:border-t lg:border-line">
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 whitespace-nowrap border border-line px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-gold-deep hover:text-ink lg:border-0"
              >
                <LogOut size={14} /> Sign out
              </button>
            </li>
          </ul>
        </nav>

        <div className="min-w-0">
          {tab === "overview" && <Overview user={user} orders={orders} returns={returns} loading={loading} onGo={go} />}

          {tab === "orders" && (
            <Panel
              title={`Orders (${orders.length})`}
              icon={Package}
              action={
                <button onClick={loadOrders} className="text-muted hover:text-ink" aria-label="Refresh orders">
                  <RefreshCw size={14} />
                </button>
              }
            >
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
                <ul className="space-y-5">
                  {orders.map((o) => (
                    <OrderCard
                      key={o._id}
                      order={o}
                      existingReturn={returnForOrder(o._id)}
                      returnWindowDays={settings.returnWindowDays}
                      onCancel={cancelOrder}
                      onChanged={loadOrders}
                    />
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {tab === "wishlist" && (
            <Panel title={`Wishlist (${savedCount})`} icon={Bookmark}>
              <WishlistGrid />
            </Panel>
          )}

          {tab === "addresses" && (
            <AddressBook
              addresses={addresses}
              onChange={(next) => {
                setAddresses(next);
                refreshUser();
              }}
            />
          )}

          {tab === "security" && (
            <Security
              user={user}
              onSaved={refreshUser}
              onSignedOutEverywhere={async () => {
                await logout();
                navigate("/login");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
