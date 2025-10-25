// import React, { useState, useMemo } from "react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// // ----------------------- Helpers -----------------------
// function toKyat({ kyat, petha, yway }) {
//   return kyat + petha / 16 + yway / 128;
// }

// function normalizeGold({ kyat, petha, yway }) {
//   if (yway >= 8) {
//     petha += Math.floor(yway / 8);
//     yway %= 8;
//   }
//   if (petha >= 16) {
//     kyat += Math.floor(petha / 16);
//     petha %= 16;
//   }
//   return { kyat, petha, yway };
// }

// // ----------------------- Dummy data -----------------------
// const DUMMY_BUYS = [
//   {
//     id: "B1001",
//     date: "2025-09-24",
//     customer: "Mg Mg",
//     weight: { kyat: 2, petha: 4, yway: 8 },
//     amount: 1260000,
//     payment: "Cash",
//   },
//   {
//     id: "B1002",
//     date: "2025-09-25",
//     customer: "Aye Aye",
//     weight: { kyat: 1, petha: 8, yway: 0 },
//     amount: 945000,
//     payment: "Bank",
//   },
// ];

// const DUMMY_SELLS = [
//   {
//     id: "S2001",
//     date: "2025-09-24",
//     customer: "Hnin Si",
//     weight: { kyat: 1, petha: 0, yway: 0 },
//     amount: 630000,
//     payment: "Bank",
//   },
//   {
//     id: "S2002",
//     date: "2025-09-26",
//     customer: "Su Su",
//     weight: { kyat: 0, petha: 4, yway: 0 },
//     amount: 189000,
//     payment: "Cash",
//   },
// ];

// // ----------------------- Main Component -----------------------
// export default function ReportManagement() {
//   // --- Initial Gold & Add Gold ---
//   const [initialGold, setInitialGold] = useState({
//     kyat: 5,
//     petha: 0,
//     yway: 0,
//   });
//   const [addGold, setAddGold] = useState({ kyat: 0, petha: 0, yway: 0 });
//   const marketPrice = 630000; // constant

//   const totalKyat = toKyat(initialGold);
//   const totalValueMMK = Math.round(totalKyat * marketPrice);

//   const handleAddGold = () => {
//     const passcode = prompt("Enter passcode to add gold:");
//     if (passcode !== "1234") {
//       alert("Wrong passcode!");
//       return;
//     }

//     const sum = {
//       kyat: initialGold.kyat + (addGold.kyat || 0),
//       petha: initialGold.petha + (addGold.petha || 0),
//       yway: initialGold.yway + (addGold.yway || 0),
//     };

//     setInitialGold(normalizeGold(sum));
//     setAddGold({ kyat: 0, petha: 0, yway: 0 });
//     alert("Gold added successfully!");
//   };

//   const handleResetAddGold = () => setAddGold({ kyat: 0, petha: 0, yway: 0 });

//   // --- Buy/Sell Data ---
//   const [buys, setBuys] = useState(DUMMY_BUYS);
//   const [sells, setSells] = useState(DUMMY_SELLS);

//   const totals = useMemo(() => {
//     const buyAmount = buys.reduce((s, b) => s + b.amount, 0);
//     const buyWeight = buys.reduce((s, b) => s + toKyat(b.weight), 0);
//     const sellAmount = sells.reduce((s, b) => s + b.amount, 0);
//     const sellWeight = sells.reduce((s, b) => s + toKyat(b.weight), 0);
//     return { buyAmount, buyWeight, sellAmount, sellWeight };
//   }, [buys, sells]);

//   const chartData = useMemo(() => {
//     const map = {};
//     const add = (d, key, amt) => {
//       if (!map[d]) map[d] = { date: d, buy: 0, sell: 0 };
//       map[d][key] += amt;
//     };
//     buys.forEach((b) => add(b.date, "buy", b.amount));
//     sells.forEach((s) => add(s.date, "sell", s.amount));
//     return Object.values(map).sort(
//       (a, b) => new Date(a.date) - new Date(b.date)
//     );
//   }, [buys, sells]);

