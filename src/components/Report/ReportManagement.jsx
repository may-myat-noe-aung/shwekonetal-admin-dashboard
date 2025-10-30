// import React, { useState, useMemo, useEffect } from "react";
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
// import BuyTable from "./BuyTable";
// import SellTable from "./SellTable";
// import ReportBuySellChart from "./ReportBuySellChart";
// import ReportBuySellRatio from "./ReportBuySellRatio";

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

// // --- Burmese <-> English number helpers ---
// function burmeseToEnglish(numStr) {
//   const map = {
//     "၀": "0",
//     "၁": "1",
//     "၂": "2",
//     "၃": "3",
//     "၄": "4",
//     "၅": "5",
//     "၆": "6",
//     "၇": "7",
//     "၈": "8",
//     "၉": "9",
//     ".": ".",
//   };
//   return numStr
//     .split("")
//     .map((c) => map[c] ?? c)
//     .join("");
// }

// function englishToBurmese(numStr) {
//   const map = {
//     0: "၀",
//     1: "၁",
//     2: "၂",
//     3: "၃",
//     4: "၄",
//     5: "၅",
//     6: "၆",
//     7: "၇",
//     8: "၈",
//     9: "၉",
//     ".": ".",
//   };
//   return numStr
//     ?.toString()
//     .split("")
//     .map((c) => map[c] ?? c)
//     .join("");
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
//     kyat: 0,
//     petha: 0,
//     yway: 0,
//   });
//   const [addGold, setAddGold] = useState({ kyat: 0, petha: 0, yway: 0 });
//   const marketPrice = 630000; // constant
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch from API
//   useEffect(() => {
//     const fetchGold = async () => {
//       try {
//         const res = await fetch("http://38.60.244.74:3000/open-stock");
//         const data = await res.json();
//         // Inside your useEffect fetchGold
//         if (data.success && data.data?.length > 0) {
//           const g = data.data[0];
//           setInitialGold({
//             kyat: Number(burmeseToEnglish(g.kyat || "0")),
//             petha: Number(burmeseToEnglish(g.pal || "0")),
//             yway: Number(burmeseToEnglish(g.yway || "0")),
//           });

//           // <-- Add this line to show total from API
//           setTotalStr(data.total || "");
//         }
//       } catch (err) {
//         console.error("Error fetching open stock:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchGold();
//   }, []);

//   const totalKyat = toKyat(initialGold);
//   const totalValueMMK = Math.round(totalKyat * marketPrice);

//   // --- Passcode Modal ---
//   const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
//   const [passcodeInput, setPasscodeInput] = useState("");
//   const [passcodeError, setPasscodeError] = useState("");
//   const [totalStr, setTotalStr] = useState("");

//   const handleAddGold = () => {
//     setPasscodeInput("");
//     setPasscodeError("");
//     setPasscodeModalOpen(true);
//   };

//   const verifyPasscode = async () => {
//     if (passcodeInput === "1234") {
//       try {
//         // Prepare payload in Burmese numbers
//         const payload = {
//           kyat: englishToBurmese(addGold.kyat),
//           pal: englishToBurmese(addGold.petha),
//           yway: englishToBurmese(addGold.yway),
//         };

//         // POST request to API
//         const res = await fetch("http://38.60.244.74:3000/open-stock", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         });
//         const data = await res.json();

//         if (data.success) {
//           // Update initial gold with API response
//           setInitialGold({
//             kyat: Number(burmeseToEnglish(data.kyat || "0")),
//             petha: Number(burmeseToEnglish(data.pal || "0")),
//             yway: Number(burmeseToEnglish(data.yway || "0")),
//           });

//           // Save total string from API
//           setTotalStr(data.total || "");
//           setAddGold({ kyat: 0, petha: 0, yway: 0 });
//           setPasscodeModalOpen(false);

//           // Optionally update total value if API returns it
//           if (data.total) {
//             console.log("Updated total from API:", data.total);
//           }

//           // Reset addGold and close modal
//           setAddGold({ kyat: 0, petha: 0, yway: 0 });
//           setPasscodeModalOpen(false);
//         } else {
//           setPasscodeError(data.message || "Failed to add gold");
//         }
//       } catch (err) {
//         console.error("Error adding gold:", err);
//         setPasscodeError("Error contacting server");
//       }
//     } else {
//       setPasscodeError("Incorrect passcode!");
//     }
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
//               {/* Initial Gold */}
//               <div className="flex gap-2">
//                 {["kyat", "petha", "yway"].map((k, i) => {
//                   const labelMap = ["ကျပ်", "ပဲ", "ရွေး"]; // Burmese labels
//                   return (
//                     <div key={k} className="flex flex-col">
//                       <label className="text-xs text-neutral-400 mb-2">
//                         {labelMap[i]}
//                       </label>
//                       <input
//                         type="text"
//                         value={englishToBurmese(initialGold[k])}
//                         disabled
//                         className="w-20 px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-sm"
//                       />
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Total */}
//               <div className="mt-2 p-3 border border-neutral-700 rounded-lg bg-neutral-900 text-yellow-400 font-semibold">
//                 {loading ? "Loading..." : totalStr || "No data"}
//               </div>

