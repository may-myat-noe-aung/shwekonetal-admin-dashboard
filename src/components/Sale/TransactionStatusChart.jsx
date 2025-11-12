import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10B981", "#ef4444", "rgb(192 132 252)"];
const TransactionStatusChart = ({ sales }) => {
  const typeCounts = useMemo(() => {
    const counts = { buy: 0, sell: 0, delivery: 0 };
    sales.forEach((s) => {
      const type = s.type?.toLowerCase();
      if (counts[type] !== undefined) counts[type]++;
    });
    return counts;
  }, [sales]);

  const pieData = [
    { name: "Buy", value: typeCounts.buy },
    { name: "Sell", value: typeCounts.sell },
    { name: "Delivery", value: typeCounts.delivery },
  ];

  return (
    <div className="col-span-1 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="text-xl font-semibold mb-3">Transaction Type </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#eab308",
              border: "none",
              borderRadius: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionStatusChart;
