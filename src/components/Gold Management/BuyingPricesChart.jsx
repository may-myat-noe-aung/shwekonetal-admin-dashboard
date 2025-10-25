// import React, { useState, useEffect } from "react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";

// const buyingPrices = [
//   { id: "BP20251023171450", price: 222222, time: "17:14:50", date: "2025-10-22" },
//   { id: "BP20251023170908", price: 222222, time: "17:09:08", date: "2025-10-22" },
//   { id: "BP20251023165947", price: 1111111, time: "16:59:47", date: "2025-10-22" },
//   { id: "BP20251023154621", price: 1111111, time: "15:46:21", date: "2025-10-22" },
//   { id: "BP20251024432944", price: 4440000, time: "03:59:44", date: "2025-10-23" },
//   { id: "BP20251023033423", price: 3330000, time: "03:37:57", date: "2025-10-23" },
//    { id: "BP20251024432344", price: 4440000, time: "03:59:44", date: "2025-10-22" },
//   { id: "BP20251023033323", price: 3330000, time: "03:37:57", date: "2025-10-22" },
// ];

// export default function BuyingPricesChart() {
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const today = new Date();
//     const todayStr = today.toISOString().split("T")[0];

//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);
//     const yesterdayStr = yesterday.toISOString().split("T")[0];

//     const todayData = buyingPrices
//       .filter((item) => item.date === todayStr)
//       .map((item) => ({ time: item.time, buy: item.price }));

//     const yesterdayData = buyingPrices
//       .filter((item) => item.date === yesterdayStr)
//       .map((item) => ({ time: item.time, sell: item.price }));

//     // Merge by same time
//     const allTimes = Array.from(
//       new Set([...todayData.map(d => d.time), ...yesterdayData.map(d => d.time)])
//     ).sort();

//     const merged = allTimes.map(time => {
//       const todayItem = todayData.find(d => d.time === time);
//       const yesterdayItem = yesterdayData.find(d => d.time === time);
//       return {
//         time,
//         buy: todayItem ? todayItem.buy : null,
//         sell: yesterdayItem ? yesterdayItem.sell : null,
//       };
//     });

//     setChartData(merged);
//   }, []);

//   return (
//     <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//       <h3 className="font-semibold mb-3 text-white">Today vs Yesterday (Hourly)</h3>
//       <div className="h-72">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart data={chartData}>
//             <defs>
//               <linearGradient id="today" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
//               </linearGradient>
//               <linearGradient id="yesterday" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#9C0003" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#9C0003" stopOpacity={0} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
//             <XAxis dataKey="time" stroke="#a3a3a3" />
//             <YAxis stroke="#a3a3a3" width={80} />
//             <Tooltip
//               contentStyle={{
//                 background: "#0a0a0a",
//                 border: "1px solid #262626",
//                 color: "#fff",
//               }}
//             />
//             <Area
//               type="monotone"
//               dataKey="buy"
//               stroke="#22c55e"
//               strokeWidth={3}
//               fill="url(#today)"
//               name="Today"
//               connectNulls
//             />
//             <Area
//               type="monotone"
//               dataKey="sell"
//               stroke="#9C0003"
//               strokeWidth={3}
//               fill="url(#yesterday)"
//               name="Yesterday"
//               connectNulls
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </section>
//   );
// }


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";

// export default function BuyingPricesChart() {
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE}/buying-prices`);
//         console.log("API response:", res.data);

//         // ✅ handle both cases safely
//         const data = Array.isArray(res.data)
//           ? res.data
//           : res.data.data || [];

//         const today = new Date();
//         const todayStr = today.toISOString().split("T")[0];

//         const yesterday = new Date();
//         yesterday.setDate(today.getDate() - 1);
//         const yesterdayStr = yesterday.toISOString().split("T")[0];

//         const todayData = data
//           .filter((item) => item.date.startsWith(todayStr))
//           .map((item) => ({
//             time: item.time,
//             buy: item.price,
//           }));

//         const yesterdayData = data
//           .filter((item) => item.date.startsWith(yesterdayStr))
//           .map((item) => ({
//             time: item.time,
//             sell: item.price,
//           }));

//         const allTimes = Array.from(
//           new Set([...todayData.map((d) => d.time), ...yesterdayData.map((d) => d.time)])
//         ).sort();

//         const merged = allTimes.map((time) => {
//           const todayItem = todayData.find((d) => d.time === time);
//           const yesterdayItem = yesterdayData.find((d) => d.time === time);
//           return {
//             time,
//             buy: todayItem ? todayItem.buy : null,
//             sell: yesterdayItem ? yesterdayItem.sell : null,
//           };
//         });

//         setChartData(merged);
//       } catch (error) {
//         console.error("Error fetching buying prices:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//       <h3 className="font-semibold mb-3 text-white">Today vs Yesterday (Hourly)</h3>
//       <div className="h-72">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart data={chartData}>
//             <defs>
//               <linearGradient id="today" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
//               </linearGradient>
//               <linearGradient id="yesterday" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#9C0003" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#9C0003" stopOpacity={0} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
//             <XAxis dataKey="time" stroke="#a3a3a3" />
//             <YAxis stroke="#a3a3a3" width={80} />
//             <Tooltip
//               contentStyle={{
//                 background: "#0a0a0a",
//                 border: "1px solid #262626",
//                 color: "#fff",
//               }}
//             />
//             <Area
//               type="monotone"
//               dataKey="buy"
//               stroke="#22c55e"
//               strokeWidth={3}
//               fill="url(#today)"
//               name="Today"
//               connectNulls
//             />
//             <Area
//               type="monotone"
//               dataKey="sell"
//               stroke="#9C0003"
//               strokeWidth={3}
//               fill="url(#yesterday)"
//               name="Yesterday"
//               connectNulls
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </section>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const API_BASE = "http://38.60.244.74:3000"; // 🟡 change to your real backend URL

export default function BuyingPricesChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/buying-prices`);
        let data = res.data;

        // 🧩 Some APIs wrap the array inside another object (e.g., { message, data })
        // If that's the case, adjust like this:
        if (!Array.isArray(data)) {
          data = data.data || [];
        }

        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const todayData = data
          .filter((item) => item.date && item.date.startsWith(todayStr))
          .map((item) => ({ time: item.time, buy: item.price }));

        const yesterdayData = data
          .filter((item) => item.date && item.date.startsWith(yesterdayStr))
          .map((item) => ({ time: item.time, sell: item.price }));

        // ⏱ Merge by unique time keys
        const allTimes = Array.from(
          new Set([...todayData.map((d) => d.time), ...yesterdayData.map((d) => d.time)])
        ).sort();

        const merged = allTimes.map((time) => {
          const todayItem = todayData.find((d) => d.time === time);
          const yesterdayItem = yesterdayData.find((d) => d.time === time);
          return {
            time,
            buy: todayItem ? todayItem.buy : null,
            sell: yesterdayItem ? yesterdayItem.sell : null,
          };
        });

        setChartData(merged);
      } catch (err) {
        console.error("Error fetching buying prices:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="font-semibold mb-3 text-white">Buy Price — Today vs Yesterday (Hourly)</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="today" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="yesterday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9C0003" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9C0003" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="time" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" width={80} />
            <Tooltip
              contentStyle={{
                background: "#0a0a0a",
                border: "1px solid #262626",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="buy"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#today)"
              name="Today"
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="sell"
              stroke="#9C0003"
              strokeWidth={3}
              fill="url(#yesterday)"
              name="Yesterday"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
