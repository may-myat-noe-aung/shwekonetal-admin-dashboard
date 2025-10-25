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

const API_BASE = "http://38.60.244.74:3000";

export default function SellingPricesChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/selling-prices`);
        let data = res.data;

        // Some APIs return { message, data: [...] } — handle both
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
          .map((item) => ({ time: item.time, today: item.price }));

        const yesterdayData = data
          .filter((item) => item.date && item.date.startsWith(yesterdayStr))
          .map((item) => ({ time: item.time, yesterday: item.price }));

        // Merge both datasets by time
        const allTimes = Array.from(
          new Set([...todayData.map((d) => d.time), ...yesterdayData.map((d) => d.time)])
        ).sort();

        const merged = allTimes.map((time) => {
          const todayItem = todayData.find((d) => d.time === time);
          const yesterdayItem = yesterdayData.find((d) => d.time === time);
          return {
            time,
            today: todayItem ? todayItem.today : null,
            yesterday: yesterdayItem ? yesterdayItem.yesterday : null,
          };
        });

        setChartData(merged);
      } catch (err) {
        console.error("Error fetching selling prices:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="font-semibold mb-3 text-white">Sell Price — Today vs Yesterday (Hourly)</h3>
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
              dataKey="today"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#today)"
              name="Today"
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="yesterday"
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
