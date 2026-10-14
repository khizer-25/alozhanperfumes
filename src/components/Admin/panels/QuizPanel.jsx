import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, RotateCcw } from "lucide-react";
import { api } from "../../../utils/api";
import { useQuiz } from "../../../context/QuizContext";
import { PanelHeader, EmptyState, Field } from "../ui";

// What an answer can match on. Mirrors MATCH_FIELDS in Backend/src/models/quiz.model.js.
const FIELDS = [
  { value: "none", label: "Nothing (no filter)" },
  { value: "gender", label: "Gender" },
  { value: "type", label: "Perfume / attar" },
  { value: "family", label: "Fragrance family" },
  { value: "occasion", label: "Occasion / season" },
  { value: "note", label: "Note (any tier)" },
];
const FIXED = {
  gender: ["men", "women", "unisex"],
  type: ["perfume", "attar"],
};
const MAX_QUESTIONS = 10;
const MAX_OPTIONS = 12;

const newOption = () => ({ label: "", field: "none", value: "" });
const newQuestion = () => ({ text: "", help: "", multiple: false, options: [newOption(), newOption()] });

// Same rules as the server's scoring (contains, case-insensitive).
const matches = (p, field, value) => {
  if (!value) return false;
  const v = value.toLowerCase();
  if (field === "gender") return p.gender === v || (v !== "unisex" && p.gender === "unisex");
  if (field === "type") return p.type === v;
  if (field === "family") return (p.family || "").toLowerCase().includes(v);
  if (field === "occasion") return (p.occasions || []).some((o) => o.toLowerCase().includes(v));
  if (field === "note") {
    const n = [...(p.notes?.top || []), ...(p.notes?.heart || []), ...(p.notes?.base || [])];
    return n.some((x) => x.toLowerCase().includes(v));
  }
  return false;
};

