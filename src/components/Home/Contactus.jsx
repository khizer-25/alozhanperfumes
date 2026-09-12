import { useState } from "react";
import { Mail, Phone, MapPin, Check } from "lucide-react";
import { api } from "../../utils/api";
import useSettings from "../../hooks/useSettings";

export default function Contact({ embedded = false }) {
  const settings = useSettings();
  const Heading = embedded ? "h2" : "h1";
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      await api.post("/queries", form);
      setState("sent");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message || "Message could not be sent.");
      setState("error");
    }
  };

  return (
    <div
      id="contact"
      className={
        embedded
          ? "border-t border-line bg-[#f1ece0] py-16 md:py-24"
          : "container-lux py-16 md:py-24"
      }
    >
      <div className={`grid gap-14 lg:grid-cols-2 ${embedded ? "container-lux" : ""}`}>
        <div>
          <p className="eyebrow">Get in touch</p>
          <Heading className="mt-3 text-4xl md:text-5xl">We read every message</Heading>
          <div className="rule mt-5" />
          <p className="mt-6 max-w-md text-sm font-light leading-[1.9] text-muted">
            Questions about a fragrance, an order, or a bespoke commission? Write to us
            and someone from the atelier will reply within one working day.
          </p>

          <dl className="mt-10 space-y-5 text-sm font-light">
            <div className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 text-gold" />
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Email</dt>
                <dd>{settings.supportEmail}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 text-gold" />
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Phone</dt>
                <dd>{settings.supportPhone}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 text-gold" />
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Atelier</dt>
                <dd>{settings.address}</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="border border-line bg-paper p-8">
          {state === "sent" ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white">
                <Check size={22} />
              </div>
              <h2 className="mt-5 text-2xl">Message sent</h2>
              <p className="mt-2 text-sm font-light text-muted">
                Thank you — we'll be in touch shortly.
              </p>
              <button onClick={() => setState("idle")} className="mt-6 btn-outline">
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <p className="border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800">
                  {error}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Name</label>
                  <input required className="field" value={form.name} onChange={set("name")} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input required type="email" className="field" value={form.email} onChange={set("email")} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Phone (optional)</label>
                  <input className="field" value={form.phone} onChange={set("phone")} />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input className="field" value={form.subject} onChange={set("subject")} placeholder="General enquiry" />
                </div>
              </div>
              <div>
                <label className="label">Message</label>
                <textarea
                  required
                  className="field min-h-[140px] resize-y"
                  value={form.message}
                  onChange={set("message")}
                />
              </div>
              <button disabled={state === "sending"} className="w-full btn-primary py-4">
                {state === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
