import React from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const SalesTrendChart = ({ chartData }) => (
  <div className="col-span-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
    <h3 className="text-xl font-semibold mb-3">Sales Trend (Gold / Hr)</h3>
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="date" stroke="#52525b" />
        <YAxis stroke="#52525b" />
        <Tooltip contentStyle={{ backgroundColor: "#171717", border: "none" }} />
        <Area type="monotone" dataKey="value" stroke="#eab308" fill="#eab30830" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default SalesTrendChart;