//               {/* Add Gold Inputs */}
//               <div className="flex gap-2">
//                 {["kyat", "petha", "yway"].map((k, i) => {
//                   const labelMap = ["ကျပ်", "ပဲ", "ရွေး"];
//                   return (
//                     <div key={k} className="flex flex-col">
//                       <label className="text-xs text-neutral-400 mb-2">
//                         အသွင်း ({labelMap[i]})
//                       </label>
//                       <input
//                         type="text"
//                         placeholder=""
//                         value={englishToBurmese(addGold[k])}
//                         onChange={(e) => {
//                           const val = burmeseToEnglish(e.target.value);
//                           const num = parseFloat(val) || 0;
//                           setAddGold({ ...addGold, [k]: num });
//                         }}
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
//           <BuyTable />
//           <SellTable />
//         </section>

//         {/* --- Charts --- */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div className="col-span-2 h-full">
//             <ReportBuySellChart />
//           </div>

//           <div className="col-span-1">
//             <ReportBuySellRatio />
//           </div>
//         </section>
//       </main>

//       {/* -------------------- Passcode Modal -------------------- */}
//       {passcodeModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-80">
//             <h3 className="text-lg font-semibold mb-4 text-yellow-400">
//               Enter Passcode
//             </h3>
//             <input
//               type="password"
//               value={passcodeInput}
//               onChange={(e) => setPasscodeInput(e.target.value)}
//               className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-md mb-2 text-center"
//             />
//             {passcodeError && (
//               <p className="text-red-500 text-sm mb-2">{passcodeError}</p>
//             )}
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setPasscodeModalOpen(false)}
//                 className="px-3 py-1 border border-neutral-700 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={verifyPasscode}
//                 className="px-3 py-1 bg-yellow-500 text-white rounded-md"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import BuyTable from "./BuyTable";
import SellTable from "./SellTable";
import ReportBuySellChart from "./ReportBuySellChart";
import ReportBuySellRatio from "./ReportBuySellRatio";
import ServerToggle from "./ServerToggle";

// --- Burmese <-> English number helpers ---
function burmeseToEnglish(numStr) {
  const map = { "၀":"0","၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9",".":"." };
  return numStr.split("").map(c => map[c] ?? c).join("");
}

function englishToBurmese(numStr) {
  const map = {0:"၀",1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",".":"."};
  return numStr?.toString().split("").map(c => map[c] ?? c).join("");
}

// Convert gold to decimal kyat
function toKyat({ kyat, petha, yway }) {
  return kyat + petha / 16 + yway / 128;
}

// Dummy data for tables
const DUMMY_BUYS = [
  { id: "B1001", date: "2025-09-24", customer: "Mg Mg", weight: { kyat:2, petha:4, yway:8 }, amount: 1260000, payment: "Cash" },
  { id: "B1002", date: "2025-09-25", customer: "Aye Aye", weight: { kyat:1, petha:8, yway:0 }, amount: 945000, payment: "Bank" },
];
const DUMMY_SELLS = [
  { id: "S2001", date: "2025-09-24", customer: "Hnin Si", weight: { kyat:1, petha:0, yway:0 }, amount: 630000, payment: "Bank" },
  { id: "S2002", date: "2025-09-26", customer: "Su Su", weight: { kyat:0, petha:4, yway:0 }, amount: 189000, payment: "Cash" },
];

export default function ReportManagement() {
  const [initialGold, setInitialGold] = useState({ kyat:0, petha:0, yway:0 });
  const [addGold, setAddGold] = useState({ kyat:0, petha:0, yway:0 });
  const [loading, setLoading] = useState(true);
  const [totalStr, setTotalStr] = useState("");
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });


  const marketPrice = 630000;

  const [buys, setBuys] = useState(DUMMY_BUYS);
  const [sells, setSells] = useState(DUMMY_SELLS);

  // Fetch initial gold from API
  useEffect(() => {
    const fetchGold = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/open-stock");
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          const g = data.data[0];
          setInitialGold({
            kyat: Number(burmeseToEnglish(g.kyat || "0")),
            petha: Number(burmeseToEnglish(g.pal || "0")),
            yway: Number(burmeseToEnglish(g.yway || "0")),
          });
          setTotalStr(data.total || "");
        }
      } catch (err) {
        console.error("Error fetching open stock:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGold();
  }, []);

  const totalKyat = toKyat(initialGold);
  const totalValueMMK = Math.round(totalKyat * marketPrice);

  const handleAddGold = () => {
    setPasscodeInput("");
    setPasscodeError("");
    setPasscodeModalOpen(true);
  };

  const verifyPasscode = async () => {
    if (passcodeInput === "1234") {
      try {
        const payload = {
          kyat: englishToBurmese(addGold.kyat),
          pal: englishToBurmese(addGold.petha),
          yway: englishToBurmese(addGold.yway),
        };

        const res = await fetch("http://38.60.244.74:3000/open-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (data.success) {
          setInitialGold({
            kyat: Number(burmeseToEnglish(data.kyat || "0")),
            petha: Number(burmeseToEnglish(data.pal || "0")),
            yway: Number(burmeseToEnglish(data.yway || "0")),
          });
          setTotalStr(data.total || "");
          setAddGold({ kyat:0,petha:0,yway:0 });
          setPasscodeModalOpen(false);
        } else {
          setPasscodeError(data.message || "Failed to add gold");
        }
      } catch (err) {
        console.error("Error adding gold:", err);
        setPasscodeError("Error contacting server");
      }
    } else setPasscodeError("Incorrect passcode!");
  };

  const handleResetAddGold = () => setAddGold({ kyat:0,petha:0,yway:0 });

  // --- Totals for charts ---
  const totals = useMemo(() => {
    const buyAmount = buys.reduce((s,b)=>s+b.amount,0);
    const sellAmount = sells.reduce((s,b)=>s+b.amount,0);
    return { buyAmount, sellAmount };
  }, [buys,sells]);

  const chartData = useMemo(() => {
    const map = {};
    const add = (d,key,amt)=> { if(!map[d]) map[d]={date:d,buy:0,sell:0}; map[d][key]+=amt; };
    buys.forEach(b=>add(b.date,"buy",b.amount));
    sells.forEach(s=>add(s.date,"sell",s.amount));
    return Object.values(map).sort((a,b)=>new Date(a.date)-new Date(b.date));
  }, [buys,sells]);

  const pieData = useMemo(() => {
    const total = totals.buyAmount + totals.sellAmount || 1;
    return [
      { name:"Buy", value:totals.buyAmount, color:"#22c55e", percent:Math.round((totals.buyAmount/total)*100) },
      { name:"Sell", value:totals.sellAmount, color:"#ef4444", percent:Math.round((totals.sellAmount/total)*100) },
    ];
  }, [totals]);

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">

