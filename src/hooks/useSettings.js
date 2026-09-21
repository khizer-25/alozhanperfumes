import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { formatPrice } from "../utils/format";

let cache = null;
let settingsPromise = null;
const listeners = new Set();

const FALLBACK = {
  storeName: "Al Özhan Perfumes",
  tagline: "Artisanal fragrances, composed by hand.",
  supportEmail: "care@alozhan.com",
  supportPhone: "+91 9010177592",
  address: "Hyderabad, Telangana, India",
  currencySymbol: "₹",
  freeShippingThreshold: 4999,
  shippingFee: 199,
  taxRatePercent: 0,
  codEnabled: true,
  onlinePaymentsEnabled: false,
  codMinOrder: 0,
  codMaxOrder: 20000,
  announcement: "Complimentary shipping on orders over {freeShipping} · Samples with every order",
  announcementEnabled: true,
  social: {},
};

const fetchSettings = () => {
  if (cache) return Promise.resolve(cache);
  if (!settingsPromise) {
    settingsPromise = api
      .get("/settings")
      .then((res) => {
        const payload = res?.data || res || {};
        cache = { ...FALLBACK, ...payload };
        return cache;
      })
      .catch(() => {
        settingsPromise = null;
        return FALLBACK;
      });
  }
  return settingsPromise;
};

/**
 * The announcement bar text. `{freeShipping}` is replaced with the current
 * "Free shipping over" amount, so changing that setting updates the bar too.
 */
export const announcementText = (s) =>
  String(s?.announcement || "").replace(/\{freeShipping\}/gi, formatPrice(s?.freeShippingThreshold));

/** Call after saving settings so every mounted component and later page shows the new values at once. */
export const updateSettingsCache = (data) => {
  cache = { ...FALLBACK, ...(cache || {}), ...(data || {}) };
  settingsPromise = Promise.resolve(cache);
  listeners.forEach((fn) => fn(cache));
};

/** Store-wide settings, fetched once and cached for the session. */
export default function useSettings() {
  const [settings, setSettings] = useState(cache || FALLBACK);

  useEffect(() => {
    let alive = true;
    fetchSettings().then((data) => {
      if (alive) setSettings(data);
    });
    const onUpdate = (data) => alive && setSettings(data);
    listeners.add(onUpdate);
    return () => {
      alive = false;
      listeners.delete(onUpdate);
    };
  }, []);

  return settings;
}
