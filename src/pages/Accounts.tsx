import { getBalances, getMonthlyGrowth } from "@/lib/data";
import { fmtUSD, fmtUSDShort } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Wallet, PiggyBank, ArrowUpRight, Copy } from "lucide-react";

export default function Accounts() {
  const b = getBalances();
  const growth = getMonthlyGrowth(36);

  const accounts = [
    {
      name: "Premier Checking",
      type: "Checking",
      number: "•••• •••• •••• 4712",
      balance: b.checking,
      available: b.checking,
      apy: "0.15% APY",
      icon: Wallet,
      series: growth.map((g) => ({ label: g.label, v: g.checking })),
    },
    {
      name: "Wealth Savings",
      type: "Savings",
      number: "•••• •••• •••• 9038",
      balance: b.savings,
      available: b.savings,
      apy: "3.35% APY",
      icon: PiggyBank,
      series: growth.map((g) => ({ label: g.label, v: g.savings })),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">Your accounts</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time balances, availability, and 36-month history.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {accounts.map((a) => (
          <div key={a.name} className="rounded-3xl bg-white p-6 shadow-sm border border-[color:var(--color-line)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[color:var(--color-brand-900)] text-white flex items-center justify-center">
                  <a.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    {a.number} <Copy className="w-3 h-3 opacity-60" />
                  </div>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)] font-medium">
                {a.apy}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-500">Current balance</div>
                <div className="text-2xl font-semibold tabular-nums mt-1">{fmtUSD(a.balance)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-500">Available</div>
                <div className="text-2xl font-semibold tabular-nums mt-1 text-emerald-600">{fmtUSD(a.available)}</div>
              </div>
            </div>

            <div className="h-40 mt-6">
              <ResponsiveContainer>
                <LineChart data={a.series} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={5} />
                  <YAxis tickFormatter={(v) => fmtUSDShort(v)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip formatter={(v: number) => fmtUSD(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e6ecf5" }} />
                  <Line type="monotone" dataKey="v" stroke="#144079" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Opened January 1994</span>
              <span className="inline-flex items-center gap-1 text-[color:var(--color-brand-700)]">
                View statements <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 border border-[color:var(--color-line)]">
        <div className="text-xs uppercase tracking-widest text-slate-500">Combined statistics</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          <Stat label="Total on deposit" value={fmtUSD(b.checking + b.savings)} />
          <Stat label="Monthly interest" value={fmtUSD(b.savings * 0.0028)} />
          <Stat label="12-mo growth" value="+18.4%" accent />
          <Stat label="Member since" value="1994" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={"text-lg font-semibold mt-1 tabular-nums " + (accent ? "text-emerald-600" : "")}>{value}</div>
    </div>
  );
}