//   const pieData = useMemo(() => {
//     const total = totals.buyAmount + totals.sellAmount || 1;
//     return [
//       {
//         name: "Buy",
//         value: totals.buyAmount,
//         color: "#22c55e",
//         percent: Math.round((totals.buyAmount / total) * 100),
//       },
//       {
//         name: "Sell",
//         value: totals.sellAmount,
//         color: "#ef4444",
//         percent: Math.round((totals.sellAmount / total) * 100),
//       },
//     ];
//   }, [totals]);

//   return (
//     <div className="bg-neutral-950 text-neutral-100 min-h-screen">
//       <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
//         {/* --- Gold Summary + Buy/Sell Totals in One Row --- */}
//         <section className="w-full">
//           {/* Gold Summary */}
//           <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
//             <h3 className="font-semibold text-lg">Add newGold </h3>
//             <div className="flex items-end justify-between">
//          {/* Initial Gold */}
// <div className="flex gap-2">
//   {["kyat", "petha", "yway"].map((k, i) => {
//     const labelMap = ["ကျပ်", "ပဲ", "ရွေး"]; // Burmese labels
//     return (
//       <div key={k} className="flex flex-col">
//         <label className="text-xs text-neutral-400 mb-2">
//           {labelMap[i]}
//         </label>
//         <input
//           type="number"
//           value={initialGold[k]}
//           disabled
//           className="w-20 px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-sm"
//         />
//       </div>
//     );
//   })}
// </div>



