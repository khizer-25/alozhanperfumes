import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "./AuthContext";

/**
 * Wishlist of product ids.
 *  - Signed out: kept in localStorage so shoppers can still save things.
 *  - Signed in: stored on the account (/auth/me/wishlist). Anything saved while
 *    signed out is merged into the account once, right after sign-in.
 */
const WishlistContext = createContext(null);
const KEY = "alozhan_wishlist_v1";

const readLocal = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
};
const writeLocal = (ids) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage blocked */
  }
};

export function WishlistProvider({ children }) {
  const { user, isAuthed, status } = useAuth();
  const [ids, setIds] = useState(readLocal);
  const merged = useRef(null); // user id we've already synced

  // On sign-in: merge the guest list into the account, then use the account's list.
  useEffect(() => {
    if (status === "loading") return;
    if (!isAuthed) {
      merged.current = null;
      setIds(readLocal());
      return;
    }
    if (merged.current === user?._id) return;
    merged.current = user?._id;

    const local = readLocal();
    const fromAccount = (user?.wishlist || []).map(String);
    setIds([...new Set([...fromAccount, ...local])]);
    if (local.length) {
      api
        .post("/auth/me/wishlist/merge", { productIds: local })
        .then((res) => {
          setIds((res.data || []).map(String));
          writeLocal([]);
        })
        .catch(() => {});
    }
  }, [isAuthed, status, user]);

  const has = useCallback((productId) => ids.includes(String(productId)), [ids]);

  const toggle = useCallback(
    async (productId) => {
      const id = String(productId);
      const saving = !ids.includes(id);
      const next = saving ? [...ids, id] : ids.filter((x) => x !== id);
      setIds(next); // optimistic

      if (!isAuthed) {
        writeLocal(next);
        return saving;
      }
      try {
        const res = saving
          ? await api.post(`/auth/me/wishlist/${id}`)
          : await api.delete(`/auth/me/wishlist/${id}`);
        setIds((res.data || []).map(String));
      } catch {
        setIds(ids); // roll back
      }
      return saving;
    },
    [ids, isAuthed]
  );

  return (
    <WishlistContext.Provider value={{ ids, count: ids.length, has, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
