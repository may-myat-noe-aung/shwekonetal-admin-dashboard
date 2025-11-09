// // /components/dashboard/SummaryCards.jsx
// import React, { useEffect, useState } from "react";
// import { ArrowUpRight, BarChart3, TrendingUp, Users } from "lucide-react";

// function clsx(...xs) {
//   return xs.filter(Boolean).join(" ");
// }

// // Helper function to determine color based on value
// function getColorClass(value) {
//   if (!value) return "text-neutral-500"; // fallback
//   const valStr = String(value).trim();

//   if (valStr.startsWith("+")) return "text-emerald-500"; // green
//   if (valStr.startsWith("-")) return "text-red-500"; // red
//   if (valStr.startsWith("0") || valStr.startsWith("၀")) return "text-sky-500"; // blue
//   return "text-neutral-500";
// }

// export default function SummaryCards() {
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("http://38.60.244.74:3000/dashboard-summarys")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setSummary(data);
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center text-neutral-400 py-10">
//         Loading summary...
//       </div>
//     );
//   }

//   if (!summary) {
//     return (
//       <div className="text-center text-red-500 py-10">
//         Failed to load summary.
//       </div>
//     );
//   }

//   return (
//     <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//       <SummaryCard
//         title="Buy Price"
//         value={`${summary.buyingPrices.price.toLocaleString()} Ks`}
//         sub={summary.buyingPrices.differentPercentage}
//         subClass={getColorClass(summary.buyingPrices.differentPercentage)}
//         icon={<ArrowUpRight className="h-5 w-5" />}
//         accent="from-yellow-500/20 to-transparent"
//       />
//       <SummaryCard
//         title="Sell Price"
//         value={`${summary.sellingPrices.price.toLocaleString()} Ks`}
//         sub={summary.sellingPrices.differentPercentage}
//         subClass={getColorClass(summary.sellingPrices.differentPercentage)}
//         icon={<ArrowUpRight className="h-5 w-5" />}
//         accent="from-emerald-500/20 to-transparent"
//       />
//       <SummaryCard
//         title="Transactions (Today)"
//         value={String(summary.transactions.count)}
//         sub="Buy & Sell"
//         icon={<BarChart3 className="h-5 w-5" />}
//         accent="from-sky-500/20 to-transparent"
//       />

//       <SummaryCard
//         title="Revenue Gold"
//         value={
//           <span className={getColorClass(summary.revenueGold.differentGold)}>
//             {summary.revenueGold.differentGold}
//           </span>
//         }
//         sub="Difference between Selling Gold and Buying Gold"
//         subClass="text-neutral-500"
//         icon={<TrendingUp className="h-5 w-5" />}
//         accent="from-yellow-400/20 to-transparent"
//       />

//       <SummaryCard
//         title="Total Clients"
//         value={summary.usersCount.allUsers}
//         sub={`Today: ${summary.usersCount.todayUsers}`}
//         icon={<Users className="h-5 w-5" />}
//         accent="from-rose-500/20 to-transparent"
//       />
//     </section>
//   );
// }

// function SummaryCard({ title, value, sub, icon, accent, subClass }) {
//   return (
//     <div
//       className={`rounded-2xl border border-neutral-800 bg-neutral-900 p-4 relative overflow-hidden`}
//     >
//       <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
//       <div className="relative z-10">
//         <div className="flex items-center justify-between mb-2 text-sm text-neutral-400">
//           <span>{title}</span>
//           {icon}
//         </div>
//         <div className="text-xl font-semibold">{value}</div>
//         <div className={`text-xs ${subClass || "text-neutral-500"}`}>{sub}</div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { DollarSign, TrendingUp, Users, ShoppingBag, Coins } from "lucide-react";

// const API_BASE = "http://38.60.244.74:3000";

