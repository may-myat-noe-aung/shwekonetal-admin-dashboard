
import React, { useEffect, useState } from "react";
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
      const apiData = res.data.data;

      if (Array.isArray(apiData)) {
        // Convert API data
        let chartData = apiData.map((item) => ({
          date: item[0],
          buyGold: Number(item[1]) || 0,
          sellGold: Number(item[2]) || 0,
        }));

        // Filter last 6 unique dates
        const uniqueDates = [...new Set(chartData.map((d) => d.date))].slice(-6);
        chartData = chartData.filter((d) => uniqueDates.includes(d.date));

        // Sum buy and sell amounts
        const totals = chartData.reduce(
          (acc, d) => {
            acc.buyGold += d.buyGold;
            acc.sellGold += d.sellGold;
            return acc;
          },
          { buyGold: 0, sellGold: 0 }
        );

        const totalSum = totals.buyGold + totals.sellGold || 1; // prevent divide by zero

        setData([
          {
            name: "Buy Gold",
            value: totals.buyGold,
            color: "#22c55e",
            percent: Math.round((totals.buyGold / totalSum) * 100),
          },
          {
            name: "Sell Gold",
            value: totals.sellGold,
            color: "#ef4444",
            percent: Math.round((totals.sellGold / totalSum) * 100),
          },
        ]);
      } else {
        console.warn("API returned invalid data format.");
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

  if (data.length === 0)
    return (
      <div className="text-center py-10 text-neutral-400">
        No data available for chart.
      </div>
    );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="font-semibold mb-2 text-yellow-400">Buy Gold vs Sell Gold Ratio</h3>
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
