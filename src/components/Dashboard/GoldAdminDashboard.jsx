import React from "react";
import SummaryCards from "./SummaryCards";
import GoldPriceTrend from "./GoldPriceTrend";
import BuyVsSell from "./BuyVsSell";
import RevenueTrend from "./RevenueTrend";
import TopWallets from "./TopWallets";
import ActivityFeed from "./ActivityFeed";
import RecentTransactionsTable from "./RecentTransactionsTable";

// Sample feed and top wallets (can keep as props or fetch later)
const TOP_WALLETS = [
  { user: "Mg Mg", gold: "120 g", cash: "$1,820" },
  { user: "Aye Aye", gold: "1.5 Tola", cash: "$950" },
  { user: "Ko Ko", gold: "80 g", cash: "$540" },
];

const FEED = [
  {
    id: 1,
    icon: null,
    text: "Gold price jumped +0.8% in last hour",
    time: "2m",
  },
  {
    id: 2,
    icon: null,
    text: "New buy order from Hnin Si (2g, 24K)",
    time: "15m",
  },
  {
    id: 3,
    icon: null,
    text: "KYC verified: Aye Chan",
    time: "1h",
  },
];

export default function GoldAdminRightPane() {
  return (
    <div className="bg-neutral-950 text-neutral-100">
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GoldPriceTrend />
          <BuyVsSell />
        </section>

        {/* Revenue trend */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <RevenueTrend />
        </section>

        {/* Transactions table */}
        <section className="m-4">
          <RecentTransactionsTable />

        </section>

        {/* Feed and top wallets */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivityFeed feed={FEED} />
          <TopWallets wallets={TOP_WALLETS} />
        </section>
      </main>
    </div>
  );
}
