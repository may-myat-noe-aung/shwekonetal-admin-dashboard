// SummaryCards.jsx
import React from "react";
import { Users, ArrowUpRight, Filter, UserPlus } from "lucide-react";

const SummaryCard = ({ title, value, icon, accent }) => (
  
  <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
    <div
      className={
        "pointer-events-none absolute inset-0 bg-gradient-to-br " +
        (accent || "from-yellow-500/10 to-transparent")
      }
    />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs text-neutral-400 mb-1">{title}</p>
        <p className="text-xl font-semibold text-yellow-300">{value}</p>
      </div>
      <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-yellow-400">
        {icon}
      </div>
    </div>
  </div>
);

export default function SummaryCards({ total, approved, rejected, newUsers }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SummaryCard
        title="Total Users"
        value={total}
        icon={<Users className="h-5 w-5" />}
        accent="from-sky-500/20 to-transparent"
      />
      <SummaryCard
        title="Approved"
        value={approved}
        icon={<ArrowUpRight className="h-5 w-5" />}
        accent="from-emerald-500/20 to-transparent"
      />
      <SummaryCard
        title="Rejected"
        value={rejected}
        icon={<Filter className="h-5 w-5" />}
        accent="from-rose-500/20 to-transparent"
      />
      <SummaryCard
        title="New Users"
        value={newUsers}
        icon={<UserPlus className="h-5 w-5" />}
        accent="from-indigo-500/20 to-transparent"
      />
    </section>
  );
}
