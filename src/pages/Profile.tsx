import { useAuth } from "@/lib/auth";
import { Mail, Phone, MapPin, User2, Building2, Save } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "Paul Lynch",
    email: "paul.lynch@plroofings.com",
    phone: "(830) 555-0142",
    address: "1420 Ranch Rd, Kerrville, TX 78028",
    employer: "PL Roofings",
    memberSince: "January 1994",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Account holder information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-3xl bg-gradient-to-br from-[color:var(--color-brand-900)] to-[color:var(--color-brand-700)] text-white p-6">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-semibold">PL</div>
          <div className="mt-4 text-xl font-semibold">{form.fullName}</div>
          <div className="text-sm text-white/70">Member ID · {user?.username}</div>
          <div className="mt-6 space-y-2 text-sm text-white/80">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {form.email}</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {form.phone}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {form.address}</div>
            <div className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {form.employer}</div>
          </div>
          <div className="mt-6 text-xs text-white/60">Member since {form.memberSince}</div>
        </div>

        <form onSubmit={submit} className="lg:col-span-2 rounded-3xl bg-white p-6 border border-[color:var(--color-line)] space-y-4">
          <div className="text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <User2 className="w-4 h-4" /> Personal information
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} />
            <Field label="Email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <Field label="Employer" value={form.employer} onChange={(v) => setForm((f) => ({ ...f, employer: v }))} />
            <div className="sm:col-span-2">
              <Field label="Mailing address" value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} />
            </div>
          </div>
          <div className="text-xs uppercase tracking-widest text-slate-500 pt-4">Preferences</div>
          <div className="space-y-3">
            <Toggle label="Paperless statements" defaultOn />
            <Toggle label="Marketing communications" />
            <Toggle label="SMS transaction alerts" defaultOn />
            <Toggle label="Weekly account summary email" defaultOn />
          </div>
          <div className="pt-2 flex items-center gap-3">
            <button className="h-11 px-5 rounded-full bg-[color:var(--color-brand-800)] text-white text-sm font-medium hover:bg-[color:var(--color-brand-700)] inline-flex items-center gap-2">
              <Save className="w-4 h-4" /> Save changes
            </button>
            {saved && <span className="text-sm text-emerald-600">Preferences saved.</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-200 focus:border-[color:var(--color-brand-500)] focus:ring-4 focus:ring-[color:var(--color-brand-500)]/10 outline-none text-sm"
      />
    </label>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn((s) => !s)}
      className="w-full flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:border-[color:var(--color-brand-300)]"
    >
      <span className="text-sm">{label}</span>
      <span className={"w-10 h-6 rounded-full relative transition " + (on ? "bg-[color:var(--color-brand-700)]" : "bg-slate-300")}>
        <span className={"absolute top-0.5 w-5 h-5 rounded-full bg-white transition " + (on ? "left-[18px]" : "left-0.5")} />
      </span>
    </button>
  );
}
