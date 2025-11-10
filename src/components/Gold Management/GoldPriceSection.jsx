import React from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function GoldPriceSection({
  title,        // "Buy Price" or "Sell Price"
  value,        // current price (buyPrice or sellPrice)
  inputValue,   // input box value
  setInputValue,
  onUpdateClick,
  chartData,    // chart data
  icon,         // arrow icon
  gradientColor, // "#f59e0b" or "#22c55e"
}) {
  return (
    <div>
      <div className="w-[300px]">
        <SummaryCard
          title={title}
          value={`${value} Ks`}
          sub="Updated"
          icon={icon}
          accent={`from-[${gradientColor}]/20 to-transparent`}
        />
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 mt-6">
        <h3 className="font-semibold mb-3">{title} & Chart</h3>

        <div className="flex items-center gap-4 mb-4">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm"
          />
          <button
            onClick={onUpdateClick}
            className={`px-3 py-2 rounded-md text-sm text-black bg-[${gradientColor}]`}
          >
            Update
          </button>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={title} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" stroke="#a3a3a3" />
              <YAxis stroke="#a3a3a3" width={80} />
              <Tooltip
                contentStyle={{
                  background: "#0a0a0a",
                  border: "1px solid #262626",
                }}
              />
              <Area
                type="monotone"
                dataKey={title.toLowerCase().includes("buy") ? "buy" : "sell"}
                stroke={gradientColor}
                fill={`url(#${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
