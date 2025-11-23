// import React from "react";
// import { BarChart3, Users, Wallet, PieChart as PieChartIcon } from "lucide-react";

// const SummaryCard = ({ title, value, sub, icon, accent }) => (
//   <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//     <div className={"pointer-events-none absolute inset-0 bg-gradient-to-br " + accent} />
//     <div className="flex items-center justify-between relative z-0">
//       <div>
//         <p className="text-sm text-neutral-400 mb-2">{title}</p>
//         <p className="text-lg font-semibold mb-1">{value}</p>
//         <p className="text-xs text-neutral-500">{sub}</p>
//       </div>
//       <div className="p-2 rounded-lg bg-neutral-800 text-yellow-500">{icon}</div>
//     </div>
//   </div>
// );

// const SummaryCards = ({ sales, goldTotal, totalPrice, totalApproved }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
//     <SummaryCard
//       title="Total Gold Weight"
//       value={goldTotal || "-"}
//       sub="Total gold sold"
//       icon={<BarChart3 size={20} />}
//       accent="from-yellow-600/10 to-yellow-400/5"
//     />
//     <SummaryCard
//       title="Total Transactions"
//       value={sales.length}
//       sub="All recorded transactions"
//       icon={<Users size={20} />}
//       accent="from-blue-600/10 to-blue-400/5"
//     />
//     <SummaryCard
//       title="Total Sale Amount"
//       value={`${totalPrice.toLocaleString()} ကျပ်`}
//       sub="Gross sales"
//       icon={<Wallet size={20} />}
//       accent="from-green-600/10 to-green-400/5"
//     />
//     <SummaryCard
//       title="Total Approved"
//       value={totalApproved}
//       sub="All Approved Orders"
//       icon={<PieChartIcon size={20} />}
//       accent="from-purple-600/10 to-purple-400/5"
//     />
//   </div>
// );

// export default SummaryCards;

import React, { useState, useEffect } from "react";
import { BarChart3, Users, Wallet, PieChart as PieChartIcon } from "lucide-react";

const API_URL = "http://38.60.244.74:3000/sales-summarys";

const SummaryCard = ({ title, value, sub, icon, accent }) => (
  <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
    <div className={"pointer-events-none absolute inset-0 bg-gradient-to-br " + accent} />
    <div className="flex items-center justify-between relative z-0">
      <div>
        <p className="text-sm text-neutral-400 mb-2">{title}</p>
        <p className="text-lg font-semibold mb-1">{value}</p>
        <p className="text-xs text-neutral-500">{sub}</p>
      </div>
      <div className="p-2 rounded-lg bg-neutral-800 text-yellow-500">{icon}</div>
    </div>
  </div>
);

const SummaryCards = () => {
  const [summary, setSummary] = useState({
    totalGoldWeightString: "-",
    totalTransactions: 0,
    totalSalesAmount: 0,
    totalSalesApproved: 0,
  });

  useEffect(() => {
    let intervalId;

    const fetchSummary = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        if (json) {
          setSummary({
            totalGoldWeightString: json.totalGoldWeightString || "-",
            totalTransactions: json.totalTransactions || 0,
            totalSalesAmount: json.totalSalesAmount || 0,
            totalSalesApproved: json.totalSalesApproved || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch summary data:", err);
      }
    };

    // Initial fetch
    fetchSummary();

    // Refresh every 3 seconds
    intervalId = setInterval(fetchSummary, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <SummaryCard
        title="Total Gold Weight"
        value={summary.totalGoldWeightString}
        sub="Total gold sold"
        icon={<BarChart3 size={20} />}
        accent="from-yellow-600/10 to-yellow-400/5"
      />
      <SummaryCard
        title="Total Transactions"
        value={summary.totalTransactions}
        sub="All recorded transactions"
        icon={<Users size={20} />}
        accent="from-blue-600/10 to-blue-400/5"
      />
      <SummaryCard
        title="Total Sale Amount"
        value={`${summary.totalSalesAmount.toLocaleString()} ကျပ်`}
        sub="Gross sales"
        icon={<Wallet size={20} />}
        accent="from-green-600/10 to-green-400/5"
      />
      <SummaryCard
        title="Total Approved"
        value={summary.totalSalesApproved}
        sub="All Approved Orders"
        icon={<PieChartIcon size={20} />}
        accent="from-purple-600/10 to-purple-400/5"
      />
    </div>
  );
};

export default SummaryCards;
