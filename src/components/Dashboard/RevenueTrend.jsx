import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

export default function RevenueTrend() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let intervalId;

    async function fetchData() {
      try {
        const res = await fetch("http://38.60.244.74:3000/revenue-gold-chart");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      }
    }

    // သုံးလိုက်တာ 500ms အကြိမ်ကြိမ် fetch
    fetchData(); // အရင်တစ်ခါ fetch လုပ်
    intervalId = setInterval(fetchData, 500);

    // Cleanup – component unmount ရင် interval ဖျက်
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Revenue Trend</h3>
        <TrendingUp className="h-4 w-4 text-neutral-400" />
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
      <Tooltip
  contentStyle={{
    background: "#0a0a0a",
    border: "1px solid #262626",
  }}
  formatter={(value, name) => [`${value?.toLocaleString()} ရွေး`, "Revenue"]}
/>

            <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
