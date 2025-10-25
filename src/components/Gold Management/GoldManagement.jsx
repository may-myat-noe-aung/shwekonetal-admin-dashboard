// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ArrowUpRight, ArrowDownRight, X } from "lucide-react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";

// export default function GoldManagementPage() {
//   const [buyPrice, setBuyPrice] = useState(0);
//   const [sellPrice, setSellPrice] = useState(0);
//   const [buyInput, setBuyInput] = useState(0);
//   const [sellInput, setSellInput] = useState(0);
//   const [chartBuyData, setChartBuyData] = useState([]);
//   const [chartSellData, setChartSellData] = useState([]);

//   const [pePerKyat, setPePerKyat] = useState(16);
//   const [ywayPerKyat, setYwayPerKyat] = useState(128);

//   const [kyat, setKyat] = useState(1);
//   const [pe, setPe] = useState(pePerKyat);
//   const [yway, setYway] = useState(ywayPerKyat);
//   const [goldList, setGoldList] = useState([]);

//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(""); // "buy" or "sell"
//   const [password, setPassword] = useState("");
//   const [countdown, setCountdown] = useState(10);
//   const [timer, setTimer] = useState(null);

//   const API_BASE = "http://38.60.244.74:3000";

//   // Fetch full price history and latest prices (Buy + Sell)
//   useEffect(() => {
//     fetchPriceHistory(); // Chart data
//     fetchLatestBuyPrice(); // SummaryCard Buy Price
//     fetchLatestSellPrice(); // ✅ SummaryCard Sell Price
//   }, []);

//   // Fetch full price history for charts
//   const fetchPriceHistory = async () => {
//     try {
//       const [buyRes, sellRes] = await Promise.all([
//         axios.get(`${API_BASE}/buying-prices`),
//         axios.get(`${API_BASE}/selling-prices`),
//       ]);

//       const buyData = buyRes.data.map((item) => ({
//         time: item.time,
//         buy: item.price,
//       }));

//       const sellData = sellRes.data.map((item) => ({
//         time: item.time,
//         sell: item.price,
//       }));

//       setChartBuyData(buyData);
//       setChartSellData(sellData);
//     } catch (err) {
//       console.error("Failed to fetch price history", err);
//     }
//   };

//   // Fetch latest buy price from cloud for SummaryCard
//   const fetchLatestBuyPrice = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/buying-prices/latest`);
//       const latest = res.data.price; // assuming API returns { price: ... }
//       setBuyPrice(latest);
//       setBuyInput(latest);
//     } catch (err) {
//       console.error("Failed to fetch latest buy price", err);
//     }
//   };

//   // ✅ Fetch latest sell price from cloud for SummaryCard
//   const fetchLatestSellPrice = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/selling-prices/latest`);
//       const latest = res.data.price;
//       setSellPrice(latest);
//       setSellInput(latest);
//     } catch (err) {
//       console.error("Failed to fetch latest sell price", err);
//     }
//   };

//   const handleAddGold = () => {
//     setGoldList((prev) => [...prev, { kyat, pe, yway }]);
//     setTimeout(() => {
//       setKyat(1);
//       setPe(pePerKyat);
//       setYway(ywayPerKyat);
//     }, 0);
//   };

//   const handleUpdateClick = (type) => {
//     setModalType(type);
//     setPassword("");
//     setCountdown(10);
//     setShowModal(true);
//   };

//   const startCountdown = (type) => {
//     let timeLeft = 10;
//     const interval = setInterval(() => {
//       timeLeft -= 1;
//       setCountdown(timeLeft);
//       if (timeLeft <= 0) {
//         clearInterval(interval);
//         applyUpdate(type);
//       }
//     }, 1000);
//     setTimer(interval);
//   };

//   const applyUpdate = async (type) => {
//     try {
//       if (type === "buy") {
//         await axios.post(`${API_BASE}/buying-prices`, { price: buyInput });
//         fetchLatestBuyPrice(); // refresh Buy
//         setChartBuyData([
//           ...chartBuyData,
//           { time: new Date().toLocaleTimeString(), buy: buyInput },
//         ]);
//       } else if (type === "sell") {
//         await axios.post(`${API_BASE}/selling-prices`, { price: sellInput });
//         fetchLatestSellPrice(); // refresh Sell
//         setChartSellData([
//           ...chartSellData,
//           { time: new Date().toLocaleTimeString(), sell: sellInput },
//         ]);
//       }
//     } catch (err) {
//       alert("❌ Failed to update price: " + err.message);
//     } finally {
//       setShowModal(false);
//     }
//   };

