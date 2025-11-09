// import { ChevronDown, ChevronUp } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_BASE = "http://38.60.244.74:3000";

// export default function GoldConversion() {
//   const [kyat, setKyat] = useState(1);
//   const [yway, setYway] = useState(128);
//   const [goldList, setGoldList] = useState([]);
//   const [formulaList, setFormulaList] = useState([]);
//   const [lastUpdate, setLastUpdate] = useState({ kyat: 1, yway: 128 });
//   const [showTable, setShowTable] = useState(false); // <-- new state

//   // Fetch formula from API
//   const fetchFormula = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/formula`);
//       if (Array.isArray(res.data) && res.data.length > 0) {
//         setFormulaList(res.data);

//         const latest = res.data[0];
//         if (latest?.yway) {
//           setLastUpdate({ kyat: 1, yway: latest.yway });
//           setYway(latest.yway);
//         }

//         const tableData = res.data.map((item) => ({
//           kyat: 1,
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

//   useEffect(() => {
//     fetchFormula(); // initial fetch

//     const interval = setInterval(fetchFormula, 60000); // refresh every 60 sec
//     return () => clearInterval(interval); // cleanup on unmount
//   }, []);

//   const handleAddGold = async () => {
//     try {
//       await axios.post(`${API_BASE}/formula`, {
//         kyat,
//         yway,
//       });

//       const newRow = {
//         kyat,
//         yway,
//         id: `FM${Date.now()}`,
//         date: new Date().toLocaleDateString(),
//         time: new Date().toLocaleTimeString(),
//       };
//       setGoldList((prev) => [...prev, newRow]);
//       setLastUpdate({ kyat, yway });

//       // Reset input
//       setKyat(1);
//       setYway(lastUpdate.yway);
//     } catch (err) {
//       alert("❌ Failed to update formula: " + err.message);
//     }
//   };

//   return (
//     <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
//       <h3 className="font-semibold mb-2">Custom Gold Conversion</h3>

//       <div className="flex items-center justify-between gap-2 flex-wrap mt-2">
//         <div className="flex items-center gap-2">
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
//             className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm ml-2"
//           >
//             Update
//           </button>
//         </div>

//         {/* Last update with arrow */}
//         <div
//           className="text-sm text-neutral-400 flex items-center gap-1 cursor-pointer"
//           onClick={() => setShowTable((prev) => !prev)}
//         >
//           Last update: {lastUpdate.kyat} ကျပ် = {lastUpdate.yway} ရွေး
//           {showTable ? (
//             <ChevronUp className="w-4 h-4 text-neutral-400" />
//           ) : (
//             <ChevronDown className="w-4 h-4 text-neutral-400" />
//           )}
//         </div>
//       </div>

//       {goldList.length > 0 && showTable && (
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
import { ChevronDown, ChevronUp, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://38.60.244.74:3000";

export default function GoldConversion() {
  const [kyat, setKyat] = useState(1);
  const [yway, setYway] = useState(128);
  const [goldList, setGoldList] = useState([]);
  const [lastUpdate, setLastUpdate] = useState({ kyat: 1, yway: 128 });
  const [showTable, setShowTable] = useState(false);

  // Password modal states
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  // Countdown timer (optional, from your modal UI)
  const [countdown, setCountdown] = useState(10);

  const fetchFormula = async () => {
    try {
      const res = await axios.get(`${API_BASE}/formula`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        const latest = res.data[0];
        if (latest?.yway) {
          setLastUpdate({ kyat: 1, yway: latest.yway });
          setYway(latest.yway);
        }

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

  useEffect(() => {
    fetchFormula();
    const interval = setInterval(fetchFormula, 60000);
    return () => clearInterval(interval);
  }, []);

  // Open password modal
  const handleUpdateClick = () => {
    setShowModal(true);
    setCountdown(10);
  };

  // Cancel modal
  const cancelUpdate = () => {
    setShowModal(false);
    setPassword("");
  };

  // Handle password submit
  const handlePasswordSubmit = async () => {
    if (!password) {
      alert("Please enter password");
      return;
    }

    try {
      // --- Verify passcode dynamically ---
      const verifyResponse = await axios.post("http://38.60.244.74:3000/admin/verify-admin-passcode", {
        passcode: password,
      });

      if (!verifyResponse.data.success) {
        alert("Incorrect password!");
        return;
      }

      // --- Submit gold update ---
      await axios.post(`${API_BASE}/formula`, { kyat, yway });

      const newRow = {
        kyat,
        yway,
        id: `FM${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      setGoldList((prev) => [...prev, newRow]);
      setLastUpdate({ kyat, yway });

      // --- Reset input & close modal ---
      setKyat(1);
      setYway(yway);
      setPassword("");
      setShowModal(false);
    } catch (err) {
      alert("Verification failed!");
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
            onClick={handleUpdateClick}
            className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm ml-2"
          >
            Update
          </button>
        </div>

        <div
          className="text-sm text-neutral-400 flex items-center gap-1 cursor-pointer"
          onClick={() => setShowTable((prev) => !prev)}
        >
          Last update: {lastUpdate.kyat} ကျပ် = {lastUpdate.yway} ရွေး
          {showTable ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </div>
      </div>

      {goldList.length > 0 && showTable && (
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
                <tr key={g.id}>
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

      {/* Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={cancelUpdate}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              Enter Passcode to Update
            </h3>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={cancelUpdate}
                className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
