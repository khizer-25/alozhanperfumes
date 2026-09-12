import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  api,
  setAccessToken,
  getAccessToken,
  setAuthLostHandler,
} from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authed | guest

  const loadMe = useCallback(async () => {
    const res = await api.get("/auth/me");
    setUser(res.data);
    setStatus("authed");
    return res.data;
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus("guest");
  }, []);

  // Wire the api client's "refresh failed" hook to our state.
  useEffect(() => {
    setAuthLostHandler(clearSession);
  }, [clearSession]);

  // Bootstrap: use a stored token, or try the refresh cookie.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (getAccessToken()) {
          await loadMe();
          return;
        }
        // No token — attempt a silent refresh via the httpOnly cookie.
        const res = await api.post("/auth/refresh");
        if (res?.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          await loadMe();
          return;
        }
        if (!cancelled) setStatus("guest");
      } catch {
        if (!cancelled) clearSession();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadMe, clearSession]);

  const login = useCallback(
    async (email, password) => {
      const res = await api.post("/auth/login", { email, password });
      setAccessToken(res.data.accessToken);
      return loadMe();
    },
    [loadMe]
  );

  const register = useCallback(
    async (payload) => {
      const res = await api.post("/auth/register", payload);
      setAccessToken(res.data.accessToken);
      return loadMe();
    },
    [loadMe]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    clearSession();
  }, [clearSession]);

  const refreshUser = useCallback(async () => {
    try {
      return await loadMe();
    } catch {
      return null;
    }
  }, [loadMe]);

  const value = {
    user,
    status,
    isLoading: status === "loading",
    isAuthed: status === "authed",
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    refreshUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
