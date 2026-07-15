import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const r = login(username, password);
      if (!r.ok) {
        setError(r.error);
        setLoading(false);
      } else {
        nav("/", { replace: true });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[color:var(--color-surface)]">
      {/* Left brand pane */}
      <div className="hidden lg:flex relative overflow-hidden bg-[color:var(--color-brand-900)] text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <div>
            <div className="text-lg font-semibold tracking-tight">Kerr County Federal Credit Union</div>
            <div className="text-xs text-white/60 uppercase tracking-[0.2em]">Private Banking</div>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight">Banking, refined for the way you live.</h1>
          <p className="mt-4 text-white/70">
            Manage your accounts, review decades of activity, and stay in control with a modern private banking experience built for members who expect more.
          </p>
        </div>
        <div className="text-xs text-white/50 relative z-10">
          © {new Date().getFullYear()} Kerr County Federal Credit Union · Insured by NCUA · Equal Housing Lender
        </div>
        {/* Decorative gradient orbs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[color:var(--color-brand-500)]/40 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-[480px] h-[480px] rounded-full bg-[color:var(--color-accent-red)]/20 blur-3xl" />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Logo size={40} />
            <div>
              <div className="text-base font-semibold">Kerr County FCU</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-widest">Private Banking</div>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your credentials to access online banking.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">Username</label>
              <div className="mt-1.5 relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your member ID"
                  className="w-full h-12 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:border-[color:var(--color-brand-500)] focus:ring-4 focus:ring-[color:var(--color-brand-500)]/10 outline-none text-sm"
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">Password</label>
              <div className="mt-1.5 relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:border-[color:var(--color-brand-500)] focus:ring-4 focus:ring-[color:var(--color-brand-500)]/10 outline-none text-sm"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="group w-full h-12 rounded-xl bg-[color:var(--color-brand-800)] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[color:var(--color-brand-700)] transition disabled:opacity-70"
            >
              {loading ? "Signing in…" : (<>Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" /></>)}
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-[color:var(--color-brand-600)]" />
              256-bit TLS encryption · Multi-factor ready · NCUA insured
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