//   const handlePasswordSubmit = () => {
//     if (password === "1234") startCountdown(modalType);
//     else alert("❌ Incorrect password");
//   };

//   const cancelUpdate = () => {
//     clearInterval(timer);
//     setShowModal(false);
//     setCountdown(10);
//   };

//   return (
//     <div className="bg-neutral-950 text-neutral-100 space-y-6">
//       <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
//         {/* Gold Conversion */}
//         <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
//           <h3 className="font-semibold mb-2">Custom Gold Conversion</h3>
//           <div className="flex items-center justify-between gap-2 flex-wrap mt-2">
//             <div>
//               <span>1 ကျပ် = </span>
//               <input
//                 type="number"
//                 value={pe}
//                 onChange={(e) => setPe(Number(e.target.value))}
//                 className="w-16 rounded-lg bg-neutral-800 border px-2 py-1 text-sm"
//                 placeholder="ပဲ"
//               />
//               <span> ပဲ </span>
//               <input
//                 type="number"
//                 value={yway}
//                 onChange={(e) => setYway(Number(e.target.value))}
//                 className="w-16 rounded-lg bg-neutral-800 border px-2 py-1 text-sm"
//                 placeholder="ရွေး"
//               />
//               <span> ရွေး </span>
//               <button
//                 onClick={handleAddGold}
//                 className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm ml-4"
//               >
//                 Add
//               </button>
//             </div>
//             <div>
//               {goldList.length > 0 && (
//                 <div className="ml-4 text-sm text-neutral-400">
//                   Last Update: {goldList[goldList.length - 1].kyat} ကျပ်{" "}
//                   {goldList[goldList.length - 1].pe} ပဲ{" "}
//                   {goldList[goldList.length - 1].yway} ရွေး
//                 </div>
//               )}
//             </div>
//           </div>
//           {goldList.length > 0 && (
//             <div
//               className="overflow-y-auto mt-2 border border-neutral-800 rounded-lg"
//               style={{ maxHeight: "8rem" }}
//             >
//               <table className="w-full text-sm border-collapse">
//                 <thead className="sticky top-0 bg-neutral-900 z-10">
//                   <tr className="border-b border-neutral-700">
//                     <th className="px-2 py-1 text-left">#</th>
//                     <th className="px-2 py-1 text-left">ကျပ်</th>
//                     <th className="px-2 py-1 text-left">ပဲ</th>
//                     <th className="px-2 py-1 text-left">ရွေး</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {goldList.map((g, idx) => (
//                     <tr key={idx} className="border-b border-neutral-800">
//                       <td className="px-2 py-1">{idx + 1}</td>
//                       <td className="px-2 py-1">{g.kyat}</td>
//                       <td className="px-2 py-1">{g.pe}</td>
//                       <td className="px-2 py-1">{g.yway}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>

