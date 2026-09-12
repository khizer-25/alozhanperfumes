import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const KEY = "alozhan_cookie_consent_v1";

/**
 * Reads the stored consent. Other code (e.g. an analytics loader) can call
 * `hasConsent("analytics")` before initialising non-essential scripts.
 */
export const hasConsent = (category = "analytics") => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    return saved ? !!saved[category] : false;
  } catch {
    return false;
  }
};

const store = (value) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...value, at: Date.now() }));
  } catch {
    /* ignore */
  }
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(KEY));
  }, []);

  if (!visible) return null;

  const decide = (analytics) => {
    store({ essential: true, analytics });
    setVisible(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-updated"));
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] border-t border-line bg-alabaster/98 backdrop-blur">
      <div className="container-lux flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:py-5">
        <p className="max-w-2xl text-xs font-light leading-relaxed text-muted">
          We use essential cookies to keep you signed in and remember your bag. With
          your consent we'd also use analytics cookies to understand how the site is
          used. See our{" "}
          <Link to="/legal/privacy" className="text-ink link-underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide(false)}
            className="btn border border-line px-5 py-3 hover:border-ink"
          >
            Essential only
          </button>
          <button onClick={() => decide(true)} className="btn bg-ink px-5 py-3 text-alabaster hover:bg-gold-deep">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
