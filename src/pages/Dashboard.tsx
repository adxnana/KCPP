import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, TrendingUp, PiggyBank, Wallet, Sparkles } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { useAuth } from "@/lib/auth";
import { getBalances, getMonthlyGrowth, getTransactions, getCategoryBreakdown } from "@/lib/data";
import { fmtUSD, fmtUSDShort } from "@/lib/utils";
import TransactionCard from "@/components/TransactionCard";

const PIE_COLORS = ["#0f3160", "#c8102e", "#1f5aa0", "#4a7fbf", "#7aa4d5", "#a9c5e6", "#144079", "#9a0a23"];

export default function Dashboard() {
  const { user } = useAuth();
  const balances = getBalances();
  const growth = getMonthlyGrowth(24);
  const txs = getTransactions().slice(0, 8);
  const breakdown = getCategoryBreakdown(90);
  const monthAgoTotal = growth[growth.length - 2]?.total ?? 0;
  const total = balances.checking + balances.savings;
  const changePct = monthAgoTotal ? ((total - monthAgoTotal) / monthAgoTotal) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest">Welcome back</div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mt-1">Good to see you, {user?.fullName.split(" ")[0]}.</h1>
          <p className="text-sm text-slate-500 mt-1">Here's a snapshot of your accounts today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Sparkles className="w-4 h-4 text-[color:var(--color-accent-red)]" />
          Premier Member since 1994
        </div>
      </div>

      {/* Balance hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-[color:var(--color-brand-900)] via-[color:var(--color-brand-800)] to-[color:var(--color-brand-700)] text-white p-8 relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-[color:var(--color-accent-red)]/15 blur-2xl" />
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-white/60">Total Balance</div>
            <div className="mt-2 text-5xl font-semibold tracking-tight">{fmtUSD(total)}</div>
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-300">
              <ArrowUpRight className="w-4 h-4" />
              {changePct >= 0 ? "+" : ""}{changePct.toFixed(2)}% vs last month
            </div>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5">
                <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-widest">
                  <Wallet className="w-3.5 h-3.5" /> Checking · ••4712
                </div>
                <div className="mt-2 text-2xl font-semibold">{fmtUSD(balances.checking)}</div>
                <div className="text-xs text-white/60 mt-1">Available today</div>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5">
                <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-widest">
                  <PiggyBank className="w-3.5 h-3.5" /> Savings · ••9038
                </div>
                <div className="mt-2 text-2xl font-semibold">{fmtUSD(balances.savings)}</div>
                <div className="text-xs text-white/60 mt-1">Earning 3.35% APY</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-[color:var(--color-line)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500">Notifications</div>
              <div className="text-lg font-semibold mt-1">3 new</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[color:var(--color-brand-50)] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[color:var(--color-brand-700)]" />
            </div>
          </div>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent-red)] mt-2" />
              <div>
                <div className="font-medium">Large deposit posted</div>
                <div className="text-slate-500 text-xs">PL Roofings check cleared to Checking.</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-brand-500)] mt-2" />
              <div>
                <div className="font-medium">Statement available</div>
                <div className="text-slate-500 text-xs">Your monthly statement is ready to view.</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2" />
              <div>
                <div className="font-medium">Security check-in</div>
                <div className="text-slate-500 text-xs">Confirm your contact information is current.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Growth + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-[color:var(--color-line)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500">Account Growth</div>
              <div className="text-lg font-semibold">Last 24 months</div>
            </div>
            <Link to="/analytics" className="text-xs text-[color:var(--color-brand-700)] hover:underline">View analytics →</Link>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={growth} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f5aa0" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1f5aa0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => fmtUSDShort(v)} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={(v: number) => fmtUSD(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e6ecf5" }} />
                <Area type="monotone" dataKey="total" stroke="#144079" strokeWidth={2.5} fill="url(#totalGrad)" name="Total balance" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-[color:var(--color-line)]">
          <div className="text-xs uppercase tracking-widest text-slate-500">Spending · last 90 days</div>
          <div className="text-lg font-semibold mb-2">By category</div>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {breakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtUSD(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e6ecf5" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-[color:var(--color-line)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500">Recent activity</div>
            <div className="text-lg font-semibold">Latest transactions</div>
          </div>
          <Link to="/transactions" className="text-xs text-[color:var(--color-brand-700)] hover:underline">View all →</Link>
        </div>
        <div className="space-y-3">
          {txs.map((t) => <TransactionCard key={t.id} tx={t} />)}
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 pt-4">
        Federally insured by NCUA · Kerr County Federal Credit Union · Routing 314-••-••••
      </div>
    </div>
  );
}
