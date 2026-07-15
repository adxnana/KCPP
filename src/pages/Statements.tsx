import { useMemo, useState } from "react";
import { FileText, Download, ChevronRight } from "lucide-react";
import { getTransactions } from "@/lib/data";
import { fmtUSD } from "@/lib/utils";

export default function Statements() {
  const txs = getTransactions();
  const [year, setYear] = useState(new Date().getFullYear());

  const years = useMemo(() => {
    const ys = new Set<number>();
    for (const t of txs) ys.add(new Date(t.date).getFullYear());
    return Array.from(ys).sort((a, b) => b - a);
  }, [txs]);

  const months = useMemo(() => {
    const arr: { label: string; month: number; income: number; spending: number; end: number }[] = [];
    for (let m = 0; m < 12; m++) {
      const monthTxs = txs.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === m;
      });
      if (!monthTxs.length && year >= new Date().getFullYear() && m > new Date().getMonth()) continue;
      const income = monthTxs.filter((t) => t.type === "credit" && t.category !== "Transfer").reduce((s, t) => s + t.amount, 0);
      const spending = monthTxs.filter((t) => t.type === "debit" && t.category !== "Transfer").reduce((s, t) => s + t.amount, 0);
      const end = monthTxs[0]?.balanceAfter ?? 0;
      arr.push({
        label: new Date(year, m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        month: m, income, spending, end,
      });
    }
    return arr.reverse();
  }, [txs, year]);

  const yearIncome = months.reduce((s, m) => s + m.income, 0);
  const yearSpending = months.reduce((s, m) => s + m.spending, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold">Statements</h1>
          <p className="text-sm text-slate-500 mt-1">Monthly and annual account statements.</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="h-10 px-4 rounded-full bg-white border border-slate-200 text-sm font-medium"
        >
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label={`${year} income`} value={fmtUSD(yearIncome)} tone="green" />
        <SummaryCard label={`${year} spending`} value={fmtUSD(yearSpending)} tone="red" />
        <SummaryCard label={`${year} net`} value={fmtUSD(yearIncome - yearSpending)} />
      </div>

      <div className="rounded-3xl bg-white border border-[color:var(--color-line)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[color:var(--color-line)] text-xs uppercase tracking-widest text-slate-500">
          Monthly statements · {year}
        </div>
        <div className="divide-y divide-[color:var(--color-line)]">
          {months.length === 0 && (
            <div className="p-10 text-center text-slate-500 text-sm">No statements available for {year}.</div>
          )}
          {months.map((m) => (
            <div key={m.month} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition">
              <div className="w-11 h-11 rounded-xl bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{m.label} statement</div>
                <div className="text-xs text-slate-500">
                  Income {fmtUSD(m.income)} · Spending {fmtUSD(m.spending)}
                </div>
              </div>
              <div className="hidden sm:block text-right text-sm">
                <div className="text-xs text-slate-500">Ending balance</div>
                <div className="font-semibold tabular-nums">{fmtUSD(m.end)}</div>
              </div>
              <button className="ml-2 h-9 px-3 rounded-full text-sm text-[color:var(--color-brand-700)] hover:bg-[color:var(--color-brand-50)] flex items-center gap-1.5">
                <Download className="w-4 h-4" /> PDF
              </button>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone?: "green" | "red" }) {
  return (
    <div className="rounded-2xl bg-white border border-[color:var(--color-line)] p-5">
      <div className="text-[11px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={"text-2xl font-semibold mt-1 tabular-nums " + (tone === "green" ? "text-emerald-600" : tone === "red" ? "text-[color:var(--color-accent-red)]" : "")}>
        {value}
      </div>
    </div>
  );
}
