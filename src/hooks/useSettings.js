import { useEffect, useState } from "react";
import { api } from "../utils/api";

let cache = null;

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
  codMinOrder: 0,
  codMaxOrder: 20000,
  announcement: "Complimentary shipping on orders over ₹4,999",
  announcementEnabled: true,
  social: {},
};

/** Store-wide settings, fetched once and cached for the session. */
export default function useSettings() {
  const [settings, setSettings] = useState(cache || FALLBACK);

  useEffect(() => {
    if (cache) return;
    let alive = true;
    api
      .get("/settings")
      .then((res) => {
        cache = { ...FALLBACK, ...res.data };
        if (alive) setSettings(cache);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return settings;
}
