import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { api } from "../../../utils/api";
import { Field } from "../ui";

const ALLOWED_SIZES = {
  perfume: [30, 50, 100],
  attar: [3, 6, 12, 25],
};

const blank = {
  name: "",
  tagline: "",
  type: "perfume",
  gender: "unisex",
  family: "",
  description: "",
  featured: false,
  isActive: true,
  imagesText: "",
  notesTop: "",
  notesHeart: "",
  notesBase: "",
  occasions: "",
  variants: [{ size: 50, price: "", discountPrice: "", stock: "" }],
};

const fromProduct = (p) => ({
  name: p.name || "",
  tagline: p.tagline || "",
  type: p.type || "perfume",
  gender: p.gender || "unisex",
  family: p.family || "",
  description: p.description || "",
  featured: !!p.featured,
  isActive: p.isActive !== false,
  imagesText: (p.images || []).map((i) => i.url).join("\n"),
  notesTop: (p.notes?.top || []).join(", "),
  notesHeart: (p.notes?.heart || []).join(", "),
  notesBase: (p.notes?.base || []).join(", "),
  occasions: (p.occasions || []).join(", "),
  variants: (p.variants || []).map((v) => ({
    size: v.size,
    price: v.price ?? "",
    discountPrice: v.discountPrice ?? "",
    stock: v.stock ?? "",
  })),
});

const listFrom = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function ProductForm({ product, onClose, onSaved, notify }) {
  const editing = !!product;
  const [form, setForm] = useState(product ? fromProduct(product) : blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setVariant = (i, k, v) =>
    setForm((f) => ({
      ...f,
      variants: f.variants.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)),
    }));

  const addVariant = () => {
    const used = form.variants.map((v) => Number(v.size));
    const next = ALLOWED_SIZES[form.type].find((s) => !used.includes(s)) || ALLOWED_SIZES[form.type][0];
    set("variants", [...form.variants, { size: next, price: "", discountPrice: "", stock: "" }]);
  };

  const removeVariant = (i) =>
    set("variants", form.variants.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const images = listFrom(form.imagesText.replace(/\n/g, ","));
    if (!form.name.trim()) return setError("Name is required.");
    if (images.length === 0) return setError("Add at least one image URL.");
    if (form.variants.length === 0) return setError("Add at least one size.");

    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      type: form.type,
      gender: form.gender,
      family: form.family.trim(),
      description: form.description.trim(),
      featured: form.featured,
      isActive: form.isActive,
      images: images.map((url) => ({ url, alt: form.name })),
      notes: {
        top: listFrom(form.notesTop),
        heart: listFrom(form.notesHeart),
        base: listFrom(form.notesBase),
      },
      occasions: listFrom(form.occasions),
      variants: form.variants.map((v) => ({
        size: Number(v.size),
        unit: form.type === "attar" ? "ml" : "ml",
        price: Number(v.price),
        ...(v.discountPrice !== "" ? { discountPrice: Number(v.discountPrice) } : {}),
        stock: Number(v.stock || 0),
      })),
    };

    setBusy(true);
    try {
      if (editing) await api.put(`/products/${product._id}`, payload);
      else await api.post("/products", payload);
      notify(editing ? "Product updated" : "Product created");
      onSaved();
      onClose();
    } catch (e2) {
      setError(e2.payload?.errors?.[0]?.message || e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-ink/50" onClick={onClose}>
      <div
        className="h-full w-full max-w-2xl overflow-y-auto bg-alabaster p-8 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h2 className="font-serif text-2xl">{editing ? "Edit product" : "New product"}</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="mt-4 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-5">
          <Field label="Name">
            <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>

          <Field label="Tagline">
            <input className="field" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Type">
              <select
                className="field"
                value={form.type}
                onChange={(e) => {
                  const type = e.target.value;
                  set("type", type);
                  set("variants", [
                    { size: ALLOWED_SIZES[type][0], price: "", discountPrice: "", stock: "" },
                  ]);
                }}
              >
                <option value="perfume">Perfume</option>
                <option value="attar">Attar</option>
              </select>
            </Field>
            <Field label="Gender">
              <select className="field" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                <option value="unisex">Unisex</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
            </Field>
            <Field label="Family">
              <input className="field" value={form.family} onChange={(e) => set("family", e.target.value)} placeholder="Woody Oriental" />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              className="field min-h-[90px] resize-y"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <Field label="Image URLs (one per line)">
            <textarea
              className="field min-h-[70px] resize-y font-mono text-xs"
              value={form.imagesText}
              onChange={(e) => set("imagesText", e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Top notes">
              <input className="field" value={form.notesTop} onChange={(e) => set("notesTop", e.target.value)} placeholder="Bergamot, Saffron" />
            </Field>
            <Field label="Heart notes">
              <input className="field" value={form.notesHeart} onChange={(e) => set("notesHeart", e.target.value)} />
            </Field>
            <Field label="Base notes">
              <input className="field" value={form.notesBase} onChange={(e) => set("notesBase", e.target.value)} />
            </Field>
          </div>

          <Field label="Best worn (comma separated)">
            <input className="field" value={form.occasions} onChange={(e) => set("occasions", e.target.value)} placeholder="Evening, Winter" />
          </Field>

          {/* Variants */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
                Sizes & pricing
              </span>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
              >
                <Plus size={13} /> Add size
              </button>
            </div>
            <div className="space-y-2">
              {form.variants.map((v, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2">
                  <select
                    className="field"
                    value={v.size}
                    onChange={(e) => setVariant(i, "size", e.target.value)}
                  >
                    {ALLOWED_SIZES[form.type].map((s) => (
                      <option key={s} value={s}>
                        {s} ml
                      </option>
                    ))}
                  </select>
                  <input
                    className="field"
                    type="number"
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) => setVariant(i, "price", e.target.value)}
                  />
                  <input
                    className="field"
                    type="number"
                    placeholder="Sale price"
                    value={v.discountPrice}
                    onChange={(e) => setVariant(i, "discountPrice", e.target.value)}
                  />
                  <input
                    className="field"
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => setVariant(i, "stock", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="px-2 text-muted hover:text-ink"
                    aria-label="Remove size"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-light">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="accent-[color:var(--gold)]"
              />
              Featured on home
            </label>
            <label className="flex items-center gap-2 text-sm font-light">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="accent-[color:var(--gold)]"
              />
              Visible in store
            </label>
          </div>

          <div className="flex gap-3 border-t border-line pt-5">
            <button disabled={busy} className="btn-primary">
              {busy ? "Saving…" : editing ? "Save changes" : "Create product"}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