//               {/* Total */}
//               <div className="mt-2 p-3 border border-neutral-700 rounded-lg bg-neutral-900 text-yellow-400 font-semibold">
//                 Total: {totalKyat.toFixed(3)} Kyat ≈{" "}
//                 {totalValueMMK.toLocaleString()} Ks
//               </div>
//               {/* Add Gold Inputs */}
//               <div className="flex gap-2">
//                 {["kyat", "petha", "yway"].map((k, i) => {
//                   const labelMap = ["ကျပ်", "ပဲ", "ရွေး"]; // Burmese labels
//                   return (
//                     <div key={k} className="flex flex-col">
//                       <label className="text-xs text-neutral-400 mb-2">
//                         အသွင်း ({labelMap[i]})
//                       </label>
//                       <input
//                         type="number"
//                         placeholder="0"
//                         value={addGold[k]}
//                         onChange={(e) =>
//                           setAddGold({
//                             ...addGold,
//                             [k]: Number(e.target.value),
//                           })
//                         }
//                         className="w-20 px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-sm"
//                       />
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Buttons */}
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleAddGold}
//                   className="px-4 py-1 bg-yellow-500 text-white rounded-md font-semibold"
//                 >
//                   Add Gold
//                 </button>
//                 <button
//                   onClick={handleResetAddGold}
//                   className="px-4 py-1 border border-neutral-700 rounded-md"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* --- Tables --- */}
//         <section className="grid grid-cols-1 lg:grid-cols-1 gap-4">
//           {/* Buy Table */}
//           <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-auto">
//             <h3 className="font-semibold mb-2">Buy List</h3>
//             <table className="w-full text-sm">
//               <thead className="bg-neutral-950/60">
//                 <tr>
//                   {[
//                     "Txn ID",
//                     "Date",
//                     "Customer",
//                     "ကျပ် ပဲ ရွေး",
//                     "Amount",
//                     "Payment",
//                   ].map((h) => (
//                     <th key={h} className="px-3 py-2 text-left">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {buys.map((b) => (
//                   <tr
//                     key={b.id}
//                     className="border-t border-neutral-800 hover:bg-neutral-950/40"
//                   >
//                     <td className="px-3 py-2">{b.id}</td>
//                     <td className="px-3 py-2">{b.date}</td>
//                     <td className="px-3 py-2">{b.customer}</td>
//                     <td className="px-3 py-2">
//                       {b.weight.kyat}ကျပ် {b.weight.petha}ပဲ {b.weight.yway}ရွေး
//                     </td>
//                     <td className="px-3 py-2">
//                       {b.amount.toLocaleString()} Ks
//                     </td>
//                     <td className="px-3 py-2">{b.payment}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Sell Table */}
//           <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-auto">
//             <h3 className="font-semibold mb-2">Sell List</h3>
//             <table className="w-full text-sm">
//               <thead className="bg-neutral-950/60">
//                 <tr>
//                   {[
//                     "Txn ID",
//                     "Date",
//                     "Customer",
//                     "ကျပ် ပဲ ရွေး",
//                     "Amount",
//                     "Payment",
//                   ].map((h) => (
//                     <th key={h} className="px-3 py-2 text-left">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {sells.map((s) => (
//                   <tr
//                     key={s.id}
//                     className="border-t border-neutral-800 hover:bg-neutral-950/40"
//                   >
//                     <td className="px-3 py-2">{s.id}</td>
//                     <td className="px-3 py-2">{s.date}</td>
//                     <td className="px-3 py-2">{s.customer}</td>
//                     <td className="px-3 py-2">
//                       {s.weight.kyat}ကျပ် {s.weight.petha}ပဲ {s.weight.yway}ရွေး
//                     </td>
//                     <td className="px-3 py-2">
//                       {s.amount.toLocaleString()} Ks
//                     </td>
//                     <td className="px-3 py-2">{s.payment}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* --- Charts --- */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div className="col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//             <h3 className="font-semibold mb-2">Buy vs Sell Trend</h3>
//             <div className="h-56">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={chartData}>
//                   <defs>
//                     <linearGradient id="gBuy" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
//                       <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
//                     </linearGradient>
//                     <linearGradient id="gSell" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
//                       <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
//                   <XAxis dataKey="date" stroke="#a3a3a3" />
//                   <YAxis stroke="#a3a3a3" />
//                   <Tooltip
//                     contentStyle={{
//                       background: "#0a0a0a",
//                       border: "1px solid #262626",
//                     }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="buy"
//                     stroke="#22c55e"
//                     fill="url(#gBuy)"
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="sell"
//                     stroke="#ef4444"
//                     fill="url(#gSell)"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
//             <h3 className="font-semibold mb-2">Buy vs Sell Ratio</h3>
//             <div className="h-56">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     dataKey="value"
//                     nameKey="name"
//                     innerRadius={40}
//                     outerRadius={75}
//                     paddingAngle={3}
//                   >
//                     {pieData.map((d, i) => (
//                       <Cell key={i} fill={d.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
//               {pieData.map((p) => (
//                 <div key={p.name} className="flex items-center gap-2">
//                   <span
//                     className="w-3 h-3 rounded-full"
//                     style={{ backgroundColor: p.color }}
//                   />
//                   <div>
//                     {p.name}: <strong>{p.percent}%</strong>
//                     <div className="text-neutral-400 text-xs">
//                       {p.value.toLocaleString()} Ks
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ----------------------- Helpers -----------------------
function toKyat({ kyat, petha, yway }) {
  return kyat + petha / 16 + yway / 128;
}

function normalizeGold({ kyat, petha, yway }) {
  if (yway >= 8) {
    petha += Math.floor(yway / 8);
    yway %= 8;
  }
  if (petha >= 16) {
    kyat += Math.floor(petha / 16);
    petha %= 16;
  }
  return { kyat, petha, yway };
}

// ----------------------- Dummy data -----------------------
const DUMMY_BUYS = [
  {
    id: "B1001",
    date: "2025-09-24",
    customer: "Mg Mg",
    weight: { kyat: 2, petha: 4, yway: 8 },
    amount: 1260000,
    payment: "Cash",
  },
  {
    id: "B1002",
    date: "2025-09-25",
    customer: "Aye Aye",
    weight: { kyat: 1, petha: 8, yway: 0 },
    amount: 945000,
    payment: "Bank",
  },
];

const DUMMY_SELLS = [
  {
    id: "S2001",
    date: "2025-09-24",
    customer: "Hnin Si",
    weight: { kyat: 1, petha: 0, yway: 0 },
    amount: 630000,
    payment: "Bank",
  },
  {
    id: "S2002",
    date: "2025-09-26",
    customer: "Su Su",
    weight: { kyat: 0, petha: 4, yway: 0 },
    amount: 189000,
    payment: "Cash",
  },
];

