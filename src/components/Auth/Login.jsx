import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, User, AtSign, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";
import GoogleButton, { googleSignInEnabled } from "./GoogleButton";
import VerifyOtp from "./VerifyOtp";

const MODES = { LOGIN: "login", REGISTER: "register", FORGOT: "forgot", VERIFY: "verify" };

// Mirrors the backend's password policy (auth.validator.js).
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
];

// Mirrors the backend's username rule (auth.validator.js).
const USERNAME_RE = /^[a-z0-9._]{3,30}$/;

const EMPTY_FORM = { name: "", username: "", email: "", password: "", confirmPassword: "" };

function PasswordInput({ value, onChange, onBlur, placeholder, show, onToggle, invalid }) {
  return (
    <div className="relative">
      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        required
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`field pl-10 pr-11 ${
          show ? "" : "text-base tracking-[0.18em] placeholder:text-sm placeholder:tracking-normal"
        }`}
        aria-invalid={invalid}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={onToggle}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/account";

  const [mode, setMode] = useState(MODES.LOGIN);
  const [form, setForm] = useState(EMPTY_FORM);
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pwChecks = PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(form.password) }));
  const passwordValid = pwChecks.every((c) => c.ok);
  const passwordsMatch = form.password === form.confirmPassword;
  const username = form.username.trim().toLowerCase();

  const goVerify = (email) => {
    setPendingEmail(email);
    setMode(MODES.VERIFY);
    setError("");
    setNotice("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (mode === MODES.REGISTER) {
      if (!USERNAME_RE.test(username)) {
        setError("Username must be 3-30 characters: letters, numbers, dots or underscores.");
        return;
      }
      if (!passwordValid) {
        setPwTouched(true);
        setError("Please choose a password that meets all four requirements below.");
        return;
      }
      if (!passwordsMatch) {
        setConfirmTouched(true);
        setError("Passwords don't match.");
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === MODES.LOGIN) {
        const user = await login(form.email, form.password);
        navigate(user.role === "admin" ? "/admin" : from, { replace: true });
      } else if (mode === MODES.REGISTER) {
        const res = await register({
          name: form.name,
          username,
          email: form.email,
          password: form.password,
        });
        setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
        goVerify(res?.email || form.email);
      } else {
        const res = await api.post("/auth/forgot-password", { email: form.email });
        setNotice(res.message || "If that email exists, a reset link is on its way.");
      }
    } catch (err) {
      if (err?.payload?.code === "EMAIL_NOT_VERIFIED") {
        goVerify(form.email);
        return;
      }
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

  const handleGoogle = async (credential) => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const user = await loginWithGoogle(credential);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setNotice("");
    setPwTouched(false);
    setConfirmTouched(false);
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleVerified = (message) => {
    switchMode(MODES.LOGIN);
    setForm({ ...EMPTY_FORM, email: pendingEmail });
    setNotice(message);
  };

  const heading = {
    [MODES.LOGIN]: "Welcome back",
    [MODES.REGISTER]: "Create your account",
    [MODES.FORGOT]: "Reset your password",
    [MODES.VERIFY]: "Verify your email",
  }[mode];

  return (
    <div className="container-lux flex min-h-[70vh] items-center justify-center py-16">
      <div className={`w-full ${mode === MODES.REGISTER ? "max-w-lg" : "max-w-md"}`}>
        <div className="text-center">
          <p className="eyebrow">Al Özhan</p>
          <h1 className="mt-3 text-3xl md:text-4xl">{heading}</h1>
          <div className="rule mx-auto mt-4" />
        </div>

        <div className="mt-8 border border-line bg-paper p-6 sm:p-8">
          {mode === MODES.VERIFY ? (
            <VerifyOtp
              email={pendingEmail}
              onVerified={handleVerified}
              onBack={() => switchMode(MODES.LOGIN)}
            />
          ) : (
            <>
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

              {mode !== MODES.FORGOT && googleSignInEnabled && (
                <>
                  <GoogleButton
                    text={mode === MODES.REGISTER ? "signup_with" : "continue_with"}
                    onCredential={handleGoogle}
                  />
                  <div className="my-6 flex items-center gap-4">
                    <span className="h-px flex-1 bg-line" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">or with email</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                </>
              )}

              <form onSubmit={submit} className="space-y-5">
                {mode === MODES.REGISTER && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label">Full name</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={set("name")}
                          placeholder="Your name"
                          className="field pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Username</label>
                      <div className="relative">
                        <AtSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                          required
                          autoComplete="username"
                          autoCapitalize="none"
                          spellCheck={false}
                          value={form.username}
                          onChange={set("username")}
                          placeholder="username"
                          className="field pl-10"
                        />
                      </div>
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
                      autoComplete="email"
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
                    <PasswordInput
                      value={form.password}
                      onChange={set("password")}
                      onBlur={() => setPwTouched(true)}
                      placeholder={mode === MODES.REGISTER ? "Minimum 8 characters" : "Your password"}
                      show={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                      invalid={mode === MODES.REGISTER && pwTouched && !passwordValid}
                    />

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

                {mode === MODES.REGISTER && (
                  <div>
                    <label className="label">Confirm password</label>
                    <PasswordInput
                      value={form.confirmPassword}
                      onChange={set("confirmPassword")}
                      onBlur={() => setConfirmTouched(true)}
                      placeholder="Re-enter your password"
                      show={showConfirm}
                      onToggle={() => setShowConfirm((v) => !v)}
                      invalid={confirmTouched && !passwordsMatch}
                    />
                    {confirmTouched && form.confirmPassword && !passwordsMatch && (
                      <p className="mt-2 text-[11px] font-light text-red-700">Passwords don't match.</p>
                    )}
                  </div>
                )}

                {mode === MODES.REGISTER && (
                  <p className="text-xs font-light text-muted">
                    By signing up you agree to our{" "}
                    <Link to="/legal/terms" className="link-underline text-ink">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/legal/privacy" className="link-underline text-ink">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                )}

                <button
                  disabled={
                    busy ||
                    (mode === MODES.REGISTER &&
                      (!passwordValid || !form.confirmPassword || !passwordsMatch))
                  }
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
            </>
          )}
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
