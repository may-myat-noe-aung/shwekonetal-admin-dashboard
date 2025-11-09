// import React, { useState, useEffect } from "react";

// // Burmese <-> English helpers
// function burmeseToEnglish(numStr) {
//   const map = { "၀":"0","၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9",".":"." };
//   return numStr.split("").map(c => map[c] ?? c).join("");
// }
// function englishToBurmese(numStr) {
//   const map = {0:"၀",1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",".":"."};
//   return numStr?.toString().split("").map(c => map[c] ?? c).join("");
// }

// export default function AddGoldComponent() {
//   const [initialGold, setInitialGold] = useState({ kyat:0, petha:0, yway:0 });
//   const [addGold, setAddGold] = useState({ kyat:0, petha:0, yway:0 });
//   const [totalStr, setTotalStr] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Modal + password
//   const [showModal, setShowModal] = useState(false);
//   const [password, setPassword] = useState("");
//   const [countdown, setCountdown] = useState(10);
//   const [toast, setToast] = useState({ show:false, message:"", type:"success" });

//   useEffect(() => {
//     const fetchGold = async () => {
//       try {
//         const res = await fetch("http://38.60.244.74:3000/open-stock");
//         const data = await res.json();
//         if(data.success && data.data?.length>0){
//           const g = data.data[0];
//           setInitialGold({
//             kyat: Number(burmeseToEnglish(g.kyat || "0")),
//             petha: Number(burmeseToEnglish(g.pal || "0")),
//             yway: Number(burmeseToEnglish(g.yway || "0")),
//           });
//           setTotalStr(data.total || "");
//         }
//       } catch(err){ console.error(err); }
//       finally{ setLoading(false); }
//     }
//     fetchGold();
//   }, []);

//   // Countdown logic
//   useEffect(() => {
//     if(!showModal) return;
//     if(countdown <= 0) return;
//     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [countdown, showModal]);

//   const handleAddGoldClick = () => {
//     setPassword("");
//     setCountdown(10);
//     setShowModal(true);
//   }

//   const handlePasswordSubmit = async () => {
//     if(password !== "1234") {
//       setToast({ show:true, message:"Incorrect passcode!", type:"error" });
//       return;
//     }

//     try {
//       const payload = {
//         kyat: englishToBurmese(addGold.kyat),
//         pal: englishToBurmese(addGold.petha),
//         yway: englishToBurmese(addGold.yway)
//       };
//       const res = await fetch("http://38.60.244.74:3000/open-stock", {
//         method: "POST",
//         headers: {"Content-Type":"application/json"},
//         body: JSON.stringify(payload)
//       });
//       const data = await res.json();
//       if(data.success && data.data?.length>0){
//         const g = data.data[0];
//         setInitialGold({
//           kyat: Number(burmeseToEnglish(g.kyat || "0")),
//           petha: Number(burmeseToEnglish(g.pal || "0")),
//           yway: Number(burmeseToEnglish(g.yway || "0")),
//         });
//         setTotalStr(data.total || "");
//         setAddGold({ kyat:0, petha:0, yway:0 });
//         setToast({ show:true, message:"Gold added successfully!", type:"success" });
//         setShowModal(false);
//       } else {
//         setToast({ show:true, message:data.message || "Failed to add gold", type:"error" });
//       }
//     } catch(err){
//       console.error(err);
//       setToast({ show:true, message:"Server error", type:"error" });
//     }
//   }

//   return (
//     <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-6 shadow-md">
//       <h3 className="font-bold text-xl text-yellow-400">Add New Gold</h3>
//       <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">

//         {/* Initial Gold */}
//         <div className="flex flex-col lg:flex-row gap-4">
//           {["kyat","petha","yway"].map((k,i)=>(
//             <div key={k} className="flex flex-col">
//               <label className="text-xs text-neutral-400 mb-1">{["ကျပ်","ပဲ","ရွေး"][i]}</label>
//               <input type="text" value={englishToBurmese(initialGold[k])} disabled
//                 className="w-20 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-500" />
//             </div>
//           ))}
//         </div>

