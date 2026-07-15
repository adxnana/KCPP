import { useMemo, useState } from "react";
import { Search, Filter, Download, ChevronDown } from "lucide-react";
import { getTransactions, type Transaction, type TxCategory } from "@/lib/data";
import TransactionCard from "@/components/TransactionCard";
import { cn } from "@/lib/utils";

const CATEGORIES: (TxCategory | "All")[] = [
  "All","Deposit","Real Estate","Crypto","Travel","Luxury","Services","Utilities","Professional","Lifestyle","Transfer","Interest",
];

export default function Transactions() {
  const all = getTransactions();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<TxCategory | "All">("All");
  const [acct, setAcct] = useState<"All" | "Checking" | "Savings">("All");
  const [type, setType] = useState<"All" | "credit" | "debit">("All");
  const [visible, setVisible] = useState(60);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (acct !== "All" && t.account !== acct) return false;
      if (type !== "All" && t.type !== type) return false;
      if (!q) return true;
      return (
        t.merchant.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        String(t.amount).includes(q)
      );
    });
  }, [all, query, cat, acct, type]);

  // Group by month for scrolling rhythm
  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of filtered.slice(0, visible)) {
      const d = new Date(t.date);
      const key = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries());
  }, [filtered, visible]);

  const totalDebit = filtered.reduce((s, t) => s + (t.type === "debit" ? t.amount : 0), 0);
  const totalCredit = filtered.reduce((s, t) => s + (t.type === "credit" ? t.amount : 0), 0);

  const exportCsv = () => {
    const rows = [
      ["Date","Merchant","Description","Category","Account","Type","Amount","Balance After"],
      ...filtered.map((t) => [t.date, t.merchant, t.description, t.category, t.account, t.type, t.amount, t.balanceAfter]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "kcfcu-transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length.toLocaleString()} of {all.length.toLocaleString()} activities across your accounts.
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="h-10 px-4 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-[color:var(--color-brand-500)] flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryChip label="Filtered results" value={filtered.length.toLocaleString()} />
        <SummaryChip label="Money in" value={totalCredit.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} accent="green" />
        <SummaryChip label="Money out" value={totalDebit.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} accent="red" />
        <SummaryChip label="Net" value={(totalCredit - totalDebit).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} />
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-4 border border-[color:var(--color-line)] flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchants, descriptions, amounts…"
            className="w-full h-10 pl-9 pr-3 rounded-full bg-slate-100/70 border border-transparent focus:border-[color:var(--color-brand-500)] focus:bg-white outline-none text-sm"
          />
        </div>
        <FilterSelect label="Category" value={cat} onChange={(v) => setCat(v as TxCategory | "All")} options={CATEGORIES} />
        <FilterSelect label="Account" value={acct} onChange={(v) => setAcct(v as "All" | "Checking" | "Savings")} options={["All","Checking","Savings"]} />
        <FilterSelect label="Type" value={type} onChange={(v) => setType(v as "All" | "credit" | "debit")} options={["All","credit","debit"]} />
      </div>

      {/* Feed */}
      <div className="space-y-8">
        {groups.map(([month, list]) => (
          <div key={month}>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
              <span>{month}</span>
              <span className="text-slate-300">·</span>
              <span>{list.length} activities</span>
            </div>
            <div className="space-y-3">
              {list.map((t) => <TransactionCard key={t.id} tx={t} />)}
            </div>
          </div>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="text-center pt-2">
          <button
            onClick={() => setVisible((v) => v + 60)}
            className="h-10 px-6 rounded-full bg-[color:var(--color-brand-800)] text-white text-sm hover:bg-[color:var(--color-brand-700)]"
          >
            Load more transactions
          </button>
        </div>
      )}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Filter className="w-8 h-8 mx-auto mb-3 opacity-40" />
          No transactions match your filters.
        </div>
      )}
    </div>
  );
}

function SummaryChip({ label, value, accent }: { label: string; value: string; accent?: "green" | "red" }) {
  return (
    <div className="rounded-2xl bg-white border border-[color:var(--color-line)] p-4">
      <div className="text-[11px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={cn(
        "text-lg font-semibold mt-1 tabular-nums",
        accent === "green" && "text-emerald-600",
        accent === "red" && "text-[color:var(--color-accent-red)]"
      )}>{value}</div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-10 pl-4 pr-9 rounded-full bg-slate-100/70 border border-transparent focus:border-[color:var(--color-brand-500)] focus:bg-white outline-none text-sm capitalize cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{label}: {o}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </label>
  );
}
