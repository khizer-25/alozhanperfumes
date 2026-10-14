import { useState } from "react";
import { Mail, Phone, MapPin, Check, Navigation } from "lucide-react";
import { api } from "../../utils/api";
import useSettings from "../../hooks/useSettings";
import Seo from "../common/Seo";

// Golconda Fort, Hyderabad. Keyless Google Maps embed — no API key or billing needed.
// Centring on coordinates (not searching a place) keeps Google's place card off
// the map; our own pin marks the centre instead.
const MAP_PLACE = "Golconda Fort, Hyderabad, Telangana";
const MAP_LAT = 17.3833091;
const MAP_LNG = 78.4010522;
const MAP_EMBED = `https://maps.google.com/maps?ll=${MAP_LAT},${MAP_LNG}&z=16&t=m&hl=en&output=embed`;
const MAP_VIEW = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_PLACE)}`;
const MAP_LINK = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_PLACE)}`;

function LocationMap() {
  return (
    <div className="flex h-full flex-col">
      <a
        href={MAP_VIEW}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Golconda Fort, Hyderabad in Google Maps"
        className="group relative block min-h-[320px] flex-1 overflow-hidden border border-line bg-[#efe9dd]"
      >
        {/* The map is a fixed view (no panning) so the pin always sits on the fort. */}
        <iframe
          title="Map showing Golconda Fort, Hyderabad"
          src={MAP_EMBED}
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 h-full w-full grayscale-[35%] sepia-[15%]"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-full">
          <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-gold/50" />
          <svg width="34" height="42" viewBox="0 0 34 42" className="relative block drop-shadow-md">
            <path d="M17 41s15-14.2 15-25A15 15 0 0 0 2 16c0 10.8 15 25 15 25Z" fill="#1C1A17" />
            <circle cx="17" cy="16" r="5.5" fill="#C9B48C" />
          </svg>
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 bg-paper/95 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          View larger map
        </span>
      </a>
      <a
        href={MAP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-2 self-start text-[11px] font-medium uppercase tracking-[0.16em] link-underline"
      >
        <Navigation size={13} /> Get directions
      </a>
    </div>
  );
}

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
      {!embedded && (
        <Seo
          title="Contact Us"
          description="Get in touch with Al Özhan Perfumes — questions about fragrances, orders, shipping or returns."
        />
      )}
      <div className={embedded ? "container-lux" : ""}>
        <div className="border border-line bg-paper p-6 md:p-10">
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
            <form onSubmit={submit} className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-2xl md:text-3xl">Send us a message</h2>
                <p className="text-xs font-light text-muted">We reply within one working day.</p>
              </div>
              {error && (
                <p className="border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800">
                  {error}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="label">Name</label>
                  <input required className="field" value={form.name} onChange={set("name")} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input required type="email" className="field" value={form.email} onChange={set("email")} />
                </div>
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
                  className="field min-h-[130px] resize-y"
                  value={form.message}
                  onChange={set("message")}
                />
              </div>
              <button disabled={state === "sending"} className="w-full btn-primary px-12 py-4 sm:ml-auto sm:flex sm:w-auto">
                {state === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className={`mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16 ${embedded ? "container-lux" : ""}`}>
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
        <LocationMap />
      </div>
    </div>
  );
}