// export default function SummaryCards() {
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/dashboard-summarys`);
//         const data = await res.json();
//         if (data.success) {
//           setSummary(data);
//         }
//       } catch (err) {
//         console.error("Error fetching summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSummary();
//   }, []);

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {Array(4)
//           .fill(0)
//           .map((_, i) => (
//             <div
//               key={i}
//               className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900 p-4 h-28"
//             ></div>
//           ))}
//       </div>
//     );
//   }

//   if (!summary) {
//     return <p className="text-neutral-500">No summary data available.</p>;
//   }

//   const cards = [
//     {
//       title: "Buying Price",
//       value: summary.buyingPrices?.price?.toLocaleString() || "0",
//       change: summary.buyingPrices?.differentPercentage || "0%",
//       icon: <DollarSign className="text-yellow-400" />,
//     },
//     {
//       title: "Selling Price",
//       value: summary.sellingPrices?.price?.toLocaleString() || "0",
//       change: summary.sellingPrices?.differentPercentage || "0%",
//       icon: <Coins className="text-yellow-400" />,
//     },
//     {
//       title: "Transactions",
//       value: summary.transactions?.count ?? 0,
//       change: "Today",
//       icon: <ShoppingBag className="text-yellow-400" />,
//     },
//     {
//       title: "Users",
//       value: summary.usersCount?.allUsers ?? 0,
//       change: `${summary.usersCount?.todayUsers} new`,
//       icon: <Users className="text-yellow-400" />,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//       {cards.map((card, idx) => (
//         <div
//           key={idx}
//           className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 flex items-center justify-between"
//         >
//           <div>
//             <p className="text-sm text-neutral-400">{card.title}</p>
//             <h3 className="text-xl font-semibold text-white">
//               {card.value}
//             </h3>
//             <p className="text-xs text-green-400 mt-1">{card.change}</p>
//           </div>
//           <div className="p-2 bg-neutral-800 rounded-xl">{card.icon}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import {
//   DollarSign,
//   Coins,
//   ShoppingBag,
//   Users,
//   Gem,
// } from "lucide-react";

// const API_BASE = "http://38.60.244.74:3000";

// export default function SummaryCards() {
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/dashboard-summarys`);
//         const data = await res.json();
//         if (data.success) setSummary(data);
//       } catch (err) {
//         console.error("Error fetching summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSummary();
//   }, []);

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//         {Array(5)
//           .fill(0)
//           .map((_, i) => (
//             <div
//               key={i}
//               className="animate-pulse rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4 h-28"
//             ></div>
//           ))}
//       </div>
//     );
//   }

//   if (!summary) {
//     return <p className="text-neutral-500">No summary data available.</p>;
//   }

//   const cards = [
//     {
//       title: "Buying Price",
//       value: summary.buyingPrices?.price?.toLocaleString() || "0",
//       change: summary.buyingPrices?.differentPercentage || "0%",
//       icon: <DollarSign className="text-yellow-400" />,
//     },
//     {
//       title: "Selling Price",
//       value: summary.sellingPrices?.price?.toLocaleString() || "0",
//       change: summary.sellingPrices?.differentPercentage || "0%",
//       icon: <Coins className="text-yellow-400" />,
//     },
//     {
//       title: "Transactions",
//       value: summary.transactions?.count ?? 0,
//       change: "Today",
//       icon: <ShoppingBag className="text-yellow-400" />,
//     },
//     {
//       title: "Revenue Gold",
//       value: summary.revenueGold?.differentGold || "0 ရွေး",
//       change: "Updated",
//       icon: <Gem className="text-yellow-400" />,
//     },
//     {
//       title: "Users",
//       value: summary.usersCount?.allUsers ?? 0,
//       change: `${summary.usersCount?.todayUsers || 0} new`,
//       icon: <Users className="text-yellow-400" />,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//       {cards.map((card, idx) => (
//         <div
//           key={idx}
//           className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4 flex items-center justify-between hover:border-yellow-600 transition"
//         >
//           <div>
//             <p className="text-sm text-neutral-400">{card.title}</p>
//             <h3 className="text-xl font-semibold text-white">
//               {card.value}
//             </h3>
//             <p className="text-xs text-green-400 mt-1">{card.change}</p>
//           </div>
//           <div className="p-2 bg-neutral-800 rounded-xl">{card.icon}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

// /components/dashboard/SummaryCards.jsx

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
            <span className={getColorClass(summary.buyingPrices.differentPercentage)}>
              {summary.buyingPrices.differentPercentage}
            </span>
            <div className="text-xs text-neutral-400">
              last updated -  {summary.buyingPrices.buy_price_date}  {summary.buyingPrices.buy_price_time}
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
            <span className={getColorClass(summary.sellingPrices.differentPercentage)}>
              {summary.sellingPrices.differentPercentage}
            </span>
            <div className="text-xs text-neutral-400">
            last updated -  {summary.sellingPrices.sell_price_date} {summary.sellingPrices.sell_price_time}
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
