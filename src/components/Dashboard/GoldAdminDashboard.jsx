// import React from "react";
// import SummaryCards from "./SummaryCards";
// import GoldPriceTrend from "./GoldPriceTrend";
// import BuyVsSell from "./BuyVsSell";
// import RevenueTrend from "./RevenueTrend";
// import TopWallets from "./TopWallets";
// import RecentTransactionsTable from "./RecentTransactionsTable";

// // Sample feed and top wallets (can keep as props or fetch later)
// const TOP_WALLETS = [
//   { user: "Mg Mg", gold: "120 g", cash: "$1,820" },
//   { user: "Aye Aye", gold: "1.5 Tola", cash: "$950" },
//   { user: "Ko Ko", gold: "80 g", cash: "$540" },
// ];

// const FEED = [
//   {
//     id: 1,
//     icon: null,
//     text: "Gold price jumped +0.8% in last hour",
//     time: "2m",
//   },
//   {
//     id: 2,
//     icon: null,
//     text: "New buy order from Hnin Si (2g, 24K)",
//     time: "15m",
//   },
//   {
//     id: 3,
//     icon: null,
//     text: "KYC verified: Aye Chan",
//     time: "1h",
//   },
// ];

// export default function GoldAdminRightPane() {
//   return (
//     <div className="bg-neutral-950 text-neutral-100">
//       <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
//         {/* Summary Cards */}
//         <SummaryCards />

//         {/* Charts */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <GoldPriceTrend />
//           <BuyVsSell />
//         </section>

//         {/* Revenue trend */}
//         <section className="grid grid-cols-6 h-full gap-4">
//           <section className="col-span-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 ">
//             <RevenueTrend />
//           </section>
//           <div className="col-span-2 h-full">
//             <TopWallets wallets={TOP_WALLETS} />
//           </div>
//         </section>

//         {/* Transactions table */}
//         <section className="m-4">
//           <RecentTransactionsTable />
//         </section>

  
//       </main>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import SummaryCards from "./SummaryCards";
// import GoldPriceTrend from "./GoldPriceTrend";
// import BuyVsSell from "./BuyVsSell";
// import RevenueTrend from "./RevenueTrend";
// import TopWallets from "./TopWallets";
// import RecentTransactionsTable from "./RecentTransactionsTable";

// const API_BASE = "http://38.60.244.74:3000";

// export default function GoldAdminRightPane() {
//   const [wallets, setWallets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch Top Wallets
//   useEffect(() => {
//     async function fetchTopWallets() {
//       try {
//         const res = await fetch(`${API_BASE}/topWalle`);
//         const data = await res.json();

//         setWallets(data || []);
//       } catch (error) {
//         console.error("Error fetching wallets:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTopWallets();
//   }, []);

//   return (
//     <div className="bg-neutral-950 text-neutral-100">
//       <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        
//         {/* Summary Cards */}
//         <SummaryCards />

//         {/* Charts */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <GoldPriceTrend />
//           <BuyVsSell />
//         </section>

//         {/* Revenue trend + Top Wallets */}
//         <section className="grid grid-cols-6 h-full gap-4">
//           <section className="col-span-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//             <RevenueTrend />
//           </section>

//           <div className="col-span-2 h-full">
//             <TopWallets wallets={wallets} loading={loading} />
//           </div>
//         </section>

//         {/* Recent Transactions */}
//         <section className="m-4">
//           <RecentTransactionsTable />
//         </section>
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import SummaryCards from "./SummaryCards";
import GoldPriceTrend from "./GoldPriceTrend";
import BuyVsSell from "./BuyVsSell";
import RevenueTrend from "./RevenueTrend";
import TopWallets from "./TopWallets";
import RecentTransactionsTable from "./RecentTransactionsTable";

const API_BASE = "http://38.60.244.74:3000";

export default function GoldAdminRightPane() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reusable fetch function
  const fetchWallets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/topWallet`);
      const data = await res.json();
      setWallets(Array.isArray(data.TOP_WALLETS) ? data.TOP_WALLETS : []);
    } catch (err) {
      console.error("Error fetching wallets:", err);
      setError("Failed to load wallets");
      setWallets([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect with 500ms delay on mount
  useEffect(() => {
    const timer = setTimeout(fetchWallets, 500);

    return () => clearTimeout(timer); // cleanup
  }, []);

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

        {/* Revenue trend + Top Wallets */}
        <section className="grid grid-cols-6 h-full gap-4">
          <section className="col-span-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <RevenueTrend />
          </section>

          <div className="col-span-2 h-full">
            <TopWallets wallets={wallets} loading={loading} error={error} />
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="m-4">
          <RecentTransactionsTable />
        </section>
      </main>
    </div>
  );
}
