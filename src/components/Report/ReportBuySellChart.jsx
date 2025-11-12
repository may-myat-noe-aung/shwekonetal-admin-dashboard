

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
      const apiData = res.data.data;

      if (Array.isArray(apiData)) {
        // Convert API data to chart format
        let data = apiData.map((item) => ({
          date: item[0],
          buyGold: Number(item[1]) || 0,
          sellGold: Number(item[2]) || 0,
        }));

        // Filter last 6 unique dates
        const uniqueDates = [...new Set(data.map((d) => d.date))].slice(-6);
        data = data.filter((d) => uniqueDates.includes(d.date));

        // Merge duplicates (if any)
        const map = {};
        data.forEach((d) => {
          if (!map[d.date])
            map[d.date] = { date: d.date, buyGold: 0, sellGold: 0 };
          map[d.date].buyGold += d.buyGold;
          map[d.date].sellGold += d.sellGold;
        });

        const finalData = Object.values(map).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setChartData(finalData);
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

  if (chartData.length === 0)
    return (
      <div className="text-center py-10 text-neutral-400">
        No data available for chart.
      </div>
    );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 h-full">
      <h3 className="font-semibold mb-2 text-yellow-400">
        Buy Gold vs Sell Gold Trend
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gBuyGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSellGold" x1="0" y1="0" x2="0" y2="1">
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
            <Area
              type="monotone"
              dataKey="buyGold"
              stroke="#22c55e"
              fill="url(#gBuyGold)"
            />
            <Area
              type="monotone"
              dataKey="sellGold"
              stroke="#ef4444"
              fill="url(#gSellGold)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
