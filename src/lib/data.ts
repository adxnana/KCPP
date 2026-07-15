// Deterministic 30+ year transaction history generator.
// All amounts fictional. No real financial data.

export type TxCategory =
  | "Deposit"
  | "Real Estate"
  | "Crypto"
  | "Travel"
  | "Luxury"
  | "Services"
  | "Utilities"
  | "Professional"
  | "Lifestyle"
  | "Transfer"
  | "Interest";

export interface Transaction {
  id: string;
  date: string; // ISO
  merchant: string;
  description: string;
  category: TxCategory;
  type: "credit" | "debit";
  amount: number; // positive number
  account: "Checking" | "Savings";
  balanceAfter: number; // for the account
}

// Simple LCG for deterministic randomness
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
const rng = makeRng(20240715);
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
const between = (a: number, b: number) => a + rng() * (b - a);
const intBetween = (a: number, b: number) => Math.floor(between(a, b + 1));

const REAL_ESTATE = [
  { m: "Kerrville Title Co.", d: "Property closing — 1420 Ranch Rd" },
  { m: "Guadalupe Realty Group", d: "Investment property purchase" },
  { m: "Hill Country Escrow", d: "Escrow disbursement" },
  { m: "Lonestar Contracting", d: "Kitchen renovation — Hunt property" },
  { m: "Texas Roofing Supply", d: "Roof replacement materials" },
  { m: "Ridgeview Property Mgmt", d: "Monthly management fee" },
  { m: "Kerr County Appraisal", d: "Annual property tax" },
  { m: "Hill Country Landscape", d: "Grounds maintenance" },
  { m: "Comfort HVAC Services", d: "HVAC replacement" },
];
const CRYPTO = [
  { m: "Coinbase", d: "BTC purchase" },
  { m: "Kraken", d: "ETH purchase" },
  { m: "Gemini Trust", d: "SOL purchase" },
  { m: "Fidelity Digital", d: "Digital asset allocation" },
  { m: "Coinbase", d: "Cold wallet transfer" },
];
const TRAVEL = [
  { m: "American Airlines", d: "First-class booking DFW → LHR" },
  { m: "The Peninsula Paris", d: "Suite reservation" },
  { m: "NetJets", d: "Jet card hourly draw" },
  { m: "Ritz-Carlton Aspen", d: "Family holiday" },
  { m: "Delta Air Lines", d: "Domestic travel" },
  { m: "Four Seasons Maui", d: "Ocean villa" },
];
const LUXURY = [
  { m: "Neiman Marcus", d: "Apparel & accessories" },
  { m: "Rolex Boutique Houston", d: "Timepiece purchase" },
  { m: "Sotheby's", d: "Auction settlement" },
  { m: "Bentley Austin", d: "Vehicle service" },
  { m: "Cartier", d: "Fine jewelry" },
];
const SERVICES = [
  { m: "State Farm", d: "Umbrella insurance premium" },
  { m: "Whitfield & Assoc CPA", d: "Quarterly accounting" },
  { m: "Baker Botts LLP", d: "Legal services retainer" },
  { m: "Merrill Wealth", d: "Advisory fee" },
];
const UTILITIES = [
  { m: "AEP Texas", d: "Electric utility" },
  { m: "Kerrville Public Utility", d: "Water & sewer" },
  { m: "Spectrum Business", d: "Internet service" },
  { m: "AT&T", d: "Mobile & landline" },
  { m: "Reliant Energy", d: "Ranch electric" },
];
const PROFESSIONAL = [
  { m: "PL Roofings — Payroll", d: "Bi-weekly payroll run" },
  { m: "Home Depot Pro", d: "Materials & supplies" },
  { m: "ADP", d: "Payroll processing" },
  { m: "Ford Commercial", d: "Fleet lease payment" },
];
const LIFESTYLE = [
  { m: "H-E-B", d: "Groceries" },
  { m: "Whole Foods Market", d: "Groceries" },
  { m: "Amazon", d: "Household" },
  { m: "Costco", d: "Bulk supplies" },
  { m: "Kerrville Country Club", d: "Monthly dues" },
  { m: "Starbucks", d: "Coffee" },
];

const PL_CHECKS = [75000, 100000, 100000, 150000, 200000, 200000, 250000, 300000];

