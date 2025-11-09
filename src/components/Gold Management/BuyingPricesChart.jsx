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

const API_BASE = "http://38.60.244.74:3000"; // your backend URL

export default function BuyingPricesChart() {
  const [chartData, setChartData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get(`${API_BASE}/buying-prices`);
  //       const data = res.data; // nested object by date

  //       // Get today and yesterday date strings
  //       const today = new Date();
  //       const todayStr = today.toISOString().split("T")[0];

  //       const yesterday = new Date();
  //       yesterday.setDate(today.getDate() - 1);
  //       const yesterdayStr = yesterday.toISOString().split("T")[0];

  //       // Helper to convert nested object to array
  //       const convertToArray = (dateStr) => {
  //         if (!data[dateStr]) return [];
  //         return Object.entries(data[dateStr])
  //           .filter(([_, price]) => price !== null)
  //           .map(([time, price]) => ({ time, price }));
  //       };

  //       const todayData = convertToArray(todayStr);
  //       const yesterdayData = convertToArray(yesterdayStr);

  //       // Merge by unique time
  //       const allTimes = Array.from(
  //         new Set([
  //           ...todayData.map((d) => d.time),
  //           ...yesterdayData.map((d) => d.time),
  //         ])
  //       ).sort((a, b) => {
  //         const [h1] = a.split(":");
  //         const [h2] = b.split(":");
  //         return parseInt(h1) - parseInt(h2);
  //       });

  //       const merged = allTimes.map((time) => ({
  //         time,
  //         buy: todayData.find((d) => d.time === time)?.price || null,
  //         sell: yesterdayData.find((d) => d.time === time)?.price || null,
  //       }));

  //       setChartData(merged);
  //     } catch (err) {
  //       console.error("Error fetching buying prices:", err);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/buying-prices`);
      const data = res.data;

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const convertToArray = (dateStr) => {
        if (!data[dateStr]) return [];
        return Object.entries(data[dateStr])
          .filter(([_, price]) => price !== null)
          .map(([time, price]) => ({ time, price }));
      };

      const todayData = convertToArray(todayStr);
      const yesterdayData = convertToArray(yesterdayStr);

      const allTimes = Array.from(
        new Set([
          ...todayData.map((d) => d.time),
          ...yesterdayData.map((d) => d.time),
        ])
      ).sort((a, b) => {
        const [h1] = a.split(":");
        const [h2] = b.split(":");
        return parseInt(h1) - parseInt(h2);
      });

      const merged = allTimes.map((time) => ({
        time,
        buy: todayData.find((d) => d.time === time)?.price || null,
        sell: yesterdayData.find((d) => d.time === time)?.price || null,
      }));

      setChartData(merged);
    } catch (err) {
      console.error("Error fetching buying prices:", err);
    }
  };

  fetchData(); // initial fetch

  const interval = setInterval(fetchData, 30000); // ✅ refresh every 30 sec
  return () => clearInterval(interval); // cleanup on unmount
}, []);

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="font-semibold mb-3 text-white">
        Buy Price — Today vs Yesterday (Hourly)
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