//         {/* Total */}
//         <div className="w-full lg:w-auto mt-2 lg:mt-0 px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-900 text-yellow-400 font-semibold text-center shadow-inner">
//           {loading ? "Loading..." : totalStr || "No data"}
//         </div>

//         {/* Add Gold Inputs */}
//         <div className="flex flex-col lg:flex-row gap-4">
//           {["kyat","petha","yway"].map((k,i)=>(
//             <div key={k} className="flex flex-col">
//               <label className="text-xs text-neutral-400 mb-1">အသွင်း ({["ကျပ်","ပဲ","ရွေး"][i]})</label>
//               <input type="text" placeholder="0" value={englishToBurmese(addGold[k])}
//                 onChange={(e)=>setAddGold({...addGold,[k]:parseFloat(burmeseToEnglish(e.target.value))||0})}
//                 className="w-20 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-500" />
//             </div>
//           ))}
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-row gap-3 mt-2 lg:mt-0">
//           <button onClick={handleAddGoldClick} className="px-5 py-2 bg-yellow-500 text-neutral-900 font-semibold rounded-lg hover:bg-yellow-400 transition">
//             Add Gold
//           </button>
//           <button onClick={()=>setAddGold({ kyat:0, petha:0, yway:0 })} className="px-5 py-2 border border-neutral-700 text-neutral-200 rounded-lg hover:bg-neutral-800 transition">
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* Passcode Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
//             <h3 className="text-lg font-semibold mb-4 text-center">
//               {countdown===10 ? "Enter Passcode to Add Gold" : `Updating in ${countdown}s...`}
//             </h3>
//             {countdown===10 ? (
//               <>
//                 <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
//                   placeholder="Enter password"
//                   className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4" />
//                 <div className="flex justify-between">
//                   <button onClick={()=>setShowModal(false)}
//                     className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm">Cancel</button>
//                   <button onClick={handlePasswordSubmit}
//                     className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm">Confirm</button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col items-center">
//                 <div className="w-full bg-neutral-800 rounded-full h-2 mb-3">
//                   <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(countdown/10)*100}%` }}></div>
//                 </div>
//                 <button onClick={()=>setShowModal(false)}
//                   className="bg-red-500 text-black px-3 py-2 rounded-md text-sm">Cancel Update</button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Toast */}
//       {toast.show && (
//         <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow z-50 ${toast.type==="success"?"bg-green-500":"bg-red-500"} text-white`}>
//           {toast.message}
//         </div>
//       )}
//     </div>
//   )
// }

import React, { useState, useEffect } from "react";

