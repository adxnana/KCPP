import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { getMonthlyGrowth, getMonthlyCashflow, getCategoryBreakdown } from "@/lib/data";
import { fmtUSD, fmtUSDShort } from "@/lib/utils";

const PIE_COLORS = ["#0f3160", "#c8102e", "#1f5aa0", "#4a7fbf", "#7aa4d5", "#a9c5e6", "#144079", "#9a0a23"];

export default function Analytics() {
  const growth = getMonthlyGrowth(60);
  const cashflow = getMonthlyCashflow(12);
  const cats = getCategoryBreakdown(365);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Long-term account growth, cash flow, and spending patterns.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 border border-[color:var(--color-line)]">
        <div className="text-xs uppercase tracking-widest text-slate-500">Account growth</div>
        <div className="text-lg font-semibold mb-3">Last 60 months</div>
        <div className="h-80">
          <ResponsiveContainer>
            <AreaChart data={growth}>
              <defs>
                <linearGradient id="chk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8102e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c8102e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sav" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#144079" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#144079" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} interval={5} />
              <YAxis tickFormatter={(v) => fmtUSDShort(v)} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip formatter={(v: number) => fmtUSD(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e6ecf5" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="savings" stroke="#144079" strokeWidth={2} fill="url(#sav)" name="Savings" />
              <Area type="monotone" dataKey="checking" stroke="#c8102e" strokeWidth={2} fill="url(#chk)" name="Checking" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 border border-[color:var(--color-line)]">
          <div className="text-xs uppercase tracking-widest text-slate-500">Cash flow</div>
          <div className="text-lg font-semibold mb-3">Income vs. spending — last 12 months</div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={cashflow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => fmtUSDShort(v)} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={(v: number) => fmtUSD(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e6ecf5" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" fill="#144079" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="spending" fill="#c8102e" radius={[6, 6, 0, 0]} name="Spending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-[color:var(--color-line)]">
          <div className="text-xs uppercase tracking-widest text-slate-500">Spending mix</div>
          <div className="text-lg font-semibold mb-2">Last 12 months</div>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={cats} dataKey="value" nameKey="name" innerRadius={50} outerRadius={95} paddingAngle={2}>
                  {cats.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtUSD(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e6ecf5" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 border border-[color:var(--color-line)]">
        <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">Top categories · trailing year</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {cats.slice(0, 8).map((c, i) => {
            const max = cats[0].value;
            return (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span>{c.name}</span>
                    <span className="tabular-nums font-medium">{fmtUSD(c.value)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(c.value / max) * 100}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
