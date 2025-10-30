// // GoldConversion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_BASE = "http://38.60.244.74:3000";

// export default function GoldConversion() {
//   const [kyat, setKyat] = useState(1);
//   const [yway, setYway] = useState(128);
//   const [goldList, setGoldList] = useState([]);
//   const [formulaList, setFormulaList] = useState([]);

//   // Fetch formula from API
//   useEffect(() => {
//     fetchFormula();
//   }, []);

//   const fetchFormula = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/formula`);
//       if (Array.isArray(res.data)) {
//         setFormulaList(res.data);

//         // Set table default with latest item
//         const latest = res.data[0];
//         if (latest?.yway) {
//           setYway(latest.yway);
//           setKyat(1); // default kyat
//         }

//         // Populate goldList table with fetched data
//         const tableData = res.data.map((item, idx) => ({
//           kyat: 1, // default kyat
//           yway: item.yway,
//           id: item.id,
//           date: item.date,
//           time: item.time,
//         }));
//         setGoldList(tableData);
//       }
//     } catch (err) {
//       console.error("Failed to fetch formula data", err);
//     }
//   };

//   const handleAddGold = async () => {
//     try {
//       // POST new yway
//       await axios.post(`${API_BASE}/formula`, {
//         kyat,
//         yway,
//       });

//       // Update local table
//       setGoldList((prev) => [
//         ...prev,
//         {
//           kyat,
//           yway,
//           id: `FM${Date.now()}`,
//           date: new Date().toLocaleDateString(),
//           time: new Date().toLocaleTimeString(),
//         },
//       ]);

//       setKyat(1); // reset kyat
//       setYway(formulaList[0]?.yway || 128); // reset yway to latest fetched
//     } catch (err) {
//       alert("❌ Failed to update formula: " + err.message);
//     }
//   };

//   return (
//     <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
//       <h3 className="font-semibold mb-2">Custom Gold Conversion</h3>

//       <div className="flex items-center justify-between gap-2 flex-wrap mt-2">
//         <div>
//           <span>1 ကျပ် = </span>
//           <input
//             type="number"
//             value={yway}
//             onChange={(e) => setYway(Number(e.target.value))}
//             className="w-20 rounded-lg bg-neutral-800 border px-2 py-1 text-sm"
//             placeholder="ရွေး"
//           />
//           <span> ရွေး </span>
//           <button
//             onClick={handleAddGold}
//             className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm ml-4"
//           >
//             Update
//           </button>
//         </div>
//       </div>

//       {goldList.length > 0 && (
//         <div
//           className="overflow-y-auto mt-2 border border-neutral-800 rounded-lg"
//           style={{ maxHeight: "8rem" }}
//         >
//           <table className="w-full text-sm border-collapse">
//             <thead className="sticky top-0 bg-neutral-900 z-10">
//               <tr className="border-b border-neutral-700">
//                 <th className="px-2 py-1 text-left">#</th>
//                 <th className="px-2 py-1 text-left">ကျပ်</th>
//                 <th className="px-2 py-1 text-left">ရွေး</th>
//                 <th className="px-2 py-1 text-left">Date</th>
//                 <th className="px-2 py-1 text-left">Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {goldList.map((g, idx) => (
//                 <tr key={idx} className="border-b border-neutral-800">
//                   <td className="px-2 py-1">{idx + 1}</td>
//                   <td className="px-2 py-1">{g.kyat}</td>
//                   <td className="px-2 py-1">{g.yway}</td>
//                   <td className="px-2 py-1">{g.date || "-"}</td>
//                   <td className="px-2 py-1">{g.time || "-"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </section>
//   );
// }
// GoldConversion.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://38.60.244.74:3000";

export default function GoldConversion() {
  const [kyat, setKyat] = useState(1);
  const [yway, setYway] = useState(128);
  const [goldList, setGoldList] = useState([]);
  const [formulaList, setFormulaList] = useState([]);
  const [lastUpdate, setLastUpdate] = useState({ kyat: 1, yway: 128 });

  // Fetch formula from API
  useEffect(() => {
    fetchFormula();
  }, []);

  const fetchFormula = async () => {
    try {
      const res = await axios.get(`${API_BASE}/formula`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setFormulaList(res.data);

        const latest = res.data[0];
        if (latest?.yway) {
          setYway(latest.yway);
          setLastUpdate({ kyat: 1, yway: latest.yway });
        }

        // Populate table
        const tableData = res.data.map((item) => ({
          kyat: 1,
          yway: item.yway,
          id: item.id,
          date: item.date,
          time: item.time,
        }));
        setGoldList(tableData);
      }
    } catch (err) {
      console.error("Failed to fetch formula data", err);
    }
  };

  const handleAddGold = async () => {
    try {
      // POST new yway
      await axios.post(`${API_BASE}/formula`, {
        kyat,
        yway,
      });

      // Update table
      const newRow = {
        kyat,
        yway,
        id: `FM${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      setGoldList((prev) => [...prev, newRow]);

      // Update last update info
      setLastUpdate({ kyat, yway });

      // Reset input
      setKyat(1);
      setYway(lastUpdate.yway);
    } catch (err) {
      alert("❌ Failed to update formula: " + err.message);
    }
  };

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
      <h3 className="font-semibold mb-2">Custom Gold Conversion</h3>

      <div className="flex items-center justify-between gap-2 flex-wrap mt-2">
        <div className="flex items-center gap-2">
          <span>1 ကျပ် = </span>
          <input
            type="number"
            value={yway}
            onChange={(e) => setYway(Number(e.target.value))}
            className="w-20 rounded-lg bg-neutral-800 border px-2 py-1 text-sm"
            placeholder="ရွေး"
          />
          <span> ရွေး </span>
          <button
            onClick={handleAddGold}
            className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm ml-2"
          >
            Update
          </button>
        </div>

        {/* Last update info */}
        <div className="text-sm text-neutral-400">
          Last update: {lastUpdate.kyat} ကျပ် = {lastUpdate.yway} ရွေး
        </div>
      </div>

      {goldList.length > 0 && (
        <div
          className="overflow-y-auto mt-2 border border-neutral-800 rounded-lg"
          style={{ maxHeight: "8rem" }}
        >
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-neutral-900 z-10">
              <tr className="border-b border-neutral-700">
                <th className="px-2 py-1 text-left">#</th>
                <th className="px-2 py-1 text-left">ကျပ်</th>
                <th className="px-2 py-1 text-left">ရွေး</th>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {goldList.map((g, idx) => (
                <tr key={idx} className="border-b border-neutral-800">
                  <td className="px-2 py-1">{idx + 1}</td>
                  <td className="px-2 py-1">{g.kyat}</td>
                  <td className="px-2 py-1">{g.yway}</td>
                  <td className="px-2 py-1">{g.date || "-"}</td>
                  <td className="px-2 py-1">{g.time || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
