import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Wallet, ListOrdered, BarChart3, FileText, ShieldCheck, UserCircle2, LogOut, Bell, Search, Menu, X
} from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/transactions", label: "Transactions", icon: ListOrdered },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/statements", label: "Statements", icon: FileText },
  { to: "/security", label: "Security", icon: ShieldCheck },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const doLogout = () => { logout(); nav("/login", { replace: true }); };

  return (
    <div className="min-h-screen flex bg-[color:var(--color-surface)]">
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static z-40 inset-y-0 left-0 w-72 bg-[color:var(--color-brand-900)] text-white flex flex-col transition-transform",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <Logo size={40} />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Kerr County FCU</div>
            <div className="text-[11px] text-white/60 uppercase tracking-widest">Private Banking</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                isActive
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={doLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-[color:var(--color-line)]">
          <div className="h-16 px-4 lg:px-8 flex items-center gap-4">
            <button
              onClick={() => setOpen((s) => !s)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search transactions, merchants, amounts…"
                className="w-full h-10 pl-9 pr-3 rounded-full bg-slate-100/70 border border-transparent focus:border-[color:var(--color-brand-500)] focus:bg-white outline-none text-sm"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-slate-100" aria-label="Notifications">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[color:var(--color-accent-red)]" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[color:var(--color-brand-500)] to-[color:var(--color-brand-800)] text-white flex items-center justify-center font-semibold text-sm">
                PL
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-semibold">{user?.fullName}</div>
                <div className="text-[11px] text-slate-500">{user?.username}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}