//         {/* Buy + Sell Charts */}
//         <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           {/* Buy */}
//           <div>
//             <div className="w-[300px]">
//               <SummaryCard
//                 title="Buy Price"
//                 value={`${buyPrice} Ks`}
//                 sub="Updated"
//                 icon={<ArrowUpRight className="h-5 w-5" />}
//                 accent="from-yellow-500/20 to-transparent "
//               />
//             </div>
//             <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 mt-6">
//               <h3 className="font-semibold mb-3">Buy Price & Chart</h3>
//               <div className="flex items-center gap-4 mb-4">
//                 <input
//                   type="number"
//                   value={buyInput}
//                   onChange={(e) => setBuyInput(Number(e.target.value))}
//                   className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm"
//                 />
//                 <button
//                   onClick={() => handleUpdateClick("buy")}
//                   className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
//                 >
//                   Update
//                 </button>
//               </div>
//               <div className="h-56">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={chartBuyData}>
//                     <defs>
//                       <linearGradient id="buy" x1="0" y1="0" x2="0" y2="1">
//                         <stop
//                           offset="5%"
//                           stopColor="#f59e0b"
//                           stopOpacity={0.3}
//                         />
//                         <stop
//                           offset="95%"
//                           stopColor="#f59e0b"
//                           stopOpacity={0}
//                         />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
//                     <XAxis dataKey="time" stroke="#a3a3a3" />
//                     <YAxis stroke="#a3a3a3" width={80} />
//                     <Tooltip
//                       contentStyle={{
//                         background: "#0a0a0a",
//                         border: "1px solid #262626",
//                       }}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="buy"
//                       stroke="#f59e0b"
//                       fill="url(#buy)"
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Sell */}
//           <div>
//             <div className="w-[300px]">
//               <SummaryCard
//                 title="Sell Price"
//                 value={`${sellPrice} Ks`}
//                 sub="Updated"
//                 icon={<ArrowDownRight className="h-5 w-5" />}
//                 accent="from-emerald-500/20 to-transparent"
//               />
//             </div>
//             <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 mt-6">
//               <h3 className="font-semibold mb-3">Sell Price & Chart</h3>
//               <div className="flex items-center gap-4 mb-4">
//                 <input
//                   type="number"
//                   value={sellInput}
//                   onChange={(e) => setSellInput(Number(e.target.value))}
//                   className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm"
//                 />
//                 <button
//                   onClick={() => handleUpdateClick("sell")}
//                   className="bg-emerald-500 text-black px-3 py-2 rounded-md text-sm"
//                 >
//                   Update
//                 </button>
//               </div>
//               <div className="h-56">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={chartSellData}>
//                     <defs>
//                       <linearGradient id="sell" x1="0" y1="0" x2="0" y2="1">
//                         <stop
//                           offset="5%"
//                           stopColor="#22c55e"
//                           stopOpacity={0.3}
//                         />
//                         <stop
//                           offset="95%"
//                           stopColor="#22c55e"
//                           stopOpacity={0}
//                         />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
//                     <XAxis dataKey="time" stroke="#a3a3a3" />
//                     <YAxis stroke="#a3a3a3" width={80} />
//                     <Tooltip
//                       contentStyle={{
//                         background: "#0a0a0a",
//                         border: "1px solid #262626",
//                       }}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="sell"
//                       stroke="#22c55e"
//                       fill="url(#sell)"
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* Password Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
//             <button
//               onClick={cancelUpdate}
//               className="absolute top-2 right-2 text-neutral-400 hover:text-white"
//             >
//               <X size={18} />
//             </button>

//             <h3 className="text-lg font-semibold mb-4 text-center">
//               {countdown === 10
//                 ? `Enter Password to Update ${
//                     modalType === "buy" ? "Buy" : "Sell"
//                   } Price`
//                 : `Updating in ${countdown}s...`}
//             </h3>

