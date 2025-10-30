// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// const API_BASE = "http://38.60.244.74:3000";

// export default function ReportBuySellRatio() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchChartData();
//   }, []);

//   const fetchChartData = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/report-buy-sell-chart`);
//       if (res.data.success && Array.isArray(res.data.data)) {
//         // Convert API data to {date, buy, sell}
//         let chartData = res.data.data.map((item) => ({
//           date: item[0],
//           buy: item[1],
//           sell: item[2],
//         }));

//         // Filter last 6 unique dates
//         const uniqueDates = [...new Set(chartData.map((d) => d.date))].slice(-6);
//         chartData = chartData.filter((d) => uniqueDates.includes(d.date));

//         // Sum buy and sell amounts
//         const totals = chartData.reduce(
//           (acc, d) => {
//             acc.buy += d.buy;
//             acc.sell += d.sell;
//             return acc;
//           },
//           { buy: 0, sell: 0 }
//         );

//         setData([
//           {
//             name: "Buy",
//             value: totals.buy,
//             color: "#22c55e",
//             percent: Math.round((totals.buy / (totals.buy + totals.sell)) * 100),
//           },
//           {
//             name: "Sell",
//             value: totals.sell,
//             color: "#ef4444",
//             percent: Math.round((totals.sell / (totals.buy + totals.sell)) * 100),
//           },
//         ]);
//       }
//     } catch (err) {
//       console.error("Error fetching chart data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="text-center py-10 text-neutral-400">
//         Loading chart data...
//       </div>
//     );

//   return (
//     <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//       <h3 className="font-semibold mb-2 text-yellow-400">Buy vs Sell Ratio</h3>
//       <div className="h-56">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey="value"
//               nameKey="name"
//               innerRadius={40}
//               outerRadius={75}
//               paddingAngle={3}
//             >
//               {data.map((d, i) => (
//                 <Cell key={i} fill={d.color} />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
//         {data.map((p) => (
//           <div key={p.name} className="flex items-center gap-2">
//             <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
//             <div>
//               {p.name}: <strong>{p.percent}%</strong>
//               <div className="text-neutral-400 text-xs">{p.value.toLocaleString()} Ks</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API_BASE = "http://38.60.244.74:3000";

export default function ReportBuySellRatio() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/report-buy-sell-chart`);
      if (res.data.success && Array.isArray(res.data.data)) {
        // Convert API data to {date, buy, sell}
        let chartData = res.data.data.map((item) => ({
          date: item[0],
          buy: item[1],
          sell: item[2],
        }));

        // Filter last 6 unique dates
        const uniqueDates = [...new Set(chartData.map((d) => d.date))].slice(-6);
        chartData = chartData.filter((d) => uniqueDates.includes(d.date));

        // Sum buy and sell amounts
        const totals = chartData.reduce(
          (acc, d) => {
            acc.buy += d.buy;
            acc.sell += d.sell;
            return acc;
          },
          { buy: 0, sell: 0 }
        );

        setData([
          {
            name: "Buy",
            value: totals.buy,
            color: "#22c55e",
            percent: Math.round((totals.buy / (totals.buy + totals.sell)) * 100),
          },
          {
            name: "Sell",
            value: totals.sell,
            color: "#ef4444",
            percent: Math.round((totals.sell / (totals.buy + totals.sell)) * 100),
          },
        ]);
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
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="font-semibold mb-2 text-yellow-400">Buy vs Sell Ratio</h3>
      <div className="h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={75}
              paddingAngle={3}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {data.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
            <div>
              {p.name}: <strong>{p.percent}%</strong>
              <div className="text-neutral-400 text-xs">{p.value.toLocaleString()} Ks</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
