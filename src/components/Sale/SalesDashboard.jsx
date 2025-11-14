// import React, { useState, useEffect, useMemo } from "react";
// import SummaryCards from "./SummaryCards";
// import SalesTrendChart from "./SalesTrendChart";
// import TransactionStatusChart from "./TransactionStatusChart";
// import RecentTransactions from "./RecentTransactions";
// import BuyTransactions from "./BuyTransactions";
// import SellTransactions from "./SellTransactions";
// import DeliveryTransactions from "./DeliveryTransactions.jsx";

// const API_URL = "http://38.60.244.74:3000/sales";

// const SalesDashboard = () => {
//   // --- States ---
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [goldTotal, setGoldTotal] = useState(0); // gold total from API
//   const [chartData, setChartData] = useState([]);

//   // --- Fetch Sales Data ---
//   useEffect(() => {
//     let intervalId;

//     const fetchSales = async () => {
//       try {
//         const res = await fetch(API_URL);
//         const json = await res.json();

//         if (json.success && Array.isArray(json.data)) {
//           const mapped = json.data.map((item, i) => ({
//             id: item.id || `TXN_${i}`,
//             userid: item.userid || "-",
//             fullname: item.fullname || "-",
//             payment_name: item.payment_name || "-",
//             payment_phone: item.payment_phone || "-",
//             method: item.method || "-",
//             type: item.type || "sell",
//             gold: item.gold || 0,
//             yway: item.yway || 0,
//             price: parseInt(item.price || 0),
//             status: item.status || "pending",
//             photos: item.photos || [],
//             date: item.created_at ? new Date(item.created_at) : new Date(),
//           }));

//           setSales(mapped);
//           setGoldTotal(json.goldTotal || 0);
//           setError(null);
//         } else {
//           throw new Error("Invalid data structure");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load sales data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Initial fetch
//     fetchSales();

//     // Fetch every 1 second
//     intervalId = setInterval(fetchSales, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   // --- Fetch Chart Data ---
//   useEffect(() => {
//     const fetchChartData = async () => {
//       try {
//         const res = await fetch("http://38.60.244.74:3000/gold-times-today");
//         const json = await res.json();
//         if (json.success && Array.isArray(json.data)) {
//           setChartData(json.data);
//         }
//       } catch (err) {
//         console.error("Failed to load chart data:", err);
//       }
//     };

//     fetchChartData();
//   }, []);

//   // --- Derived Data for SummaryCards ---
//   const totalPrice = useMemo(
//     () => sales.reduce((sum, s) => sum + (s.price || 0), 0),
//     [sales]
//   );

//   const totalApproved = useMemo(
//     () => sales.filter((s) => s.status?.toLowerCase() === "approved").length,
//     [sales]
//   );

//   // --- Update Transaction Status ---
//   const updateStatus = (id, newStatus) => {
//     setSales((prev) =>
//       prev.map((s) =>
//         s.id === id ? { ...s, status: newStatus.toLowerCase() } : s
//       )
//     );
//     setTimeout(() => window.location.reload(), 500);
//   };

//   // --- Loading/Error UI ---
//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-yellow-400">
//         <div className="relative">
//           <div className="h-14 w-14 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
//           <div className="absolute inset-0 blur-xl bg-yellow-500/30 rounded-full animate-pulse"></div>
//         </div>
//         <p className="mt-6 text-lg font-semibold animate-pulse tracking-wide">
//           Loading Sales Data...
//         </p>
//         <p className="text-sm text-neutral-500 mt-1">Please wait a moment ⏳</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex items-center justify-center h-64 text-red-400">
//         {error}
//       </div>
//     );

//   // --- Main UI ---
//   return (
// <div className="bg-neutral-950 text-neutral-100 ">
//   <div className="mx-auto  max-w-7xl px-4 py-6 space-y-6">
//     {/* Summary Cards */}
//     <SummaryCards
//       sales={sales}
//       goldTotal={goldTotal || 0}
//       totalPrice={totalPrice || 0}
//       totalApproved={totalApproved || 0}
//     />