interface AcctState { balance: number; }

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function generate(): Transaction[] {
  const start = new Date("1994-01-15T09:00:00Z");
  const end = new Date();
  const txs: Transaction[] = [];
  const checking: AcctState = { balance: 12500 };
  const savings: AcctState = { balance: 45000 };

  const totalDays = daysBetween(start, end);
  let day = 0;
  let txCount = 0;

  while (day <= totalDays) {
    const cur = new Date(start.getTime() + day * 86400000);
    // Bi-weekly PL Roofings deposit (large check)
    if (txCount % 1 === 0 && day % 14 === 3) {
      const amt = pick(PL_CHECKS);
      checking.balance += amt;
      txs.push({
        id: `tx-${txs.length}`,
        date: cur.toISOString(),
        merchant: "PL Roofings",
        description: `Check deposit #${10000 + txs.length}`,
        category: "Deposit",
        type: "credit",
        amount: amt,
        account: "Checking",
        balanceAfter: checking.balance,
      });
      // Sweep portion to savings
      if (rng() > 0.35) {
        const sweep = Math.round(amt * between(0.4, 0.7));
        checking.balance -= sweep;
        savings.balance += sweep;
        txs.push({
          id: `tx-${txs.length}`,
          date: new Date(cur.getTime() + 3600000).toISOString(),
          merchant: "Internal Transfer",
          description: "Auto sweep to Savings",
          category: "Transfer",
          type: "debit",
          amount: sweep,
          account: "Checking",
          balanceAfter: checking.balance,
        });
        txs.push({
          id: `tx-${txs.length}`,
          date: new Date(cur.getTime() + 3601000).toISOString(),
          merchant: "Internal Transfer",
          description: "Auto sweep from Checking",
          category: "Transfer",
          type: "credit",
          amount: sweep,
          account: "Savings",
          balanceAfter: savings.balance,
        });
      }
    }

    // Monthly savings interest
    if (cur.getUTCDate() === 1) {
      const interest = Math.round(savings.balance * 0.0028 * 100) / 100;
      savings.balance += interest;
      txs.push({
        id: `tx-${txs.length}`,
        date: cur.toISOString(),
        merchant: "Kerr County FCU",
        description: "Monthly dividend / interest",
        category: "Interest",
        type: "credit",
        amount: interest,
        account: "Savings",
        balanceAfter: savings.balance,
      });
    }

    // Real estate ~ once per 40-60 days
    if (day % intBetween(40, 60) === 0 && day > 30) {
      const item = pick(REAL_ESTATE);
      const amt = Math.round(between(4000, 320000));
      if (checking.balance > amt + 5000) {
        checking.balance -= amt;
        txs.push({
          id: `tx-${txs.length}`,
          date: cur.toISOString(),
          merchant: item.m,
          description: item.d,
          category: "Real Estate",
          type: "debit",
          amount: amt,
          account: "Checking",
          balanceAfter: checking.balance,
        });
      }
    }

    // Crypto — only after 2015
    if (cur.getUTCFullYear() >= 2015 && day % intBetween(20, 45) === 0) {
      const item = pick(CRYPTO);
      const amt = Math.round(between(5000, 85000));
      if (checking.balance > amt + 20000) {
        checking.balance -= amt;
        txs.push({
          id: `tx-${txs.length}`,
          date: cur.toISOString(),
          merchant: item.m,
          description: item.d,
          category: "Crypto",
          type: "debit",
          amount: amt,
          account: "Checking",
          balanceAfter: checking.balance,
        });
      }
    }

    // Travel every 25-55 days
    if (day % intBetween(25, 55) === 0) {
      const item = pick(TRAVEL);
      const amt = Math.round(between(1200, 42000));
      checking.balance -= amt;
      txs.push({
        id: `tx-${txs.length}`,
        date: cur.toISOString(),
        merchant: item.m,
        description: item.d,
        category: "Travel",
        type: "debit",
        amount: amt,
        account: "Checking",
        balanceAfter: checking.balance,
      });
    }

    // Luxury monthly-ish
    if (day % intBetween(18, 40) === 0) {
      const item = pick(LUXURY);
      const amt = Math.round(between(800, 28000));
      checking.balance -= amt;
      txs.push({
        id: `tx-${txs.length}`,
        date: cur.toISOString(),
        merchant: item.m,
        description: item.d,
        category: "Luxury",
        type: "debit",
        amount: amt,
        account: "Checking",
        balanceAfter: checking.balance,
      });
    }

    // Services quarterly
    if (day % intBetween(80, 100) === 0) {
      const item = pick(SERVICES);
      const amt = Math.round(between(2500, 24000));
      checking.balance -= amt;
      txs.push({
        id: `tx-${txs.length}`,
        date: cur.toISOString(),
        merchant: item.m,
        description: item.d,
        category: "Services",
        type: "debit",
        amount: amt,
        account: "Checking",
        balanceAfter: checking.balance,
      });
    }

    // Utilities monthly
    if (cur.getUTCDate() === 12) {
      const item = pick(UTILITIES);
      const amt = Math.round(between(120, 1400));
      checking.balance -= amt;
      txs.push({
        id: `tx-${txs.length}`,
        date: cur.toISOString(),
        merchant: item.m,
        description: item.d,
        category: "Utilities",
        type: "debit",
        amount: amt,
        account: "Checking",
        balanceAfter: checking.balance,
      });
    }

    // Professional bi-weekly-ish
    if (day % 14 === 7) {
      const item = pick(PROFESSIONAL);
      const amt = Math.round(between(3500, 48000));
      checking.balance -= amt;
      txs.push({
        id: `tx-${txs.length}`,
        date: cur.toISOString(),
        merchant: item.m,
        description: item.d,
        category: "Professional",
        type: "debit",
        amount: amt,
        account: "Checking",
        balanceAfter: checking.balance,
      });
    }

    // Lifestyle every 3-5 days
    if (day % intBetween(3, 5) === 0) {
      const item = pick(LIFESTYLE);
      const amt = Math.round(between(20, 950) * 100) / 100;
      checking.balance -= amt;
      txs.push({
        id: `tx-${txs.length}`,
        date: cur.toISOString(),
        merchant: item.m,
        description: item.d,
        category: "Lifestyle",
        type: "debit",
        amount: amt,
        account: "Checking",
        balanceAfter: checking.balance,
      });
    }

    day += 1;
    txCount += 1;
  }

  // Force final balances close to target: pad or trim with a final adjustment deposit
  const TARGET_CHECKING = 2_000_000;
  const TARGET_SAVINGS = 6_250_000;
  const adjTime = new Date(end.getTime() + 3600000).toISOString();
  const checkingDiff = TARGET_CHECKING - checking.balance;
  if (checkingDiff !== 0) {
    checking.balance += checkingDiff;
    txs.push({
      id: `tx-${txs.length}`,
      date: adjTime,
      merchant: checkingDiff > 0 ? "PL Roofings" : "Merrill Wealth",
      description: checkingDiff > 0 ? "Quarterly distribution" : "Portfolio funding transfer",
      category: checkingDiff > 0 ? "Deposit" : "Transfer",
      type: checkingDiff > 0 ? "credit" : "debit",
      amount: Math.abs(checkingDiff),
      account: "Checking",
      balanceAfter: checking.balance,
    });
  }
  const savingsDiff = TARGET_SAVINGS - savings.balance;
  if (savingsDiff !== 0) {
    savings.balance += savingsDiff;
    txs.push({
      id: `tx-${txs.length}`,
      date: new Date(end.getTime() + 3601000).toISOString(),
      merchant: savingsDiff > 0 ? "Merrill Wealth" : "Advisory Rebalance",
      description: savingsDiff > 0 ? "Portfolio dividend deposit" : "Portfolio rebalance",
      category: savingsDiff > 0 ? "Deposit" : "Transfer",
      type: savingsDiff > 0 ? "credit" : "debit",
      amount: Math.abs(savingsDiff),
      account: "Savings",
      balanceAfter: savings.balance,
    });
  }

  // Sort most-recent first
  txs.sort((a, b) => b.date.localeCompare(a.date));
  return txs;
}

