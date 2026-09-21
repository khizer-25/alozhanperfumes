import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { PanelHeader, EmptyState, Field } from "../ui";
import { announcementText, updateSettingsCache } from "../../../hooks/useSettings";

export default function SettingsPanel({ notify }) {
  const [form, setForm] = useState(null);
  const [state, setState] = useState("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get("/settings/admin")
      .then((res) => {
        setForm(res.data);
        setState("done");
      })
      .catch(() => setState("error"));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k, v) =>
    setForm((f) => ({ ...f, social: { ...f.social, [k]: v } }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        storeName: form.storeName,
        tagline: form.tagline,
        supportEmail: form.supportEmail,
        supportPhone: form.supportPhone,
        address: form.address,
        announcement: form.announcement,
        announcementEnabled: form.announcementEnabled,
        freeShippingThreshold: Number(form.freeShippingThreshold),
        shippingFee: Number(form.shippingFee),
        taxRatePercent: Number(form.taxRatePercent),
        codEnabled: form.codEnabled,
        codMinOrder: Number(form.codMinOrder),
        codMaxOrder: Number(form.codMaxOrder),
        returnsEnabled: form.returnsEnabled,
        returnWindowDays: Number(form.returnWindowDays),
        social: form.social,
        gstNumber: form.gstNumber,
        invoiceFooter: form.invoiceFooter,
        invoiceTerms: form.invoiceTerms,
      };
      const res = await api.put("/settings", payload);
      updateSettingsCache(res?.data || payload);
      notify("Settings saved");
    } catch (e2) {
      notify(e2.message);
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading")
    return (
      <>
        <PanelHeader title="Settings" />
        <EmptyState>Loading settings…</EmptyState>
      </>
    );
  if (state === "error" || !form)
    return (
      <>
        <PanelHeader title="Settings" />
        <EmptyState>Couldn't load settings.</EmptyState>
      </>
    );

  return (
    <>
      <PanelHeader title="Settings" subtitle="Storefront, checkout and invoice configuration" />

      <form onSubmit={save} className="max-w-3xl space-y-8">
        <section className="border border-line bg-paper p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">Store</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Store name">
              <input className="field" value={form.storeName} onChange={(e) => set("storeName", e.target.value)} />
            </Field>
            <Field label="Tagline">
              <input className="field" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            <Field label="Support email">
              <input className="field" value={form.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} />
            </Field>
            <Field label="Support phone">
              <input className="field" value={form.supportPhone} onChange={(e) => set("supportPhone", e.target.value)} />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <input className="field" value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="border border-line bg-paper p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">
            Announcement bar
          </h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-2 text-sm font-light">
              <input
                type="checkbox"
                checked={form.announcementEnabled}
                onChange={(e) => set("announcementEnabled", e.target.checked)}
                className="accent-[color:var(--gold)]"
              />
              Show the bar
            </label>
            <Field label="Message">
              <input className="field" value={form.announcement} onChange={(e) => set("announcement", e.target.value)} />
            </Field>
            <p className="text-[11px] font-light leading-relaxed text-muted">
              Type <code className="bg-alabaster px-1">{"{freeShipping}"}</code> where the free-shipping amount should
              appear, and it stays in sync with "Free shipping over" below.
            </p>
            <p className="text-[11px] font-light text-muted">
              Preview:{" "}
              <span className="uppercase tracking-[0.12em] text-ink">
                {announcementText({
                  announcement: form.announcement,
                  freeShippingThreshold: Number(form.freeShippingThreshold),
                })}
              </span>
            </p>
          </div>
        </section>

        <section className="border border-line bg-paper p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">Checkout</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Free shipping over (₹)">
              <input type="number" className="field" value={form.freeShippingThreshold} onChange={(e) => set("freeShippingThreshold", e.target.value)} />
            </Field>
            <Field label="Shipping fee (₹)">
              <input type="number" className="field" value={form.shippingFee} onChange={(e) => set("shippingFee", e.target.value)} />
            </Field>
            <Field label="Tax rate (%)">
              <input type="number" className="field" value={form.taxRatePercent} onChange={(e) => set("taxRatePercent", e.target.value)} />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-sm font-light">
              <input
                type="checkbox"
                checked={form.codEnabled}
                onChange={(e) => set("codEnabled", e.target.checked)}
                className="accent-[color:var(--gold)]"
              />
              Cash on delivery
            </label>
            <Field label="COD min order (₹)">
              <input type="number" className="field" value={form.codMinOrder} onChange={(e) => set("codMinOrder", e.target.value)} />
            </Field>
            <Field label="COD max order (₹)">
              <input type="number" className="field" value={form.codMaxOrder} onChange={(e) => set("codMaxOrder", e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="border border-line bg-paper p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">Returns</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm font-light">
              <input
                type="checkbox"
                checked={form.returnsEnabled}
                onChange={(e) => set("returnsEnabled", e.target.checked)}
                className="accent-[color:var(--gold)]"
              />
              Accept return requests
            </label>
            <Field label="Return window (days after delivery)">
              <input
                type="number"
                className="field"
                value={form.returnWindowDays}
                onChange={(e) => set("returnWindowDays", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="border border-line bg-paper p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">
            Social & invoice
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Instagram URL">
              <input className="field" value={form.social?.instagram || ""} onChange={(e) => setSocial("instagram", e.target.value)} />
            </Field>
            <Field label="Facebook URL">
              <input className="field" value={form.social?.facebook || ""} onChange={(e) => setSocial("facebook", e.target.value)} />
            </Field>
            <Field label="GST number">
              <input className="field" value={form.gstNumber} onChange={(e) => set("gstNumber", e.target.value)} />
            </Field>
            <Field label="Invoice footer" className="sm:col-span-2">
              <input className="field" value={form.invoiceFooter} onChange={(e) => set("invoiceFooter", e.target.value)} />
            </Field>
            <Field label="Return / terms line" className="sm:col-span-2">
              <input className="field" value={form.invoiceTerms} onChange={(e) => set("invoiceTerms", e.target.value)} />
            </Field>
          </div>
        </section>

        <button disabled={busy} className="btn-primary">
          {busy ? "Saving…" : "Save settings"}
        </button>
      </form>
    </>
  );
}
