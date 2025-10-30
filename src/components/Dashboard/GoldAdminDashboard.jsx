// import React, { useMemo, useState, useEffect } from "react";
// import {
//   Coins,
//   Bell,
//   Settings,
//   Search,
//   Filter,
//   ArrowUpRight,
//   ArrowDownRight,
//   TrendingUp,
//   Wallet,
//   PieChart as PieChartIcon,
//   BarChart3,
//   Plus,
//   ShieldCheck,
//   AlertTriangle,
//   Download,
//   Clock3,
//   CheckCircle2,
//   X,
//   Users,
//   MessageCircleMore,
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// // Dummy data for different ranges
// const PRICE_DATA = {
//   "1D": [
//     { time: "09:00", price: 72.1 },
//     { time: "10:00", price: 72.8 },
//     { time: "11:00", price: 71.9 },
//     { time: "12:00", price: 72.6 },
//     { time: "1:00", price: 73.2 },
//     { time: "2:00", price: 73.6 },
//     { time: "3:00", price: 73.1 },
//     { time: "4:00", price: 73.1 },
//     { time: "5:00", price: 73.1 },
//   ],
//   "1W": [
//     { time: "Mon", price: 71 },
//     { time: "Tue", price: 72 },
//     { time: "Wed", price: 72.5 },
//     { time: "Thu", price: 73 },
//     { time: "Fri", price: 72.8 },
//     { time: "Sat", price: 73.1 },
//     { time: "Sun", price: 72.9 },
//   ],
//   "1M": [
//     { time: "Week 1", price: 70 },
//     { time: "Week 2", price: 71 },
//     { time: "Week 3", price: 73 },
//     { time: "Week 4", price: 72.5 },
//     { time: "Week 5", price: 74 },
//   ],
//   "1Y": [
//     { time: "Jan", price: 68 },
//     { time: "Feb", price: 69 },
//     { time: "Mar", price: 70 },
//     { time: "Apr", price: 71 },
//     { time: "May", price: 72 },
//     { time: "Jun", price: 73 },
//     { time: "Jul", price: 74 },
//     { time: "Aug", price: 73 },
//     { time: "Sep", price: 72 },
//     { time: "Oct", price: 73 },
//     { time: "Nov", price: 74 },
//     { time: "Dec", price: 75 },
//   ],
// };

// const BUY_SELL = [
//   { label: "Buy", value: 420 },
//   { label: "Sell", value: 310 },
// ];

// const REVENUE = [
//   { month: "Jan", value: 18 },
//   { month: "Feb", value: 22 },
//   { month: "Mar", value: 19 },
//   { month: "Apr", value: 28 },
//   { month: "May", value: 26 },
//   { month: "Jun", value: 31 },
// ];

// const TXN_DATA = [
//   {
//     id: "TX1001",
//     name: "Mg Mg",
//     type: "Buy",
//     karat: "24K",
//     qty: 10,
//     unit: "g",
//     price: 72.0,
//     total: 720,
//     date: "22,8,2023",
//     time: "13:20",
//   },
//   {
//     id: "TX1002",
//     name: "Aye Aye",
//     type: "Sell",
//     karat: "24K",
//     qty: 1,
//     unit: "Tola",
//     price: 850,
//     total: 850,
//     date: "21,7,2025",
//     time: "12:45",
//   },
//   {
//     id: "TX1003",
//     name: "Ko Ko",
//     type: "Buy",
//     karat: "24K",
//     qty: 5,
//     unit: "g",
//     price: 50,
//     total: 250,
//     date: "20,6,2023",
//     time: "12:20",
//   },
//   {
//     id: "TX1004",
//     name: "Hnin Si",
//     type: "Buy",
//     karat: "24K",
//     qty: 2,
//     unit: "g",
//     price: 72.5,
//     total: 145,
//     date: "19,5,2023",
//     time: "12:05",
//   },
//   {
//     id: "TX1005",
//     name: "Aye Chan",
//     type: "Buy",
//     karat: "24K",
//     qty: 3,
//     unit: "g",
//     price: 73.1,
//     total: 219.3,
//     date: "18,4,2023",
//     time: "11:40",
//   },
//   {
//     id: "TX1006",
//     name: "Zaw Zaw",
//     type: "Sell",
//     karat: "24K",
//     qty: 0.5,
//     unit: "Tola",
//     price: 420,
//     total: 210,
//     date: "20,3,2023",
//     time: "11:10",
//   },
// ];

