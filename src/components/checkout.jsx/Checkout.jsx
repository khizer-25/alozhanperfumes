import { useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, ChevronLeft, ShieldCheck } from "lucide-react";
import { api } from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import useSettings from "../../hooks/useSettings";
import { formatPrice } from "../../utils/format";

const blankAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();

  const saved = user?.addresses || [];
  const [step, setStep] = useState("address"); // address | payment | done
  const [selectedAddrId, setSelectedAddrId] = useState(
    saved.find((a) => a.isDefault)?._id || saved[0]?._id || "new"
  );
  const [form, setForm] = useState({
    ...blankAddress,
    fullName: user?.name || "",
    phone: user?.phone || "",
  });
  const [payment, setPayment] = useState("cod");
  const [placed, setPlaced] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // One stable key per checkout session so a retry / double-click can't create
  // two orders (the API dedupes on it).
  const idempotencyKey = useRef(
    (crypto.randomUUID && crypto.randomUUID()) || `ck-${Date.now()}-${Math.random()}`
  );

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const shipping = useMemo(
    () => (subtotal >= (settings.freeShippingThreshold || Infinity) ? 0 : settings.shippingFee || 0),
    [subtotal, settings]
  );
  const tax = Math.round((subtotal * (settings.taxRatePercent || 0)) / 100);
  const total = subtotal + shipping + tax;

  const codBlocked =
    payment === "cod" &&
    (!settings.codEnabled ||
      total < (settings.codMinOrder || 0) ||
      (settings.codMaxOrder && total > settings.codMaxOrder));

  const activeAddress =
    selectedAddrId === "new"
      ? form
      : saved.find((a) => a._id === selectedAddrId) || form;

  const addressValid =
    activeAddress.fullName &&
    activeAddress.phone &&
    activeAddress.line1 &&
    activeAddress.city &&
    activeAddress.postalCode;

  const placeOrder = async () => {
    setBusy(true);
    setError("");
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          qty: i.qty,
        })),
        shippingAddress: {
          fullName: activeAddress.fullName,
          phone: activeAddress.phone,
          line1: activeAddress.line1,
          line2: activeAddress.line2 || "",
          city: activeAddress.city,
          state: activeAddress.state || "",
          postalCode: activeAddress.postalCode,
          country: activeAddress.country || "India",
        },
        paymentMethod: payment,
      };
      const res = await api.post("/orders", payload, {
        headers: { "Idempotency-Key": idempotencyKey.current },
      });
      setPlaced(res.data);
      setStep("done");
      clearCart();
    } catch (e) {
      setError(e.message || "We couldn't place your order.");
    } finally {
      setBusy(false);
    }
  };

  if (step === "done" && placed) {
    return (
      <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white">
          <Check size={24} />
        </div>
        <h1 className="mt-6 text-4xl">Order confirmed</h1>
        <div className="rule mx-auto mt-4" />
        <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-muted">
          Thank you, {activeAddress.fullName.split(" ")[0]}. Your order{" "}
          <span className="text-ink">{placed.orderNumber}</span> is being prepared at the
          atelier. We've emailed a confirmation to {user?.email}.
        </p>
        <p className="mt-2 font-serif text-2xl">{formatPrice(placed.totalPrice)}</p>
        <div className="mt-8 flex gap-3">
          <Link to="/account" className="btn-primary">
            Track this order
          </Link>
          <Link to="/products" className="btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-lux flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-3xl">Your bag is empty</h1>
        <Link to="/products" className="mt-6 btn-outline">
          Browse fragrances
        </Link>
      </div>
    );
  }

  return (
    <div className="container-lux py-14 md:py-20">
      <button
        onClick={() => (step === "payment" ? setStep("address") : navigate(-1))}
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
      >
        <ChevronLeft size={14} /> {step === "payment" ? "Back to address" : "Back"}
      </button>

      <header className="mt-6 text-center">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-2 text-4xl md:text-5xl">
          {step === "address" ? "Where should it go?" : "Review & pay"}
        </h1>
        <div className="rule mx-auto mt-4" />
      </header>

      {error && (
        <p className="mx-auto mt-8 max-w-2xl border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800">
          {error}
        </p>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {step === "address" && (
            <div className="space-y-6">
              {saved.length > 0 && (
                <div className="space-y-3">
                  {saved.map((a) => (
                    <label
                      key={a._id}
                      className={`flex cursor-pointer items-start gap-3 border px-4 py-3 text-sm ${
                        selectedAddrId === a._id ? "border-ink" : "border-line"
                      }`}
                    >
                      <input
                        type="radio"
                        name="addr"
                        checked={selectedAddrId === a._id}
                        onChange={() => setSelectedAddrId(a._id)}
                        className="mt-1 accent-[color:var(--gold)]"
                      />
                      <span className="font-light">
                        <span className="block font-normal text-ink">{a.fullName}</span>
                        {a.line1}
                        {a.line2 ? `, ${a.line2}` : ""}, {a.city} {a.postalCode}
                        <span className="block text-muted">{a.phone}</span>
                      </span>
                    </label>
                  ))}
                  <label
                    className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm ${
                      selectedAddrId === "new" ? "border-ink" : "border-line"
                    }`}
                  >
                    <input
                      type="radio"
                      name="addr"
                      checked={selectedAddrId === "new"}
                      onChange={() => setSelectedAddrId("new")}
                      className="accent-[color:var(--gold)]"
                    />
                    Use a new address
                  </label>
                </div>
              )}

              {selectedAddrId === "new" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required placeholder="Full name" className="field" value={form.fullName} onChange={set("fullName")} />
                  <input required placeholder="Phone" className="field" value={form.phone} onChange={set("phone")} />
                  <input required placeholder="Address line 1" className="field sm:col-span-2" value={form.line1} onChange={set("line1")} />
                  <input placeholder="Address line 2 (optional)" className="field sm:col-span-2" value={form.line2} onChange={set("line2")} />
                  <input required placeholder="City" className="field" value={form.city} onChange={set("city")} />
                  <input placeholder="State" className="field" value={form.state} onChange={set("state")} />
                  <input required placeholder="Postal code" className="field" value={form.postalCode} onChange={set("postalCode")} />
                  <input required placeholder="Country" className="field" value={form.country} onChange={set("country")} />
                </div>
              )}

              <button
                disabled={!addressValid}
                onClick={() => setStep("payment")}
                className="w-full btn-primary py-4"
              >
                Continue to payment
              </button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <div className="border border-line p-4 text-sm font-light">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Shipping to</p>
                <p className="mt-1 text-ink">{activeAddress.fullName}</p>
                <p className="text-muted">
                  {activeAddress.line1}
                  {activeAddress.line2 ? `, ${activeAddress.line2}` : ""}, {activeAddress.city}{" "}
                  {activeAddress.postalCode}
                </p>
                <button
                  onClick={() => setStep("address")}
                  className="mt-2 text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
                >
                  Change
                </button>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-start gap-3 border px-4 py-3 text-sm ${
                    payment === "cod" ? "border-ink" : "border-line"
                  }`}
                >
                  <input
                    type="radio"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                    className="mt-1 accent-[color:var(--gold)]"
                  />
                  <span className="font-light">
                    <span className="block font-normal text-ink">Cash on delivery</span>
                    Pay the courier when your order arrives.
                  </span>
                </label>
                <label
                  className={`flex cursor-pointer items-start gap-3 border px-4 py-3 text-sm ${
                    payment === "online" ? "border-ink" : "border-line"
                  }`}
                >
                  <input
                    type="radio"
                    checked={payment === "online"}
                    onChange={() => setPayment("online")}
                    className="mt-1 accent-[color:var(--gold)]"
                  />
                  <span className="font-light">
                    <span className="block font-normal text-ink">Pay online</span>
                    Secure card / UPI checkout (simulated in this demo — marked paid instantly).
                  </span>
                </label>
              </div>

              {codBlocked && (
                <p className="border-l-2 border-gold bg-[#f4efe4] px-4 py-3 text-xs text-gold-deep">
                  Cash on delivery isn't available for this order total. Please choose Pay online.
                </p>
              )}

              <button
                disabled={busy || codBlocked}
                onClick={placeOrder}
                className="w-full btn-primary py-4"
              >
                {busy ? "Placing order…" : `Place order · ${formatPrice(total)}`}
              </button>
              <p className="flex items-center justify-center gap-2 text-[11px] font-light text-muted">
                <ShieldCheck size={13} className="text-gold" /> Your details are used only to
                fulfil this order.
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit border border-line bg-paper p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">
            Order summary
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {items.map((i) => (
              <li key={i.key} className="flex gap-3 py-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-[#efe9dd]">
                  <img src={i.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-alabaster">
                    {i.qty}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center text-sm">
                  <p className="font-serif leading-tight">{i.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                    {i.sizeLabel}
                  </p>
                </div>
                <p className="self-center text-sm tabular-nums">
                  {formatPrice(i.price * i.qty)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm font-light">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            {tax > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Tax</dt>
                <dd className="tabular-nums">{formatPrice(tax)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2 text-base">
              <dt>Total</dt>
              <dd className="font-serif text-xl tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
