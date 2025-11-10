import React, { useEffect, useState } from "react";
import { ArrowUpRight, BarChart3, TrendingUp, Users } from "lucide-react";

function clsx(...xs) {
  return xs.filter(Boolean).join(" ");
}

// Helper function to determine color based on value
function getColorClass(value) {
  if (!value) return "text-neutral-500"; // fallback
  const valStr = String(value).trim();

  if (valStr.startsWith("+")) return "text-emerald-500"; // green
  if (valStr.startsWith("-")) return "text-red-500"; // red
  if (valStr.startsWith("0") || valStr.startsWith("၀")) return "text-sky-500"; // blue
  return "text-neutral-500";
}

export default function SummaryCards() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://38.60.244.74:3000/dashboard-summarys")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSummary(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center text-neutral-400 py-10">
        Loading summary...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load summary.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Buy Price Card */}
      <SummaryCard
        title="Buy Price"
        value={`${summary.buyingPrices.price.toLocaleString()} Ks`}
        sub={
          <>
            <span
              className={getColorClass(
                summary.buyingPrices.differentPercentage
              )}
            >
              {summary.buyingPrices.differentPercentage}
            </span>
            <div className="text-xs text-neutral-400">
              last updated - {summary.buyingPrices.buy_price_date}{" "}
              {summary.buyingPrices.buy_price_time}
            </div>
          </>
        }
        icon={<ArrowUpRight className="h-5 w-5" />}
        accent="from-yellow-500/20 to-transparent"
      />

      {/* Sell Price Card */}
      <SummaryCard
        title="Sell Price"
        value={`${summary.sellingPrices.price.toLocaleString()} Ks`}
        sub={
          <>
            <span
              className={getColorClass(
                summary.sellingPrices.differentPercentage
              )}
            >
              {summary.sellingPrices.differentPercentage}
            </span>
            <div className="text-xs text-neutral-400">
              last updated - {summary.sellingPrices.sell_price_date}{" "}
              {summary.sellingPrices.sell_price_time}
            </div>
          </>
        }
        icon={<ArrowUpRight className="h-5 w-5" />}
        accent="from-emerald-500/20 to-transparent"
      />

      {/* Transactions Today */}
      <SummaryCard
        title="Transactions (Today)"
        value={String(summary.transactions.count)}
        sub="Buy & Sell"
        icon={<BarChart3 className="h-5 w-5" />}
        accent="from-sky-500/20 to-transparent"
      />

      {/* Revenue Gold */}
      <SummaryCard
        title="Revenue Gold"
        value={
          <span className={getColorClass(summary.revenueGold.differentGold)}>
            {summary.revenueGold.differentGold}
          </span>
        }
        sub="Difference between Selling Gold and Buying Gold"
        subClass="text-neutral-500"
        icon={<TrendingUp className="h-5 w-5" />}
        accent="from-yellow-400/20 to-transparent"
      />

      {/* Total Clients */}
      <SummaryCard
        title="Total Clients"
        value={summary.usersCount.allUsers}
        sub={`Today: ${summary.usersCount.todayUsers}`}
        icon={<Users className="h-5 w-5" />}
        accent="from-rose-500/20 to-transparent"
      />
    </section>
  );
}

function SummaryCard({ title, value, sub, icon, accent, subClass }) {
  return (
    <div
      className={`rounded-2xl border border-neutral-800 bg-neutral-900 p-4 relative overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2 text-sm text-neutral-400">
          <span>{title}</span>
          {icon}
        </div>
        <div className="text-xl font-semibold">{value}</div>
        <div className={`text-xs ${subClass || "text-neutral-500"}`}>{sub}</div>
      </div>
    </div>
  );
}