// const TOP_WALLETS = [
//   { user: "Mg Mg", gold: "120 g", cash: "$1,820" },
//   { user: "Aye Aye", gold: "1.5 Tola", cash: "$950" },
//   { user: "Ko Ko", gold: "80 g", cash: "$540" },
// ];

// const FEED = [
//   {
//     id: 1,
//     icon: <AlertTriangle className="h-4 w-4" />,
//     text: "Gold price jumped +0.8% in last hour",
//     time: "2m",
//   },
//   {
//     id: 2,
//     icon: <Bell className="h-4 w-4" />,
//     text: "New buy order from Hnin Si (2g, 24K)",
//     time: "15m",
//   },
//   {
//     id: 3,
//     icon: <ShieldCheck className="h-4 w-4" />,
//     text: "KYC verified: Aye Chan",
//     time: "1h",
//   },
// ];

// // --- Helpers ---
// function clsx(...xs) {
//   return xs.filter(Boolean).join(" ");
// }

// function exportCsv(rows) {
//   const header = Object.keys(rows[0] || {}).join(",");
//   const body = rows.map((r) => Object.values(r).join(",")).join("\n");
//   const csv = `${header}\n${body}`;
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `transactions_${Date.now()}.csv`;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
// }

// export default function GoldAdminRightPane() {
//   // UI state
//   const [query, setQuery] = useState("");
//   const [range, setRange] = useState("1D");
//   const [sortBy, setSortBy] = useState({ key: "time", dir: "desc" });
//   const [rows, setRows] = useState(TXN_DATA);
//   const [showSettings, setShowSettings] = useState(false);



//   // Update filtered memo
//   const filtered = useMemo(() => {
//     let out = rows.filter((r) =>
//       [
//         r.id,
//         r.name,
//         r.type,
//         r.karat,
//         r.price, // added
//         r.total, // added
//         r.date, // added
//       ]
//         .join(" ")
//         .toString()
//         .toLowerCase()
//         .includes(query.toLowerCase())
//     );

//     const dir = sortBy.dir === "asc" ? 1 : -1;
//     out.sort((a, b) => {
//       const ka = a[sortBy.key];
//       const kb = b[sortBy.key];
//       if (ka < kb) return -1 * dir;
//       if (ka > kb) return 1 * dir;
//       return 0;
//     });
//     return out;
//   }, [rows, query, sortBy]);

//   function toggleSort(key) {
//     setSortBy((prev) =>
//       prev.key === key
//         ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
//         : { key, dir: "asc" }
//     );
//   }

//   // Fake live ticker glow
//   useEffect(() => {
//     const el = document.getElementById("ticker-dot");
//     if (!el) return;
//     let on = true;
//     const it = setInterval(() => {
//       on = !on;
//       el.style.opacity = on ? "1" : "0.2";
//     }, 900);
//     return () => clearInterval(it);
//   }, []);

//   return (
//     <div className=" bg-neutral-950 text-neutral-100">
//       {/* Top Bar (kept slim to fit with your existing sidebar) */}

//       {/* Content */}
//       <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
//         {/* Summary Cards */}
//         <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <SummaryCard
//             title="Buy Price"
//             value="600000 Ks"
//             sub="+1.2%"
//             icon={<ArrowUpRight className="h-5 w-5" />}
//             accent="from-yellow-500/20 to-transparent"
//           />
//           <SummaryCard
//             title="Sell Price"
//             value="630000 Ks"
//             sub="+0.6%"
//             icon={<ArrowUpRight className="h-5 w-5" />}
//             accent="from-emerald-500/20 to-transparent"
//           />
//           <SummaryCard
//             title="Transactions (Today)"
//             value={String(filtered.length)}
//             sub="Buy & Sell"
//             icon={<BarChart3 className="h-5 w-5" />}
//             accent="from-sky-500/20 to-transparent"
//           />
//           <SummaryCard
//             title="Revenue (Today)"
//             value="6000000 Ks"
//             sub="Spread & fees"
//             icon={<TrendingUp className="h-5 w-5" />}
//             accent="from-yellow-400/20 to-transparent"
//           />
//           <SummaryCard
//             title="Total Clients"
//             value="1000"
//             sub="+50"
//             icon={<Users className="h-5 w-5" />}
//             accent="from-rose-500/20 to-transparent"
//           />
//         </section>

