import { useEffect, useState } from "react";
import { api } from "../utils/api";

let cache = null;
let settingsPromise = null;

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
  announcement: "Complimentary shipping on orders over ₹4,999",
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

/** Store-wide settings, fetched once and cached for the session. */
export default function useSettings() {
  const [settings, setSettings] = useState(cache || FALLBACK);

  useEffect(() => {
    let alive = true;
    fetchSettings().then((data) => {
      if (alive) setSettings(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return settings;
}
