// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";

// const API_BASE = "http://38.60.244.74:3000";

// export default function BuySellTrendChart() {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchChartData();
//   }, []);

//   const fetchChartData = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/report-buy-sell-chart`);
//       if (res.data.success && Array.isArray(res.data.data)) {
//         // Format data
//         let formatted = res.data.data.map((item) => ({
//           date: item[0],
//           buy: item[1],  // buy
//           sell: item[2], // sell
//         }));

//         // Filter last 6 days
//         const uniqueDates = [...new Set(formatted.map((d) => d.date))].slice(-6);
//         formatted = formatted.filter((d) => uniqueDates.includes(d.date));

//         setChartData(formatted);
//       }
//     } catch (err) {
//       console.error("Error fetching chart data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-10 text-neutral-400">
//         Loading chart data...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
//       <h3 className="font-semibold mb-2 text-yellow-400">Buy vs Sell Trend</h3>
//       <div className="h-56">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart data={chartData}>
//             <defs>
//               <linearGradient id="gBuy" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
//                 <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
//               </linearGradient>
//               <linearGradient id="gSell" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
//                 <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
//             <XAxis dataKey="date" stroke="#a3a3a3" />
//             <YAxis stroke="#a3a3a3" />
//             <Tooltip
//               contentStyle={{
//                 background: "#0a0a0a",
//                 border: "1px solid #262626",
//               }}
//               formatter={(value) => value.toLocaleString()}
//             />
//             <Area type="monotone" dataKey="buy" stroke="#22c55e" fill="url(#gBuy)" />
//             <Area type="monotone" dataKey="sell" stroke="#ef4444" fill="url(#gSell)" />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const API_BASE = "http://38.60.244.74:3000";

export default function ReportBuySellChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/report-buy-sell-chart`);
      if (res.data.success && Array.isArray(res.data.data)) {
        // Convert API data to chart format
        let data = res.data.data.map((item) => ({
          date: item[0],
          buy: item[1],
          sell: item[2],
        }));

        // Filter last 6 unique dates
        const uniqueDates = [
          ...new Set(data.map((d) => d.date))
        ].slice(-6);

        data = data.filter((d) => uniqueDates.includes(d.date));

        // Remove duplicate dates by summing amounts
        const map = {};
        data.forEach((d) => {
          if (!map[d.date]) map[d.date] = { date: d.date, buy: 0, sell: 0 };
          map[d.date].buy += d.buy;
          map[d.date].sell += d.sell;
        });

        // Sort by date
        const finalData = Object.values(map).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setChartData(finalData);
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-neutral-400">
        Loading chart data...
      </div>
    );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 h-ful">
      <h3 className="font-semibold mb-2 text-yellow-400">Buy vs Sell Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gBuy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip
              contentStyle={{
                background: "#0a0a0a",
                border: "1px solid #262626",
              }}
              formatter={(value) => value.toLocaleString()}
            />
            <Area type="monotone" dataKey="buy" stroke="#22c55e" fill="url(#gBuy)" />
            <Area type="monotone" dataKey="sell" stroke="#ef4444" fill="url(#gSell)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

