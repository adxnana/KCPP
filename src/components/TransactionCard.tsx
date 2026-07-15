import { type Transaction } from "@/lib/data";
import { fmtUSD, fmtDate, cn } from "@/lib/utils";
import {
  ArrowDownLeft, ArrowUpRight, Home, Bitcoin, Plane, Gem, Briefcase, Zap, ShoppingBag, Repeat, PiggyBank, Building2
} from "lucide-react";

const ICONS: Record<string, typeof Home> = {
  Deposit: ArrowDownLeft,
  "Real Estate": Home,
  Crypto: Bitcoin,
  Travel: Plane,
  Luxury: Gem,
  Services: Briefcase,
  Utilities: Zap,
  Professional: Building2,
  Lifestyle: ShoppingBag,
  Transfer: Repeat,
  Interest: PiggyBank,
};

export default function TransactionCard({ tx }: { tx: Transaction }) {
  const Icon = ICONS[tx.category] || ArrowUpRight;
  const isCredit = tx.type === "credit";
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-[color:var(--color-line)] bg-white px-4 sm:px-5 py-3.5 hover:shadow-md hover:border-[color:var(--color-brand-200)] transition-all">
      <div className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
        isCredit ? "bg-emerald-50 text-emerald-700" : "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)]"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <div className="font-medium text-slate-900 truncate">{tx.merchant}</div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 hidden sm:inline">· {tx.category}</span>
        </div>
        <div className="text-xs text-slate-500 truncate">{tx.description}</div>
      </div>
      <div className="hidden md:block text-right text-xs text-slate-500 flex-shrink-0 w-32">
        <div>{fmtDate(tx.date)}</div>
        <div className="mt-0.5">{tx.account}</div>
      </div>
      <div className="text-right flex-shrink-0 w-32 sm:w-40">
        <div className={cn(
          "font-semibold text-sm sm:text-base tabular-nums",
          isCredit ? "text-emerald-600" : "text-slate-900"
        )}>
          {isCredit ? "+" : "−"}{fmtUSD(tx.amount)}
        </div>
        <div className="text-[11px] text-slate-400 tabular-nums">Bal {fmtUSD(tx.balanceAfter)}</div>
      </div>
    </div>
  );
}
