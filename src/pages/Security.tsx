import { ShieldCheck, KeyRound, Smartphone, Monitor, MapPin, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

const LOGINS = [
  { device: "MacBook Pro · Safari", location: "Kerrville, TX", ip: "24.184.•••.42", when: "Just now", current: true, icon: Monitor },
  { device: "iPhone 15 · Kerr County FCU app", location: "Kerrville, TX", ip: "24.184.•••.42", when: "Yesterday, 8:12 PM", current: false, icon: Smartphone },
  { device: "iPad · Safari", location: "Hunt, TX", ip: "70.121.•••.19", when: "3 days ago", current: false, icon: Monitor },
  { device: "MacBook Pro · Chrome", location: "Austin, TX", ip: "104.7.•••.211", when: "2 weeks ago", current: false, icon: Monitor },
  { device: "iPhone 15 · Kerr County FCU app", location: "Kerrville, TX", ip: "24.184.•••.42", when: "Last month", current: false, icon: Smartphone },
];

export default function Security() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">Security</h1>
        <p className="text-sm text-slate-500 mt-1">Login activity, security settings, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-3xl bg-white p-6 border border-[color:var(--color-line)]">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="mt-3 text-xs uppercase tracking-widest text-slate-500">Security score</div>
          <div className="text-3xl font-semibold mt-1">Excellent</div>
          <p className="text-sm text-slate-500 mt-1">All recommended protections are active on your account.</p>
        </div>

        <SettingCard
          icon={KeyRound}
          title="Password"
          detail="Last changed 42 days ago"
          action="Change password"
        />
        <SettingCard
          icon={Smartphone}
          title="Two-factor authentication"
          detail="Authenticator app · SMS backup"
          action="Manage 2FA"
          on
        />
      </div>

      <div className="rounded-3xl bg-white border border-[color:var(--color-line)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[color:var(--color-line)] flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500">Recent login activity</div>
            <div className="text-lg font-semibold">Signed in as {user?.username}</div>
          </div>
          <button className="text-sm text-[color:var(--color-brand-700)] hover:underline">Sign out other devices</button>
        </div>
        <div className="divide-y divide-[color:var(--color-line)]">
          {LOGINS.map((l, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <l.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{l.device}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <MapPin className="w-3 h-3" /> {l.location} · IP {l.ip}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">{l.when}</div>
                {l.current && <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold">Current session</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 border border-[color:var(--color-line)]">
        <div className="text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notification preferences
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <NotifRow label="Email me for transactions over $10,000" on />
          <NotifRow label="Push notify all deposits" on />
          <NotifRow label="Weekly balance summary" />
          <NotifRow label="New device sign-in alerts" on />
          <NotifRow label="Statement ready email" on />
          <NotifRow label="Marketing offers" />
        </div>
      </div>
    </div>
  );
}

function SettingCard({ icon: Icon, title, detail, action, on }: { icon: typeof ShieldCheck; title: string; detail: string; action: string; on?: boolean }) {
  return (
    <div className="rounded-3xl bg-white p-6 border border-[color:var(--color-line)]">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)] flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        {on && <span className="text-[10px] uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">On</span>}
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      <div className="text-sm text-slate-500">{detail}</div>
      <button className="mt-4 h-9 px-3 rounded-full bg-slate-100 text-sm hover:bg-slate-200">{action}</button>
    </div>
  );
}

function NotifRow({ label, on }: { label: string; on?: boolean }) {
  const [state, setState] = useState(!!on);
  return (
    <button
      type="button"
      onClick={() => setState((s) => !s)}
      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:border-[color:var(--color-brand-300)]"
    >
      <span className="text-sm text-left">{label}</span>
      <span className={"w-10 h-6 rounded-full relative transition " + (state ? "bg-[color:var(--color-brand-700)]" : "bg-slate-300")}>
        <span className={"absolute top-0.5 w-5 h-5 rounded-full bg-white transition " + (state ? "left-[18px]" : "left-0.5")} />
      </span>
    </button>
  );
}
