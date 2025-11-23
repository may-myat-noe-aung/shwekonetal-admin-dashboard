import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

export default function BuyVsSell() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/buy-vs-sell");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch Buy vs Sell data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 500);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Buy vs Sell</h3>
        <PieChartIcon className="h-4 w-4 text-neutral-400 overflow-hidden" />
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={50}
              outerRadius={80}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#22c55e" : "#ef4444"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#f59e0b",
                border: "1px solid #f59e0b",
              }}
              formatter={(value, name) => [
                `${value?.toLocaleString()} ရွေး`,
                "Price",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                i === 0 ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />{" "}
            {item.label}: {item.value} ရွေး
          </div>
        ))}
      </div>
    </div>
  );
}