let cache: Transaction[] | null = null;
export function getTransactions(): Transaction[] {
  if (!cache) cache = generate();
  return cache;
}

export function getBalances() {
  const txs = getTransactions();
  const latestChecking = txs.find((t) => t.account === "Checking");
  const latestSavings = txs.find((t) => t.account === "Savings");
  return {
    checking: latestChecking?.balanceAfter ?? 2_000_000,
    savings: latestSavings?.balanceAfter ?? 6_250_000,
  };
}

// Aggregate monthly totals for growth chart
export function getMonthlyGrowth(months = 24) {
  const txs = getTransactions();
  const now = new Date();
  const buckets: { key: string; label: string; checking: number; savings: number; total: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    buckets.push({ key, label, checking: 0, savings: 0, total: 0 });
  }
  // find last balance in each bucket per account
  for (const acct of ["Checking", "Savings"] as const) {
    for (const b of buckets) {
      const [y, m] = b.key.split("-").map(Number);
      const endOfMonth = new Date(y, m, 0, 23, 59, 59);
      const tx = txs.find((t) => t.account === acct && new Date(t.date) <= endOfMonth);
      const val = tx?.balanceAfter ?? 0;
      if (acct === "Checking") b.checking = val;
      else b.savings = val;
    }
  }
  buckets.forEach((b) => (b.total = b.checking + b.savings));
  return buckets;
}

export function getCategoryBreakdown(days = 90) {
  const txs = getTransactions();
  const cutoff = Date.now() - days * 86400000;
  const totals: Record<string, number> = {};
  for (const t of txs) {
    if (t.type !== "debit") continue;
    if (new Date(t.date).getTime() < cutoff) continue;
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  }
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
}

export function getMonthlyCashflow(months = 12) {
  const txs = getTransactions();
  const now = new Date();
  const out: { label: string; income: number; spending: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear(), m = d.getMonth();
    const label = d.toLocaleDateString("en-US", { month: "short" });
    let income = 0, spending = 0;
    for (const t of txs) {
      const td = new Date(t.date);
      if (td.getFullYear() !== y || td.getMonth() !== m) continue;
      if (t.category === "Transfer" || t.category === "Interest") continue;
      if (t.type === "credit") income += t.amount;
      else spending += t.amount;
    }
    out.push({ label, income: Math.round(income), spending: Math.round(spending) });
  }
  return out;
}