<div className="flex justify-end">
     <ServerToggle />
</div>



        {/* --- Gold Summary + Add Gold --- */}
   <section className="w-full">
  <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-6 shadow-md">
    <h3 className="font-bold text-xl text-yellow-400">Add New Gold</h3>

    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">

      {/* Initial Gold */}
      <div className="flex flex-col lg:flex-row gap-4">
        {["kyat","petha","yway"].map((k,i)=>(
          <div key={k} className="flex flex-col">
            <label className="text-xs text-neutral-400 mb-1">{["ကျပ်","ပဲ","ရွေး"][i]}</label>
            <input
              type="text"
              value={englishToBurmese(initialGold[k])}
              disabled
              className="w-20 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="w-full lg:w-auto mt-2 lg:mt-0 px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-900 text-yellow-400 font-semibold text-center shadow-inner">
        {loading ? "Loading..." : totalStr || "No data"}
      </div>

      {/* Add Gold Inputs */}
      <div className="flex flex-col lg:flex-row gap-4">
        {["kyat","petha","yway"].map((k,i)=>(
          <div key={k} className="flex flex-col">
            <label className="text-xs text-neutral-400 mb-1">အသွင်း ({["ကျပ်","ပဲ","ရွေး"][i]})</label>
            <input
              type="text"
              placeholder="0"
              value={englishToBurmese(addGold[k])}
              onChange={e=>{
                const val = burmeseToEnglish(e.target.value);
                setAddGold({...addGold,[k]:parseFloat(val)||0});
              }}
              className="w-20 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-row gap-3 mt-2 lg:mt-0">
        <button
          onClick={handleAddGold}
          className="px-5 py-2 bg-yellow-500 text-neutral-900 font-semibold rounded-lg hover:bg-yellow-400 transition"
        >
          Add Gold
        </button>
        <button
          onClick={handleResetAddGold}
          className="px-5 py-2 border border-neutral-700 text-neutral-200 rounded-lg hover:bg-neutral-800 transition"
        >
          Reset
        </button>
      </div>

    </div>
  </div>
</section>


        {/* --- Tables --- */}
        <section className="grid grid-cols-1 lg:grid-cols-1 gap-4">
          <BuyTable />
          <SellTable />
        </section>

        {/* --- Charts --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 h-full"><ReportBuySellChart /></div>
          <div className="col-span-1"><ReportBuySellRatio /></div>
        </section>
      </main>

      {/* --- Passcode Modal --- */}
      {passcodeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-80">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Enter Passcode</h3>
            <input type="password" value={passcodeInput} onChange={e=>setPasscodeInput(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-md mb-2 text-center"
            />
            {passcodeError && <p className="text-red-500 text-sm mb-2">{passcodeError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={()=>setPasscodeModalOpen(false)} className="px-3 py-1 border border-neutral-700 rounded-md">Cancel</button>
              <button onClick={verifyPasscode} className="px-3 py-1 bg-yellow-500 text-white rounded-md">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