//         {/* Charts + Orders */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Price trend */}
//           <div className="col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="font-semibold">Gold Price Trend</h3>
//               <div className="flex items-center gap-1 text-xs bg-neutral-800 rounded-full p-1">
//                 {["1D", "1W", "1M", "1Y"].map((r) => (
//                   <button
//                     key={r}
//                     onClick={() => setRange(r)}
//                     className={clsx(
//                       "px-2 py-1 rounded-full",
//                       range === r ? "bg-neutral-700" : "hover:bg-neutral-700/60"
//                     )}
//                   >
//                     {r}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="h-56">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={PRICE_DATA[range]}>
//                   <defs>
//                     <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
//                   <XAxis
//                     dataKey="time"
//                     stroke="#a3a3a3"
//                     interval="preserveStartEnd"
//                     tickMargin={10}
//                   />
//                   <YAxis stroke="#a3a3a3" />
//                   <Tooltip
//                     contentStyle={{
//                       background: "#0a0a0a",
//                       border: "1px solid #262626",
//                     }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="price"
//                     stroke="#f59e0b"
//                     fill="url(#gold)"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Buy vs Sell pie */}
//           <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="font-semibold">Buy vs Sell</h3>
//               <PieChartIcon className="h-4 w-4 text-neutral-400" />
//             </div>
//             <div className="h-56">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={BUY_SELL}
//                     dataKey="value"
//                     nameKey="label"
//                     innerRadius={50}
//                     outerRadius={80}
//                   >
//                     {BUY_SELL.map((_, i) => (
//                       <Cell key={i} fill={i === 0 ? "#22c55e" : "#ef4444"} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     contentStyle={{
//                       background: "#0a0a0a",
//                       border: "1px solid #262626",
//                     }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
//               <div className="flex items-center gap-2">
//                 <span className="h-2 w-2 rounded-full bg-emerald-500" /> Buy:{" "}
//                 {BUY_SELL[0].value}
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="h-2 w-2 rounded-full bg-rose-500" /> Sell:{" "}
//                 {BUY_SELL[1].value}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Revenue trend */}
//         <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="font-semibold">Revenue Trend</h3>
//             <TrendingUp className="h-4 w-4 text-neutral-400" />
//           </div>
//           <div className="h-56">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={REVENUE}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
//                 <XAxis dataKey="month" stroke="#a3a3a3" />
//                 <YAxis stroke="#a3a3a3" />
//                 <Tooltip
//                   contentStyle={{
//                     background: "#0a0a0a",
//                     border: "1px solid #262626",
//                   }}
//                 />
//                 <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </section>

//         {/* Orders & Side panels */}
//         <section className="mb-4 ">
//           {/* Transactions table */}
//           <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 h-[400px]">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="font-semibold">Recent Transactions</h3>

//               {/* Search bar */}
//               <div className="mb-3 flex items-center justify-between ">
//                 <input
//                   type="text"
//                   placeholder="Search transactions..."
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   className="flex-1 rounded-full bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 focus:outline-none"
//                 />
//                 <button
//                   onClick={() => exportCsv(filtered)}
//                   className="ml-2 px-2 py-1 rounded-full hover:bg-neutral-800 border border-neutral-700 text-sm flex items-center gap-1"
//                 >
//                   <Download className="h-3 w-3" /> Export
//                 </button>
//               </div>
//             </div>