//             {countdown === 10 ? (
//               <>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter password"
//                   className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
//                 />
//                 <div className="flex justify-between">
//                   <button
//                     onClick={cancelUpdate}
//                     className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handlePasswordSubmit}
//                     className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col items-center">
//                 <div className="w-full bg-neutral-800 rounded-full h-2 mb-3">
//                   <div
//                     className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
//                     style={{ width: `${(countdown / 10) * 100}%` }}
//                   ></div>
//                 </div>
//                 <button
//                   onClick={cancelUpdate}
//                   className="bg-red-500 text-black px-3 py-2 rounded-md text-sm"
//                 >
//                   Cancel Update
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function SummaryCard({ title, value, sub, icon, accent }) {
//   return (
//     <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//       <div
//         className={
//           "pointer-events-none absolute inset-0 bg-gradient-to-br " +
//           (accent || "from-yellow-500/10 to-transparent")
//         }
//       />
//       <div className="relative flex items-start justify-between">
//         <div>
//           <p className="text-xs text-neutral-400 mb-1">{title}</p>
//           <p className="text-xl font-semibold text-yellow-300">{value}</p>
//           {sub && <p className="mt-1 text-xs text-neutral-400">{sub}</p>}
//         </div>
//         <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-yellow-400">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import BuyingPricesChart from "./BuyingPricesChart";
import SellingPricesChart from "./SellingPricesChart";

export default function GoldManagementPage() {
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [buyInput, setBuyInput] = useState(0);
  const [sellInput, setSellInput] = useState(0);
  const [chartBuyData, setChartBuyData] = useState([]);
  const [chartSellData, setChartSellData] = useState([]);

  const [pePerKyat, setPePerKyat] = useState(16);
  const [ywayPerKyat, setYwayPerKyat] = useState(128);

  const [kyat, setKyat] = useState(1);
  const [pe, setPe] = useState(pePerKyat);
  const [yway, setYway] = useState(ywayPerKyat);
  const [goldList, setGoldList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "buy" or "sell"
  const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [timer, setTimer] = useState(null);

  const API_BASE = "http://38.60.244.74:3000";

  // Fetch full price history and latest prices (Buy + Sell)
  useEffect(() => {
    fetchPriceHistory(); // Chart data
    fetchLatestBuyPrice(); // SummaryCard Buy Price
    fetchLatestSellPrice(); // ✅ SummaryCard Sell Price
  }, []);

  // Fetch full price history for charts
  const fetchPriceHistory = async () => {
    try {
      const [buyRes, sellRes] = await Promise.all([
        axios.get(`${API_BASE}/buying-prices`),
        axios.get(`${API_BASE}/selling-prices`),
      ]);

      const buyData = buyRes.data.map((item) => ({
        time: item.time,
        buy: item.price,
      }));

      const sellData = sellRes.data.map((item) => ({
        time: item.time,
        sell: item.price,
      }));

      setChartBuyData(buyData);
      setChartSellData(sellData);
    } catch (err) {
      console.error("Failed to fetch price history", err);
    }
  };

  // Fetch latest buy price from cloud for SummaryCard
  const fetchLatestBuyPrice = async () => {
    try {
      const res = await axios.get(`${API_BASE}/buying-prices/latest`);
      const latest = res.data.price; // assuming API returns { price: ... }
      setBuyPrice(latest);
      setBuyInput(latest);
    } catch (err) {
      console.error("Failed to fetch latest buy price", err);
    }
  };

  // ✅ Fetch latest sell price from cloud for SummaryCard
  const fetchLatestSellPrice = async () => {
    try {
      const res = await axios.get(`${API_BASE}/selling-prices/latest`);
      const latest = res.data.price;
      setSellPrice(latest);
      setSellInput(latest);
    } catch (err) {
      console.error("Failed to fetch latest sell price", err);
    }
  };

  const handleAddGold = () => {
    setGoldList((prev) => [...prev, { kyat, pe, yway }]);
    setTimeout(() => {
      setKyat(1);
      setPe(pePerKyat);
      setYway(ywayPerKyat);
    }, 0);
  };

  const handleUpdateClick = (type) => {
    setModalType(type);
    setPassword("");
    setCountdown(10);
    setShowModal(true);
  };

  const startCountdown = (type) => {
    let timeLeft = 10;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        applyUpdate(type);
      }
    }, 1000);
    setTimer(interval);
  };

  const applyUpdate = async (type) => {
    try {
      if (type === "buy") {
        await axios.post(`${API_BASE}/buying-prices`, { price: buyInput });
        fetchLatestBuyPrice(); // refresh Buy
        setChartBuyData([
          ...chartBuyData,
          { time: new Date().toLocaleTimeString(), buy: buyInput },
        ]);
      } else if (type === "sell") {
        await axios.post(`${API_BASE}/selling-prices`, { price: sellInput });
        fetchLatestSellPrice(); // refresh Sell
        setChartSellData([
          ...chartSellData,
          { time: new Date().toLocaleTimeString(), sell: sellInput },
        ]);
      }
    } catch (err) {
      alert("❌ Failed to update price: " + err.message);
    } finally {
      setShowModal(false);
    }
  };




  const handlePasswordSubmit = () => {
    if (password === "1234") startCountdown(modalType);
    else alert("❌ Incorrect password");
  };

  const cancelUpdate = () => {
    clearInterval(timer);
    setShowModal(false);
    setCountdown(10);
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 space-y-6">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Gold Conversion */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
          <h3 className="font-semibold mb-2">Custom Gold Conversion</h3>
          <div className="flex items-center justify-between gap-2 flex-wrap mt-2">
            <div>
              <span>1 ကျပ် = </span>
              <input
                type="number"
                value={pe}
                onChange={(e) => setPe(Number(e.target.value))}
                className="w-16 rounded-lg bg-neutral-800 border px-2 py-1 text-sm"
                placeholder="ပဲ"
              />
              <span> ပဲ </span>
              <input
                type="number"
                value={yway}
                onChange={(e) => setYway(Number(e.target.value))}
                className="w-16 rounded-lg bg-neutral-800 border px-2 py-1 text-sm"
                placeholder="ရွေး"
              />
              <span> ရွေး </span>
              <button
                onClick={handleAddGold}
                className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm ml-4"
              >
                Add
              </button>
            </div>
            <div>
              {goldList.length > 0 && (
                <div className="ml-4 text-sm text-neutral-400">
                  Last Update: {goldList[goldList.length - 1].kyat} ကျပ်{" "}
                  {goldList[goldList.length - 1].pe} ပဲ{" "}
                  {goldList[goldList.length - 1].yway} ရွေး
                </div>
              )}
            </div>
          </div>
          {goldList.length > 0 && (
            <div
              className="overflow-y-auto mt-2 border border-neutral-800 rounded-lg"
              style={{ maxHeight: "8rem" }}
            >
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-neutral-900 z-10">
                  <tr className="border-b border-neutral-700">
                    <th className="px-2 py-1 text-left">#</th>
                    <th className="px-2 py-1 text-left">ကျပ်</th>
                    <th className="px-2 py-1 text-left">ပဲ</th>
                    <th className="px-2 py-1 text-left">ရွေး</th>
                  </tr>
                </thead>
                <tbody>
                  {goldList.map((g, idx) => (
                    <tr key={idx} className="border-b border-neutral-800">
                      <td className="px-2 py-1">{idx + 1}</td>
                      <td className="px-2 py-1">{g.kyat}</td>
                      <td className="px-2 py-1">{g.pe}</td>
                      <td className="px-2 py-1">{g.yway}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Buy + Sell Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Buy */}
          <div>
            <div className="w-[300px]">
              <SummaryCard
                title="Buy Price"
                value={`${buyPrice} Ks`}
                sub="Updated"
                icon={<ArrowUpRight className="h-5 w-5" />}
                accent="from-yellow-500/20 to-transparent "
              />
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 mt-6">
              <h3 className="font-semibold mb-3">Buy Price & Chart</h3>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="number"
                  value={buyInput}
                  onChange={(e) => setBuyInput(Number(e.target.value))}
                  className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm"
                />
                <button
                  onClick={() => handleUpdateClick("buy")}
                  className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
                >
                  Update
                </button>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartBuyData}>
                    <defs>
                      <linearGradient id="buy" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#f59e0b"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" width={80} />
                    <Tooltip
                      contentStyle={{
                        background: "#0a0a0a",
                        border: "1px solid #262626",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="buy"
                      stroke="#f59e0b"
                      fill="url(#buy)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sell */}
          <div>
            <div className="w-[300px]">
              <SummaryCard
                title="Sell Price"
                value={`${sellPrice} Ks`}
                sub="Updated"
                icon={<ArrowDownRight className="h-5 w-5" />}
                accent="from-emerald-500/20 to-transparent"
              />
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 mt-6">
              <h3 className="font-semibold mb-3">Sell Price & Chart</h3>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="number"
                  value={sellInput}
                  onChange={(e) => setSellInput(Number(e.target.value))}
                  className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm"
                />
                <button
                  onClick={() => handleUpdateClick("sell")}
                  className="bg-emerald-500 text-black px-3 py-2 rounded-md text-sm"
                >
                  Update
                </button>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartSellData}>
                    <defs>
                      <linearGradient id="sell" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" width={80} />
                    <Tooltip
                      contentStyle={{
                        background: "#0a0a0a",
                        border: "1px solid #262626",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sell"
                      stroke="#22c55e"
                      fill="url(#sell)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Today and Yesterday Buying Chart */}
        <BuyingPricesChart />
        <SellingPricesChart />
      </div>

      {/* Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={cancelUpdate}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              {countdown === 10
                ? `Enter Password to Update ${
                    modalType === "buy" ? "Buy" : "Sell"
                  } Price`
                : `Updating in ${countdown}s...`}
            </h3>

            {countdown === 10 ? (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={cancelUpdate}
                    className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full bg-neutral-800 rounded-full h-2 mb-3">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(countdown / 10) * 100}%` }}
                  ></div>
                </div>
                <button
                  onClick={cancelUpdate}
                  className="bg-red-500 text-black px-3 py-2 rounded-md text-sm"
                >
                  Cancel Update
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, sub, icon, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div
        className={
          "pointer-events-none absolute inset-0 bg-gradient-to-br " +
          (accent || "from-yellow-500/10 to-transparent")
        }
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-400 mb-1">{title}</p>
          <p className="text-xl font-semibold text-yellow-300">{value}</p>
          {sub && <p className="mt-1 text-xs text-neutral-400">{sub}</p>}
        </div>
        <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-yellow-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