// ----------------------- Main Component -----------------------
export default function ReportManagement() {
  // --- Initial Gold & Add Gold ---
  const [initialGold, setInitialGold] = useState({
    kyat: 5,
    petha: 0,
    yway: 0,
  });
  const [addGold, setAddGold] = useState({ kyat: 0, petha: 0, yway: 0 });
  const marketPrice = 630000; // constant

  const totalKyat = toKyat(initialGold);
  const totalValueMMK = Math.round(totalKyat * marketPrice);

  // --- Passcode Modal ---
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const handleAddGold = () => {
    setPasscodeInput("");
    setPasscodeError("");
    setPasscodeModalOpen(true);
  };

  const verifyPasscode = () => {
    if (passcodeInput === "1234") {
      const sum = {
        kyat: initialGold.kyat + (addGold.kyat || 0),
        petha: initialGold.petha + (addGold.petha || 0),
        yway: initialGold.yway + (addGold.yway || 0),
      };
      setInitialGold(normalizeGold(sum));
      setAddGold({ kyat: 0, petha: 0, yway: 0 });
      setPasscodeModalOpen(false);
    } else {
      setPasscodeError("Incorrect passcode!");
    }
  };

  const handleResetAddGold = () => setAddGold({ kyat: 0, petha: 0, yway: 0 });

  // --- Buy/Sell Data ---
  const [buys, setBuys] = useState(DUMMY_BUYS);
  const [sells, setSells] = useState(DUMMY_SELLS);

  const totals = useMemo(() => {
    const buyAmount = buys.reduce((s, b) => s + b.amount, 0);
    const buyWeight = buys.reduce((s, b) => s + toKyat(b.weight), 0);
    const sellAmount = sells.reduce((s, b) => s + b.amount, 0);
    const sellWeight = sells.reduce((s, b) => s + toKyat(b.weight), 0);
    return { buyAmount, buyWeight, sellAmount, sellWeight };
  }, [buys, sells]);

  const chartData = useMemo(() => {
    const map = {};
    const add = (d, key, amt) => {
      if (!map[d]) map[d] = { date: d, buy: 0, sell: 0 };
      map[d][key] += amt;
    };
    buys.forEach((b) => add(b.date, "buy", b.amount));
    sells.forEach((s) => add(s.date, "sell", s.amount));
    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [buys, sells]);

  const pieData = useMemo(() => {
    const total = totals.buyAmount + totals.sellAmount || 1;
    return [
      {
        name: "Buy",
        value: totals.buyAmount,
        color: "#22c55e",
        percent: Math.round((totals.buyAmount / total) * 100),
      },
      {
        name: "Sell",
        value: totals.sellAmount,
        color: "#ef4444",
        percent: Math.round((totals.sellAmount / total) * 100),
      },
    ];
  }, [totals]);

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* --- Gold Summary + Buy/Sell Totals in One Row --- */}
        <section className="w-full">
          {/* Gold Summary */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
            <h3 className="font-semibold text-lg">Add newGold </h3>
            <div className="flex items-end justify-between">
              {/* Initial Gold */}
              <div className="flex gap-2">
                {["kyat", "petha", "yway"].map((k, i) => {
                  const labelMap = ["ကျပ်", "ပဲ", "ရွေး"]; // Burmese labels
                  return (
                    <div key={k} className="flex flex-col">
                      <label className="text-xs text-neutral-400 mb-2">
                        {labelMap[i]}
                      </label>
                      <input
                        type="number"
                        value={initialGold[k]}
                        disabled
                        className="w-20 px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-sm"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-2 p-3 border border-neutral-700 rounded-lg bg-neutral-900 text-yellow-400 font-semibold">
                Total: {totalKyat.toFixed(3)} Kyat ≈{" "}
                {totalValueMMK.toLocaleString()} Ks
              </div>

              {/* Add Gold Inputs */}
              <div className="flex gap-2">
                {["kyat", "petha", "yway"].map((k, i) => {
                  const labelMap = ["ကျပ်", "ပဲ", "ရွေး"];
                  return (
                    <div key={k} className="flex flex-col">
                      <label className="text-xs text-neutral-400 mb-2">
                        အသွင်း ({labelMap[i]})
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={addGold[k]}
                        onChange={(e) =>
                          setAddGold({
                            ...addGold,
                            [k]: Number(e.target.value),
                          })
                        }
                        className="w-20 px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-sm"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddGold}
                  className="px-4 py-1 bg-yellow-500 text-white rounded-md font-semibold"
                >
                  Add Gold
                </button>
                <button
                  onClick={handleResetAddGold}
                  className="px-4 py-1 border border-neutral-700 rounded-md"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- Tables --- */}
        <section className="grid grid-cols-1 lg:grid-cols-1 gap-4">
          {/* Buy Table */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-auto">
            <h3 className="font-semibold mb-2">Buy List</h3>
            <table className="w-full text-sm">
              <thead className="bg-neutral-950/60">
                <tr>
                  {[
                    "Txn ID",
                    "Date",
                    "Customer",
                    "ကျပ် ပဲ ရွေး",
                    "Amount",
                    "Payment",
                  ].map((h) => (
                    <th key={h} className="px-3 py-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buys.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t border-neutral-800 hover:bg-neutral-950/40"
                  >
                    <td className="px-3 py-2">{b.id}</td>
                    <td className="px-3 py-2">{b.date}</td>
                    <td className="px-3 py-2">{b.customer}</td>
                    <td className="px-3 py-2">
                      {b.weight.kyat}ကျပ် {b.weight.petha}ပဲ{" "}
                      {b.weight.yway}ရွေး
                    </td>
                    <td className="px-3 py-2">
                      {b.amount.toLocaleString()} Ks
                    </td>
                    <td className="px-3 py-2">{b.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sell Table */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-auto">
            <h3 className="font-semibold mb-2">Sell List</h3>
            <table className="w-full text-sm">
              <thead className="bg-neutral-950/60">
                <tr>
                  {[
                    "Txn ID",
                    "Date",
                    "Customer",
                    "ကျပ် ပဲ ရွေး",
                    "Amount",
                    "Payment",
                  ].map((h) => (
                    <th key={h} className="px-3 py-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sells.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-neutral-800 hover:bg-neutral-950/40"
                  >
                    <td className="px-3 py-2">{s.id}</td>
                    <td className="px-3 py-2">{s.date}</td>
                    <td className="px-3 py-2">{s.customer}</td>
                    <td className="px-3 py-2">
                      {s.weight.kyat}ကျပ် {s.weight.petha}ပဲ{" "}
                      {s.weight.yway}ရွေး
                    </td>
                    <td className="px-3 py-2">
                      {s.amount.toLocaleString()} Ks
                    </td>
                    <td className="px-3 py-2">{s.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- Charts --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h3 className="font-semibold mb-2">Buy vs Sell Trend</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gSell" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#a3a3a3" />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip
                    contentStyle={{
                      background: "#0a0a0a",
                      border: "1px solid #262626",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="buy"
                    stroke="#22c55e"
                    fill="url(#gBuy)"
                  />
                  <Area
                    type="monotone"
                    dataKey="sell"
                    stroke="#ef4444"
                    fill="url(#gSell)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h3 className="font-semibold mb-2">Buy vs Sell Ratio</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {pieData.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <div>
                    {p.name}: <strong>{p.percent}%</strong>
                    <div className="text-neutral-400 text-xs">
                      {p.value.toLocaleString()} Ks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* -------------------- Passcode Modal -------------------- */}
      {passcodeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-80">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              Enter Passcode
            </h3>
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white mb-2"
              placeholder="Passcode"
              onKeyDown={(e) => e.key === "Enter" && verifyPasscode()}
            />
            {passcodeError && (
              <p className="text-red-500 text-sm mb-2">{passcodeError}</p>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setPasscodeModalOpen(false)}
                className="px-3 py-1 border border-neutral-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={verifyPasscode}
                className="px-3 py-1 bg-yellow-500 text-black rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
