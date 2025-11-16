

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
        const data = res.data; // nested object by date

        // --- Step 1: first key = Today, second key = Yesterday ---
        const keys = Object.keys(data);
        if (keys.length < 2) return;

        const todayDate = keys[0];
        const yesterdayDate = keys[1];

        // --- Step 2: Convert to array & filter nulls ---
        const convertToArray = (dateStr) => {
          if (!data[dateStr]) return [];
          return Object.entries(data[dateStr])
            .filter(([_, price]) => price !== null)
            .map(([time, price]) => ({ time, price }));
        };

        const todayData = convertToArray(todayDate);
        const yesterdayData = convertToArray(yesterdayDate);

        // --- Step 3: Merge time points ---
        const allTimes = Array.from(
          new Set([...todayData.map(d => d.time), ...yesterdayData.map(d => d.time)])
        ).sort((a, b) => {
          const [h1, m1] = a.split(":").map(Number);
          const [h2, m2] = b.split(":").map(Number);
          return h1 - h2 || m1 - m2;
        });

        const merged = allTimes.map(time => ({
          time,
          today: todayData.find(d => d.time === time)?.price || null,
          yesterday: yesterdayData.find(d => d.time === time)?.price || null,
        }));

        setChartData(merged);
      } catch (err) {
        console.error("Error fetching selling prices:", err);
      }
    };

    fetchData(); // initial fetch

    const interval = setInterval(fetchData, 500); // refresh every 0.5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="font-semibold mb-3 text-white">
        Sell Price — Today vs Yesterday (Hourly)
      </h3>
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
    <YAxis stroke="#a3a3a3" width={100} />
    <Tooltip
      formatter={(value, name) => [`${value} ကျပ်`, name]} // <-- here
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
