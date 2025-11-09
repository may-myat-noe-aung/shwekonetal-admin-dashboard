import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

const TransactionStatusChart = ({ sales }) => {
  const statusCounts = useMemo(() => {
    const counts = { approved: 0, pending: 0, rejected: 0 };
    sales.forEach((s) => {
      const status = s.status?.toLowerCase();
      if (counts[status] !== undefined) counts[status]++;
    });
    return counts;
  }, [sales]);

  const pieData = [
    { name: "Approved", value: statusCounts.approved },
    { name: "Pending", value: statusCounts.pending },
    { name: "Rejected", value: statusCounts.rejected },
  ];

  return (
    <div className="col-span-1 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="text-xl font-semibold mb-3">Transaction Status</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
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
