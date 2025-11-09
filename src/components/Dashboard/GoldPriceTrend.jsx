import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function GoldPriceTrend() {
  const [range, setRange] = useState("1D");
  const [data, setData] = useState({
    "1D": [],
    "1W": [],
    "1M": [],
    "1Y": [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/buying-prices-chart");
        const json = await res.json();

        // တဆင့်ဖြည့်မထားပါ၊ null values 그대로ထားပါ
        setData(json);
      } catch (error) {
        console.error("Failed to fetch gold price data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Gold Price Trend</h3>
        <div className="flex items-center gap-1 text-xs bg-neutral-800 rounded-full p-1">
          {["1D", "1W", "1M", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-1 rounded-full ${
                range === r ? "bg-neutral-700" : "hover:bg-neutral-700/60"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data[range]}>
            <defs>
              <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="time" stroke="#a3a3a3" interval="preserveStartEnd" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip
              contentStyle={{
                background: "#0a0a0a",
                border: "1px solid #262626",
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#f59e0b"
              fill="url(#gold)"
              connectNulls={false} // <--- null values များမှာ line မပေါ်စေပါ
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
