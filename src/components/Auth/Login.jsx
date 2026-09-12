import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

const MODES = { LOGIN: "login", REGISTER: "register", FORGOT: "forgot" };

// Mirrors the backend's password policy (auth.validator.js).
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/account";

  const [mode, setMode] = useState(MODES.LOGIN);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pwChecks = PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(form.password) }));
  const passwordValid = pwChecks.every((c) => c.ok);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (mode === MODES.REGISTER && !passwordValid) {
      setPwTouched(true);
      setError("Please choose a password that meets all four requirements below.");
      return;
    }

    setBusy(true);
    try {
      if (mode === MODES.LOGIN) {
        const user = await login(form.email, form.password);
        navigate(user.role === "admin" ? "/admin" : from, { replace: true });
      } else if (mode === MODES.REGISTER) {
        const user = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          ...(form.phone ? { phone: form.phone } : {}),
        });
        navigate(user.role === "admin" ? "/admin" : from, { replace: true });
      } else {
        const res = await api.post("/auth/forgot-password", { email: form.email });
        setNotice(res.message || "If that email exists, a reset link is on its way.");
      }
    } catch (err) {
      const fieldErrors = err?.payload?.errors;
      setError(
        Array.isArray(fieldErrors) && fieldErrors.length
          ? fieldErrors.map((x) => x.message).join(" · ")
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setNotice("");
    setPwTouched(false);
    setShowPassword(false);
  };

  const heading =
    mode === MODES.LOGIN
      ? "Welcome back"
      : mode === MODES.REGISTER
      ? "Create your account"
      : "Reset your password";

  return (
    <div className="container-lux flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="eyebrow">Al Özhan</p>
          <h1 className="mt-3 text-3xl md:text-4xl">{heading}</h1>
          <div className="rule mx-auto mt-4" />
        </div>

        <div className="mt-8 border border-line bg-paper p-8">
          {error && (
            <p className="mb-5 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800">
              {error}
            </p>
          )}
          {notice && (
            <p className="mb-5 border-l-2 border-gold bg-[#f4efe4] px-4 py-3 text-xs text-gold-deep">
              {notice}
            </p>
          )}

          <form onSubmit={submit} className="space-y-5">
            {mode === MODES.REGISTER && (
              <div>
                <label className="label">Full name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                    className="field pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className="field pl-10"
                />
              </div>
            </div>

            {mode !== MODES.FORGOT && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="label">Password</label>
                  {mode === MODES.LOGIN && (
                    <button
                      type="button"
                      onClick={() => switchMode(MODES.FORGOT)}
                      className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    onBlur={() => setPwTouched(true)}
                    placeholder={mode === MODES.REGISTER ? "Create a password" : "Your password"}
                    className={`field pl-10 pr-11 ${
                      showPassword ? "" : "text-base tracking-[0.18em] placeholder:text-sm placeholder:tracking-normal"
                    }`}
                    aria-invalid={mode === MODES.REGISTER && pwTouched && !passwordValid}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {mode === MODES.REGISTER && (
                  <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1">
                    {pwChecks.map((c) => {
                      const failed = pwTouched && !c.ok;
                      return (
                        <li
                          key={c.label}
                          className={`flex items-center gap-1.5 text-[11px] font-light transition-colors ${
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
                )}
              </div>
            )}

            <button
              disabled={busy || (mode === MODES.REGISTER && !passwordValid)}
              className="w-full btn-primary py-4"
            >
              {busy
                ? "Please wait…"
                : mode === MODES.LOGIN
                ? "Sign in"
                : mode === MODES.REGISTER
                ? "Create account"
                : "Send reset link"}
              {!busy && <ArrowRight size={14} />}
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-5 text-center text-xs font-light text-muted">
            {mode === MODES.LOGIN && (
              <>
                New here?{" "}
                <button
                  onClick={() => switchMode(MODES.REGISTER)}
                  className="link-underline text-ink"
                >
                  Create an account
                </button>
              </>
            )}
            {mode === MODES.REGISTER && (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode(MODES.LOGIN)}
                  className="link-underline text-ink"
                >
                  Sign in
                </button>
              </>
            )}
            {mode === MODES.FORGOT && (
              <button
                onClick={() => switchMode(MODES.LOGIN)}
                className="link-underline text-ink"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] font-light text-muted">
          <Link to="/" className="link-underline">
            Continue browsing
          </Link>
        </p>
      </div>
    </div>
  );
}