// Burmese <-> English helpers
function burmeseToEnglish(numStr) {
  const map = { "၀":"0","၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9",".":"." };
  return numStr.split("").map(c => map[c] ?? c).join("");
}
function englishToBurmese(numStr) {
  const map = {0:"၀",1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",".":"."};
  return numStr?.toString().split("").map(c => map[c] ?? c).join("");
}

export default function AddGoldComponent() {
  const [initialGold, setInitialGold] = useState({ kyat:0, petha:0, yway:0 });
  const [addGold, setAddGold] = useState({ kyat:0, petha:0, yway:0 });
  const [totalStr, setTotalStr] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal + password
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [toast, setToast] = useState({ show:false, message:"", type:"success" });

  useEffect(() => {
    const fetchGold = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/open-stock");
        const data = await res.json();
        if(data.success && data.data?.length>0){
          const g = data.data[0];
          setInitialGold({
            kyat: Number(burmeseToEnglish(g.kyat || "0")),
            petha: Number(burmeseToEnglish(g.pal || "0")),
            yway: Number(burmeseToEnglish(g.yway || "0")),
          });
          setTotalStr(data.total || "");
        }
      } catch(err){ console.error(err); }
      finally{ setLoading(false); }
    }
    fetchGold();
  }, []);

  // Countdown logic
  useEffect(() => {
    if(!showModal) return;
    if(countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, showModal]);

  const handleAddGoldClick = () => {
    setPassword("");
    setCountdown(10);
    setShowModal(true);
  }

  const handlePasswordSubmit = async () => {
    if(password !== "1234") {
      setToast({ show:true, message:"Incorrect passcode!", type:"error" });
      return;
    }

    try {
      const payload = {
        kyat: englishToBurmese(addGold.kyat),
        pal: englishToBurmese(addGold.petha),
        yway: englishToBurmese(addGold.yway)
      };
      const res = await fetch("http://38.60.244.74:3000/open-stock", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(data.success && data.data?.length>0){
        const g = data.data[0];
        setInitialGold({
          kyat: Number(burmeseToEnglish(g.kyat || "0")),
          petha: Number(burmeseToEnglish(g.pal || "0")),
          yway: Number(burmeseToEnglish(g.yway || "0")),
        });
        setTotalStr(data.total || "");
        setAddGold({ kyat:0, petha:0, yway:0 });
        setToast({ show:true, message:"Gold added successfully!", type:"success" });
        setShowModal(false);
      } else {
        setToast({ show:true, message:data.message || "Failed to add gold", type:"error" });
      }
    } catch(err){
      console.error(err);
      setToast({ show:true, message:"Server error", type:"error" });
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-6 shadow-md w-full max-w-5xl mx-auto">

      <h3 className="font-bold text-xl text-yellow-400 text-center lg:text-left">Add New Gold</h3>

      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">

        {/* Initial Gold */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {["kyat","petha","yway"].map((k,i)=>(
            <div key={k} className="flex flex-col flex-1">
              <label className="text-xs text-neutral-400 mb-1">{["ကျပ်","ပဲ","ရွေး"][i]}</label>
              <input type="text" value={englishToBurmese(initialGold[k])} disabled
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="w-full lg:w-auto mt-2 lg:mt-0 px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-900 text-yellow-400 font-semibold text-center shadow-inner">
          {loading ? "Loading..." : totalStr || "No data"}
        </div>

        {/* Add Gold Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {["kyat","petha","yway"].map((k,i)=>(
            <div key={k} className="flex flex-col flex-1">
              <label className="text-xs text-neutral-400 mb-1">အသွင်း ({["ကျပ်","ပဲ","ရွေး"][i]})</label>
              <input type="text" placeholder="0" value={englishToBurmese(addGold[k])}
                onChange={(e)=>setAddGold({...addGold,[k]:parseFloat(burmeseToEnglish(e.target.value))||0})}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-row flex-wrap gap-3 mt-2 lg:mt-0 w-full lg:w-auto">
          <button onClick={handleAddGoldClick} className="flex-1 lg:flex-none px-5 py-2 bg-yellow-500 text-neutral-900 font-semibold rounded-lg hover:bg-yellow-400 transition">
            Add Gold
          </button>
          <button onClick={()=>setAddGold({ kyat:0, petha:0, yway:0 })} className="flex-1 lg:flex-none px-5 py-2 border border-neutral-700 text-neutral-200 rounded-lg hover:bg-neutral-800 transition">
            Reset
          </button>
        </div>

      </div>

      {/* Passcode Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-sm relative">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {countdown===10 ? "Enter Passcode to Add Gold" : `Updating in ${countdown}s...`}
            </h3>
            {countdown===10 ? (
              <>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4" />
                <div className="flex justify-between gap-2 flex-wrap">
                  <button onClick={()=>setShowModal(false)}
                    className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm flex-1">Cancel</button>
                  <button onClick={handlePasswordSubmit}
                    className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm flex-1">Confirm</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(countdown/10)*100}%` }}></div>
                </div>
                <button onClick={()=>setShowModal(false)}
                  className="bg-red-500 text-black px-3 py-2 rounded-md text-sm w-full">Cancel Update</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow z-50 ${toast.type==="success"?"bg-green-500":"bg-red-500"} text-white`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