export default function QuizPanel({ notify }) {
  const { reload } = useQuiz();
  const [form, setForm] = useState(null);
  const [products, setProducts] = useState([]);
  const [state, setState] = useState("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/quiz")
      .then((res) => {
        setForm(res.data);
        setState("done");
      })
      .catch(() => setState("error"));
    // Catalogue, for value suggestions and "matches N products" hints.
    (async () => {
      const all = [];
      for (let page = 1; page <= 20; page++) {
        const res = await api.get(`/products?limit=100&page=${page}&isActive=true`).catch(() => null);
        if (!res) break;
        all.push(...(res.data || []));
        if (page >= (res.pages || 1)) break;
      }
      setProducts(all);
    })();
  }, []);

  const suggestions = useMemo(() => {
    const fam = new Set();
    const occ = new Set();
    const notes = new Set();
    for (const p of products) {
      String(p.family || "")
        .split(/[\s/&,]+/)
        .filter((w) => w.length > 2)
        .forEach((w) => fam.add(w));
      (p.occasions || []).forEach((o) => occ.add(o));
      [...(p.notes?.top || []), ...(p.notes?.heart || []), ...(p.notes?.base || [])].forEach((n) => notes.add(n));
    }
    const sort = (s) => [...s].sort((a, b) => a.localeCompare(b));
    return { family: sort(fam), occasion: sort(occ), note: sort(notes) };
  }, [products]);

  if (state === "loading") return <EmptyState>Loading quiz…</EmptyState>;
  if (state === "error" || !form) return <EmptyState>Couldn't load the quiz.</EmptyState>;

  const questions = form.questions || [];
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setQ = (qi, patch) => set("questions", questions.map((q, i) => (i === qi ? { ...q, ...patch } : q)));
  const setO = (qi, oi, patch) =>
    setQ(qi, { options: questions[qi].options.map((o, i) => (i === oi ? { ...o, ...patch } : o)) });
  const move = (list, from, to) => {
    if (to < 0 || to >= list.length) return list;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  };

  const save = async (body = form) => {
    setBusy(true);
    setError("");
    try {
      const res = await api.put("/quiz", {
        enabled: !!body.enabled,
        title: body.title,
        subtitle: body.subtitle,
        resultsTitle: body.resultsTitle,
        ...(body.reset ? { reset: true } : { questions: body.questions }),
      });
      setForm(res.data);
      reload();
      notify?.("Scent quiz saved");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Scent quiz"
        subtitle="The optional questions first-time visitors see on the homepage. Answers decide the “Picked for you” fragrances."
        action={
          <button onClick={() => save()} disabled={busy} className="btn-primary">
            {busy ? "Saving…" : "Save quiz"}
          </button>
        }
      />

      {error && <p className="mb-6 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800">{error}</p>}

      <section className="border border-line bg-paper p-6">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[color:var(--gold)]"
            checked={!!form.enabled}
            onChange={(e) => set("enabled", e.target.checked)}
          />
          <span>
            <span className="font-medium">Show the quiz on the website</span>
            <span className="block text-xs font-light text-muted">
              When off, the popup and the homepage “Picked for you” section are hidden.
            </span>
          </span>
        </label>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Field label="Quiz title">
            <input className="field" maxLength={120} value={form.title || ""} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Intro line" className="md:col-span-2">
            <input className="field" maxLength={240} value={form.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} />
          </Field>
          <Field label="Results heading on homepage">
            <input className="field" maxLength={120} value={form.resultsTitle || ""} onChange={(e) => set("resultsTitle", e.target.value)} />
          </Field>
        </div>
      </section>

      <div className="mt-8 space-y-5">
        {questions.map((q, qi) => (
          <section key={q._id || `new-${qi}`} className="border border-line bg-paper p-6">
            <div className="flex flex-wrap items-start gap-3">
              <span className="mt-2 font-serif text-2xl text-gold">{qi + 1}</span>
              <div className="min-w-[240px] flex-1 space-y-3">
                <Field label="Question">
                  <input
                    className="field"
                    maxLength={160}
                    placeholder="e.g. Who are you shopping for?"
                    value={q.text}
                    onChange={(e) => setQ(qi, { text: e.target.value })}
                  />
                </Field>
                <Field label="Helper text (optional)">
                  <input className="field" maxLength={200} value={q.help || ""} onChange={(e) => setQ(qi, { help: e.target.value })} />
                </Field>
                <label className="flex items-center gap-2 text-sm font-light">
                  <input
                    type="checkbox"
                    className="accent-[color:var(--gold)]"
                    checked={!!q.multiple}
                    onChange={(e) => setQ(qi, { multiple: e.target.checked })}
                  />
                  Allow choosing more than one answer
                </label>
              </div>
              <div className="flex gap-1">
                <IconBtn label="Move question up" disabled={qi === 0} onClick={() => set("questions", move(questions, qi, qi - 1))}>
                  <ArrowUp size={14} />
                </IconBtn>
                <IconBtn label="Move question down" disabled={qi === questions.length - 1} onClick={() => set("questions", move(questions, qi, qi + 1))}>
                  <ArrowDown size={14} />
                </IconBtn>
                <IconBtn label="Delete question" danger onClick={() => set("questions", questions.filter((_, i) => i !== qi))}>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <div className="mb-2 hidden grid-cols-[1.2fr_1fr_1fr_90px_auto] gap-2 text-[10px] uppercase tracking-[0.14em] text-muted md:grid">
                <span>Answer shown</span>
                <span>Matches on</span>
                <span>Value</span>
                <span className="text-right">Products</span>
                <span />
              </div>
              <div className="space-y-2">
                {q.options.map((o, oi) => {
                  const count = o.field === "none" ? null : products.filter((p) => matches(p, o.field, o.value)).length;
                  return (
                    <div key={o._id || `new-${oi}`} className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_90px_auto] md:items-center">
                      <input
                        className="field"
                        placeholder="Answer label"
                        maxLength={80}
                        value={o.label}
                        onChange={(e) => setO(qi, oi, { label: e.target.value })}
                        aria-label={`Answer ${oi + 1} label`}
                      />
                      <select
                        className="field"
                        value={o.field}
                        onChange={(e) => setO(qi, oi, { field: e.target.value, value: FIXED[e.target.value]?.[0] || "" })}
                        aria-label={`Answer ${oi + 1} matches on`}
                      >
                        {FIELDS.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                      {o.field === "none" ? (
                        <span className="px-1 text-xs font-light text-muted">Doesn't filter</span>
                      ) : FIXED[o.field] ? (
                        <select className="field capitalize" value={o.value} onChange={(e) => setO(qi, oi, { value: e.target.value })} aria-label={`Answer ${oi + 1} value`}>
                          {FIXED[o.field].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="field"
                          list={`quiz-${o.field}`}
                          placeholder={o.field === "family" ? "e.g. Woody" : o.field === "occasion" ? "e.g. Evening" : "e.g. Rose"}
                          value={o.value}
                          onChange={(e) => setO(qi, oi, { value: e.target.value })}
                          aria-label={`Answer ${oi + 1} value`}
                        />
                      )}
                      <span className={`text-right text-xs tabular-nums ${count === 0 ? "text-red-700" : "text-muted"}`}>
                        {count === null ? "—" : `${count} match${count === 1 ? "" : "es"}`}
                      </span>
                      <IconBtn
                        label="Remove answer"
                        danger
                        disabled={q.options.length <= 2}
                        onClick={() => setQ(qi, { options: q.options.filter((_, i) => i !== oi) })}
                      >
                        <Trash2 size={14} />
                      </IconBtn>
                    </div>
                  );
                })}
              </div>
              {q.options.length < MAX_OPTIONS && (
                <button
                  onClick={() => setQ(qi, { options: [...q.options, newOption()] })}
                  className="mt-3 flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
                >
                  <Plus size={13} /> Add answer
                </button>
              )}
            </div>
          </section>
        ))}

        {questions.length === 0 && <EmptyState>No questions yet — add one below.</EmptyState>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => set("questions", [...questions, newQuestion()])}
            disabled={questions.length >= MAX_QUESTIONS}
            className="btn-outline flex items-center gap-2"
          >
            <Plus size={14} /> Add question
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.confirm("Replace all questions with the default four? Your edits will be lost.")) save({ ...form, reset: true });
              }}
              className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink"
            >
              <RotateCcw size={13} /> Reset to defaults
            </button>
            <button onClick={() => save()} disabled={busy} className="btn-primary">
              {busy ? "Saving…" : "Save quiz"}
            </button>
          </div>
        </div>
        <p className="text-xs font-light text-muted">
          Up to {MAX_QUESTIONS} questions, 2–{MAX_OPTIONS} answers each. “Matches” counts live products; a value matches when it
          appears anywhere in that attribute (e.g. “Woody” matches “Woody Oriental”). To preview, open the homepage and click
          “Take the scent quiz”.
        </p>
      </div>

      {["family", "occasion", "note"].map((k) => (
        <datalist key={k} id={`quiz-${k}`}>
          {suggestions[k].map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
      ))}
    </div>
  );
}

function IconBtn({ label, onClick, disabled, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors disabled:opacity-30 ${
        danger ? "hover:border-red-300 hover:text-red-700" : "hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
