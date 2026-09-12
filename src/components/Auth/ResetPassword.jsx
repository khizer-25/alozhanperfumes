import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import { api } from "../../utils/api";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
];

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const checks = PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(password) }));
  const valid = checks.every((c) => c.ok);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched(true);
    if (!valid) return setError("Your password doesn't meet all the requirements below.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 2200);
    } catch (err) {
      const fieldErrors = err?.payload?.errors;
      setError(
        Array.isArray(fieldErrors) && fieldErrors.length
          ? fieldErrors.map((x) => x.message).join(" · ")
          : err.message || "This reset link is invalid or has expired."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-lux flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="eyebrow">Al Özhan</p>
          <h1 className="mt-3 text-3xl md:text-4xl">Set a new password</h1>
          <div className="rule mx-auto mt-4" />
        </div>

        <div className="mt-8 border border-line bg-paper p-8">
          {!token ? (
            <p className="text-sm font-light text-muted">
              This link is missing its token. Request a new one from the{" "}
              <Link to="/login" className="link-underline text-ink">
                sign-in page
              </Link>
              .
            </p>
          ) : done ? (
            <p className="border-l-2 border-gold bg-[#f4efe4] px-4 py-3 text-sm text-gold-deep">
              Your password has been reset. Redirecting you to sign in…
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              {error && (
                <p className="border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800">
                  {error}
                </p>
              )}

              <div>
                <label className="label">New password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    required
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched(true)}
                    className={`field pl-10 pr-11 ${
                      show ? "" : "text-base tracking-[0.18em] placeholder:text-sm placeholder:tracking-normal"
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1">
                  {checks.map((c) => {
                    const failed = touched && !c.ok;
                    return (
                      <li
                        key={c.label}
                        className={`flex items-center gap-1.5 text-[11px] font-light ${
                          c.ok ? "text-gold-deep" : failed ? "text-red-700" : "text-muted"
                        }`}
                      >
                        {c.ok ? (
                          <Check size={12} strokeWidth={2.5} />
                        ) : (
                          <span className="inline-block h-1 w-1 rounded-full bg-current opacity-60" />
                        )}
                        {c.label}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <label className="label">Confirm password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    required
                    type={show ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`field pl-10 ${show ? "" : "text-base tracking-[0.18em]"}`}
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <button disabled={busy || !valid} className="w-full btn-primary py-4">
                {busy ? "Saving…" : "Reset password"}
                {!busy && <ArrowRight size={14} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