//     {/* Charts */}
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//       <SalesTrendChart chartData={chartData} />
//       <TransactionStatusChart sales={sales} />
//     </div>

//     {/* Transaction Tables */}
//     <div className="space-y-6">
//       {/* Buy Transactions */}
//       <div className="overflow-x-hidden">
//         <BuyTransactions sales={sales} updateStatus={updateStatus} />
//       </div>

//       {/* Sell Transactions */}
//       <div className="overflow-x-hidden">
//         <SellTransactions sales={sales} updateStatus={updateStatus} />
//       </div>

//       {/* Delivery Transactions */}
//       <div className="overflow-x-hidden">
//         <DeliveryTransactions sales={sales} updateStatus={updateStatus} />
//       </div>
//     </div>
//   </div>
// </div>

//   );
// };

// export default SalesDashboard;

import React, { useState, useEffect, useMemo } from "react";
import SummaryCards from "./SummaryCards";
import SalesTrendChart from "./SalesTrendChart";
import TransactionStatusChart from "./TransactionStatusChart";
import RecentTransactions from "./RecentTransactions";
import BuyTransactions from "./BuyTransactions";
import SellTransactions from "./SellTransactions";
import DeliveryTransactions from "./DeliveryTransactions.jsx";

const API_URL = "http://38.60.244.74:3000/sales";

const SalesDashboard = () => {
  // --- States ---
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);
  const [goldTotal, setGoldTotal] = useState(0); // gold total from API
  const [chartData, setChartData] = useState([]);

  // --- Fetch Sales Data ---
  useEffect(() => {
    let intervalId;

    const fetchSales = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((item, i) => ({
            id: item.id || `TXN_${i}`,
            userid: item.userid || "-",
            fullname: item.fullname || "-",
            payment_name: item.payment_name || "-",
            payment_phone: item.payment_phone || "-",
            method: item.method || "-",
            type: item.type || "sell",
            gold: item.gold || 0,
            yway: item.yway || 0,
            price: parseInt(item.price || 0),
            status: item.status || "pending",
            photos: item.photos || [],
            date: item.created_at ? new Date(item.created_at) : new Date(),
          }));

          setSales(mapped);
          setGoldTotal(json.goldTotal || 0);
          setError(null);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load sales data");
      }
    };

    // Initial fetch
    fetchSales();

    // Fetch every 1 second
    intervalId = setInterval(fetchSales, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // --- Fetch Chart Data ---
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/gold-times-today");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setChartData(json.data);
        }
      } catch (err) {
        console.error("Failed to load chart data:", err);
      }
    };

    fetchChartData();
  }, []);

  // --- Derived Data for SummaryCards ---
  const totalPrice = useMemo(
    () => sales.reduce((sum, s) => sum + (s.price || 0), 0),
    [sales]
  );

  const totalApproved = useMemo(
    () => sales.filter((s) => s.status?.toLowerCase() === "approved").length,
    [sales]
  );

  // --- Update Transaction Status ---
  const updateStatus = (id, newStatus) => {
    setSales((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: newStatus.toLowerCase() } : s
      )
    );
    // setTimeout(() => window.location.reload(), 500);
  };

  // --- Error UI ---
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        {error}
      </div>
    );

  // --- Main UI ---
  return (
    <div className="bg-neutral-950 text-neutral-100 ">
      <div className="mx-auto  max-w-7xl px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <SummaryCards
          sales={sales}
          goldTotal={goldTotal || 0}
          totalPrice={totalPrice || 0}
          totalApproved={totalApproved || 0}
        />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SalesTrendChart chartData={chartData} />
          <TransactionStatusChart sales={sales} />
        </div>

        {/* Transaction Tables */}
        <div className="space-y-6">
          {/* Buy Transactions */}
          <div className="overflow-x-hidden">
            <BuyTransactions sales={sales} updateStatus={updateStatus} />
          </div>

          {/* Sell Transactions */}
          <div className="overflow-x-hidden">
            <SellTransactions sales={sales} updateStatus={updateStatus} />
          </div>

          {/* Delivery Transactions */}
          <div className="overflow-x-hidden">
            <DeliveryTransactions sales={sales} updateStatus={updateStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;