//             {/* Transactions table */}
//             <div className="overflow-auto rounded-xl border border-neutral-800">
//               <table className="w-full text-sm">
//                 <thead className="bg-neutral-950/60">
//                   <tr className="text-neutral-300">
//                     {[
//                       { k: "id", label: "Txn ID", left: true },
//                       { k: "name", label: "Customer", left: true },
//                       { k: "type", label: "Type" },
//                       { k: "karat", label: "Gold" },
//                       { k: "price", label: "Price", right: true },
//                       { k: "total", label: "Total", right: true },
//                       { k: "date", label: "Date" },
//                       { k: "time", label: "Time" },
//                     ].map((c) => (
//                       <th
//                         key={c.k}
//                         onClick={() => toggleSort(c.k)}
//                         className={clsx(
//                           "px-3 py-2 select-none cursor-pointer",
//                           c.left && "text-left",
//                           c.right && "text-right"
//                         )}
//                       >
//                         <div
//                           className={clsx(
//                             "inline-flex items-center gap-1",
//                             c.right && "float-right"
//                           )}
//                         >
//                           {c.label}
//                           {sortBy.key === c.k &&
//                             (sortBy.dir === "asc" ? (
//                               <ArrowUpRight className="h-3 w-3" />
//                             ) : (
//                               <ArrowDownRight className="h-3 w-3" />
//                             ))}
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((t) => (
//                     <tr
//                       key={t.id}
//                       className="border-t border-neutral-800 hover:bg-neutral-950/40"
//                     >
//                       <td className="px-3 py-2 font-mono text-xs">{t.id}</td>
//                       <td className="px-3 py-2">{t.name}</td>
//                       <td className="px-3 py-2 text-center">
//                         <span
//                           className={clsx(
//                             "px-2 py-0.5 rounded-full text-xs text-center",
//                             t.type === "Buy"
//                               ? "bg-emerald-500/15 text-emerald-400"
//                               : "bg-rose-500/15 text-rose-400"
//                           )}
//                         >
//                           {t.type}
//                         </span>
//                       </td>
//                       <td className="px-3 py-2 text-center">{t.karat}</td>
//                       {/* In table body, change $ to Ks */}
//                       <td className="px-3 py-2 text-right">{t.price} Ks</td>
//                       <td className="px-3 py-2 text-right">{t.total} Ks</td>

//                       <td className="px-3 py-2 text-center">{t.date || "—"}</td>
//                       <td className="px-3 py-2 text-center">{t.time}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="grid grid-cols-4 lg:grid-cols-4 gap-4 mt-4">
//             {/* Right side: Notifications + Wallets */}

//             <div className="col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-semibold">Notifications</h3>
//                 <Bell className="h-4 w-4 text-neutral-400" />
//               </div>
//               <ul className="space-y-2 text-sm">
//                 {FEED.map((n) => (
//                   <li
//                     key={n.id}
//                     className="flex items-start gap-3 bg-neutral-950/50 rounded-xl p-2 border border-neutral-800"
//                   >
//                     <div className="mt-0.5 text-yellow-400">{n.icon}</div>
//                     <div className="flex-1">
//                       <p className="leading-relaxed">{n.text}</p>
//                       <span className="text-xs text-neutral-400">
//                         {n.time} ago
//                       </span>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-semibold">Top Wallets</h3>
//                 <Wallet className="h-4 w-4 text-neutral-400" />
//               </div>
//               <ul className="space-y-2 text-sm">
//                 {TOP_WALLETS.map((w, i) => (
//                   <li
//                     key={i}
//                     className="flex items-center justify-between bg-neutral-950/50 rounded-xl p-2 border border-neutral-800"
//                   >
//                     <div>
//                       <p className="font-medium">{w.user}</p>
//                       <p className="text-xs text-neutral-400">{w.gold}</p>
//                     </div>
//                     <span className="text-yellow-400 font-semibold">
//                       {w.cash}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//               <button className="mt-3 w-full rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 py-2 text-sm flex items-center justify-center gap-2">
//                 <Plus className="h-4 w-4" /> Add Credit
//               </button>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Settings Drawer (simple) */}
//       {showSettings && (
//         <div className="fixed inset-0 z-20">
//           <div
//             className="absolute inset-0 bg-black/60"
//             onClick={() => setShowSettings(false)}
//           />
//           <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-neutral-900 border-l border-neutral-800 p-4 overflow-auto">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-semibold">Settings</h3>
//               <button
//                 onClick={() => setShowSettings(false)}
//                 className="rounded-lg p-2 hover:bg-neutral-800"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div className="rounded-xl border border-neutral-800 p-4">
//                 <h4 className="font-medium mb-2">Price Alerts</h4>
//                 <p className="text-sm text-neutral-400 mb-3">
//                   Notify when spot price crosses a threshold.
//                 </p>
//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     placeholder="e.g. 75.00"
//                     className="flex-1 rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none"
//                   />
//                   <button className="rounded-xl px-3 py-2 border border-yellow-600/30 bg-yellow-600/10 text-yellow-300 hover:bg-yellow-600/20 text-sm">
//                     Save
//                   </button>
//                 </div>
//               </div>

//               <div className="rounded-xl border border-neutral-800 p-4">
//                 <h4 className="font-medium mb-2">Risk Controls</h4>
//                 <div className="flex items-center justify-between text-sm">
//                   <span>Max order value</span>
//                   <input
//                     type="number"
//                     className="w-28 rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm"
//                     placeholder="$5,000"
//                   />
//                 </div>
//                 <div className="mt-3 flex items-center justify-between text-sm">
//                   <span>Require KYC above</span>
//                   <input
//                     type="number"
//                     className="w-28 rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm"
//                     placeholder="$1,000"
//                   />
//                 </div>
//               </div>

//               <div className="rounded-xl border border-neutral-800 p-4">
//                 <h4 className="font-medium mb-2">Export</h4>
//                 <button
//                   onClick={() => exportCsv(rows)}
//                   className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-3 py-2 hover:bg-neutral-800 text-sm"
//                 >
//                   <Download className="h-4 w-4" />
//                   Download CSV (all)
//                 </button>
//               </div>

//               <div className="rounded-xl border border-neutral-800 p-4">
//                 <h4 className="font-medium mb-2">About</h4>
//                 <p className="text-sm text-neutral-400">
//                   Gold Exchange Admin · Pro Panel. Built with React,
//                   TailwindCSS, lucide-react and Recharts.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function SummaryCard({ title, value, sub, icon, accent }) {
//   return (
//     <div
//       className={
//         "relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
//       }
//     >
//       <div
//         className={
//           "pointer-events-none absolute inset-0 bg-gradient-to-br " +
//           (accent || "from-yellow-500/10 to-transparent")
//         }
//       />
//       <div className="relative flex items-start justify-between">
//         <div>
//           <p className="text-xs text-neutral-400 mb-1">{title}</p>
//           <p className="text-xl font-semibold text-yellow-300">{value}</p>
//           {sub && <p className="mt-1 text-xs text-neutral-400">{sub}</p>}
//         </div>
//         <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-yellow-400">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useMemo, useState, useEffect } from "react";
import {
  Coins,
  Bell,
  Settings,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  PieChart as PieChartIcon,
  BarChart3,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Download,
  Clock3,
  CheckCircle2,
  X,
  Users,
  MessageCircleMore,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dummy data for charts
const PRICE_DATA = {
  "1D": [
    { time: "09:00", price: 72.1 },
    { time: "10:00", price: 72.8 },
    { time: "11:00", price: 71.9 },
    { time: "12:00", price: 72.6 },
    { time: "1:00", price: 73.2 },
    { time: "2:00", price: 73.6 },
    { time: "3:00", price: 73.1 },
    { time: "4:00", price: 73.1 },
    { time: "5:00", price: 73.1 },
  ],
  "1W": [
    { time: "Mon", price: 71 },
    { time: "Tue", price: 72 },
    { time: "Wed", price: 72.5 },
    { time: "Thu", price: 73 },
    { time: "Fri", price: 72.8 },
    { time: "Sat", price: 73.1 },
    { time: "Sun", price: 72.9 },
  ],
  "1M": [
    { time: "Week 1", price: 70 },
    { time: "Week 2", price: 71 },
    { time: "Week 3", price: 73 },
    { time: "Week 4", price: 72.5 },
    { time: "Week 5", price: 74 },
  ],
  "1Y": [
    { time: "Jan", price: 68 },
    { time: "Feb", price: 69 },
    { time: "Mar", price: 70 },
    { time: "Apr", price: 71 },
    { time: "May", price: 72 },
    { time: "Jun", price: 73 },
    { time: "Jul", price: 74 },
    { time: "Aug", price: 73 },
    { time: "Sep", price: 72 },
    { time: "Oct", price: 73 },
    { time: "Nov", price: 74 },
    { time: "Dec", price: 75 },
  ],
};

const BUY_SELL = [
  { label: "Buy", value: 420 },
  { label: "Sell", value: 310 },
];

const REVENUE = [
  { month: "Jan", value: 18 },
  { month: "Feb", value: 22 },
  { month: "Mar", value: 19 },
  { month: "Apr", value: 28 },
  { month: "May", value: 26 },
  { month: "Jun", value: 31 },
];

const TOP_WALLETS = [
  { user: "Mg Mg", gold: "120 g", cash: "$1,820" },
  { user: "Aye Aye", gold: "1.5 Tola", cash: "$950" },
  { user: "Ko Ko", gold: "80 g", cash: "$540" },
];

const FEED = [
  {
    id: 1,
    icon: <AlertTriangle className="h-4 w-4" />,
    text: "Gold price jumped +0.8% in last hour",
    time: "2m",
  },
  {
    id: 2,
    icon: <Bell className="h-4 w-4" />,
    text: "New buy order from Hnin Si (2g, 24K)",
    time: "15m",
  },
  {
    id: 3,
    icon: <ShieldCheck className="h-4 w-4" />,
    text: "KYC verified: Aye Chan",
    time: "1h",
  },
];

// --- Helpers ---
function clsx(...xs) {
  return xs.filter(Boolean).join(" ");
}

function exportCsv(rows) {
  const header = Object.keys(rows[0] || {}).join(",");
  const body = rows.map((r) => Object.values(r).join(",")).join("\n");
  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function GoldAdminRightPane() {
  // UI state
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("1D");
  const [sortBy, setSortBy] = useState({ key: "time", dir: "desc" });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // ✅ Fetch from your live API
  useEffect(() => {
    fetch("http://38.60.244.74:3000/approve")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((item) => ({
            id: item.id,
            name: item.userid || "—",
            type: item.type === "sell" ? "Sell" : "Buy",
            karat: item.gold || "—",
            qty: "-",
            unit: "-",
            price: item.price || 0,
            total: item.price || 0,
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "—",
            time: item.created_at
              ? new Date(item.created_at).toLocaleTimeString()
              : "—",
          }));
          setRows(formatted);
        }
      })
      .catch((err) => console.error("Error loading transactions:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter and sort
  const filtered = useMemo(() => {
    let out = rows.filter((r) =>
      [r.id, r.name, r.type, r.karat, r.price, r.total, r.date]
        .join(" ")
        .toString()
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    const dir = sortBy.dir === "asc" ? 1 : -1;
    out.sort((a, b) => {
      const ka = a[sortBy.key];
      const kb = b[sortBy.key];
      if (ka < kb) return -1 * dir;
      if (ka > kb) return 1 * dir;
      return 0;
    });
    return out;
  }, [rows, query, sortBy]);

  function toggleSort(key) {
    setSortBy((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  }

  useEffect(() => {
    const el = document.getElementById("ticker-dot");
    if (!el) return;
    let on = true;
    const it = setInterval(() => {
      on = !on;
      el.style.opacity = on ? "1" : "0.2";
    }, 900);
    return () => clearInterval(it);
  }, []);

  return (
    <div className=" bg-neutral-950 text-neutral-100">
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryCard
            title="Buy Price"
            value="600000 Ks"
            sub="+1.2%"
            icon={<ArrowUpRight className="h-5 w-5" />}
            accent="from-yellow-500/20 to-transparent"
          />
          <SummaryCard
            title="Sell Price"
            value="630000 Ks"
            sub="+0.6%"
            icon={<ArrowUpRight className="h-5 w-5" />}
            accent="from-emerald-500/20 to-transparent"
          />
          <SummaryCard
            title="Transactions (Today)"
            value={String(filtered.length)}
            sub="Buy & Sell"
            icon={<BarChart3 className="h-5 w-5" />}
            accent="from-sky-500/20 to-transparent"
          />
          <SummaryCard
            title="Revenue (Today)"
            value="6000000 Ks"
            sub="Spread & fees"
            icon={<TrendingUp className="h-5 w-5" />}
            accent="from-yellow-400/20 to-transparent"
          />
          <SummaryCard
            title="Total Clients"
            value="1000"
            sub="+50"
            icon={<Users className="h-5 w-5" />}
            accent="from-rose-500/20 to-transparent"
          />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Price trend */}
          <div className="col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Gold Price Trend</h3>
              <div className="flex items-center gap-1 text-xs bg-neutral-800 rounded-full p-1">
                {["1D", "1W", "1M", "1Y"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={clsx(
                      "px-2 py-1 rounded-full",
                      range === r ? "bg-neutral-700" : "hover:bg-neutral-700/60"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PRICE_DATA[range]}>
                  <defs>
                    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="time"
                    stroke="#a3a3a3"
                    interval="preserveStartEnd"
                    tickMargin={10}
                  />
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
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Buy vs Sell */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Buy vs Sell</h3>
              <PieChartIcon className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={BUY_SELL}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {BUY_SELL.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#22c55e" : "#ef4444"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0a0a0a",
                      border: "1px solid #262626",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Buy:{" "}
                {BUY_SELL[0].value}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Sell:{" "}
                {BUY_SELL[1].value}
              </div>
            </div>
          </div>
        </section>

        {/* Revenue trend */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Revenue Trend</h3>
            <TrendingUp className="h-4 w-4 text-neutral-400" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid #262626",
                  }}
                />
                <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Transactions table */}
        <section className="mb-4 ">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 h-[400px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Recent Transactions</h3>
              <div className="mb-3 flex items-center justify-between ">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 rounded-full bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 focus:outline-none"
                />
                <button
                  onClick={() => exportCsv(filtered)}
                  className="ml-2 px-2 py-1 rounded-full hover:bg-neutral-800 border border-neutral-700 text-sm flex items-center gap-1"
                >
                  <Download className="h-3 w-3" /> Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-auto rounded-xl border border-neutral-800 h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
                  Loading transactions...
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-neutral-950/60">
                    <tr className="text-neutral-300">
                      {[
                        { k: "id", label: "Txn ID", left: true },
                        { k: "name", label: "Customer", left: true },
                        { k: "type", label: "Type" },
                        { k: "karat", label: "Gold" },
                        { k: "price", label: "Price", right: true },
                        { k: "total", label: "Total", right: true },
                        { k: "date", label: "Date" },
                        { k: "time", label: "Time" },
                      ].map((c) => (
                        <th
                          key={c.k}
                          onClick={() => toggleSort(c.k)}
                          className={clsx(
                            "px-3 py-2 select-none cursor-pointer",
                            c.left && "text-left",
                            c.right && "text-right"
                          )}
                        >
                          <div
                            className={clsx(
                              "inline-flex items-center gap-1",
                              c.right && "float-right"
                            )}
                          >
                            {c.label}
                            {sortBy.key === c.k &&
                              (sortBy.dir === "asc" ? (
                                <ArrowUpRight className="h-3 w-3" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3" />
                              ))}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => (
                      <tr
                        key={t.id}
                        className="border-t border-neutral-800 hover:bg-neutral-950/40"
                      >
                        <td className="px-3 py-2 font-mono text-xs">{t.id}</td>
                        <td className="px-3 py-2">{t.name}</td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={clsx(
                              "px-2 py-1 text-xs rounded-full",
                              t.type === "Buy"
                                ? "bg-emerald-600/20 text-emerald-400"
                                : "bg-rose-600/20 text-rose-400"
                            )}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">{t.karat}</td>
                        <td className="px-3 py-2 text-right">
                          {t.price.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {t.total.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-center">{t.date}</td>
                        <td className="px-3 py-2 text-center">{t.time}</td>
                      </tr>
                    ))}

                    {/* empty filler rows to keep height steady */}
                    {filtered.length < 10 &&
                      Array.from({ length: 10 - filtered.length }).map(
                        (_, i) => (
                          <tr
                            key={`empty-${i}`}
                            className="border-t border-neutral-800"
                          >
                            <td colSpan="8" className="py-3"></td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ title, value, sub, icon, accent }) {
  return (
    <div
      className={`rounded-2xl border border-neutral-800 bg-neutral-900 p-4 relative overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2 text-sm text-neutral-400">
          <span>{title}</span>
          {icon}
        </div>
        <div className="text-xl font-semibold">{value}</div>
        <div className="text-xs text-neutral-500">{sub}</div>
      </div>
    </div>
  );
}
