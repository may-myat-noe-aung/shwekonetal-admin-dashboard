// import React from "react";
// import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

// const SalesTrendChart = ({ chartData }) => (
//   <div className="col-span-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//     <h3 className="text-xl font-semibold mb-3">Sales Trend (Gold / Hr)</h3>
//     <ResponsiveContainer width="100%" height={250}>
//       <AreaChart data={chartData}>
//         <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
//         <XAxis dataKey="date" stroke="#52525b" />
//         <YAxis stroke="#52525b" />
//         <Tooltip contentStyle={{ backgroundColor: "#171717", border: "none" }} />
//         <Area type="monotone" dataKey="value" stroke="#eab308" fill="#eab30830" />
//       </AreaChart>
//     </ResponsiveContainer>
//   </div>
// );

// export default SalesTrendChart;

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

const API_URL = "http://38.60.244.74:3000/gold-times-today";

const SalesTrendChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let intervalId;

    const fetchChartData = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setChartData(json.data);
        }
      } catch (err) {
        console.error("Failed to load chart data:", err);
      }
    };

    // Initial fetch
    fetchChartData();

    // Fetch every 3 seconds (adjust as needed)
    intervalId = setInterval(fetchChartData, 500);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
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
};

export default SalesTrendChart;
