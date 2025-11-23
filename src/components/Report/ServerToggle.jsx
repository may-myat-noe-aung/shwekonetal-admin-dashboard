
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X } from "lucide-react";

// export default function ServerToggle() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [password, setPassword] = useState("");
//   const [countdown, setCountdown] = useState(10);
//   const [loading, setLoading] = useState(true);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [pendingStatus, setPendingStatus] = useState(isOpen);
//   const [timerId, setTimerId] = useState(null);
//   const [isCancelled, setIsCancelled] = useState(false);

//   const API_BASE = "http://38.60.244.74:3000/open-server";

//   // ✅ Fetch server status
//   useEffect(() => {
//     const fetchServerStatus = async () => {
//       try {
//         const res = await axios.get(API_BASE);
//         if (res.data && res.data.data) {
//           setIsOpen(res.data.data.server === 1);
//         }
//       } catch (error) {
//         console.error("Failed to fetch server status:", error);
//         alert(error.response?.data?.message || "Failed to load server status.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchServerStatus();
//   }, []);

//   // ✅ Update server after password + timer
//   const toggleServer = async (newStatus) => {
//     try {
//       const res = await axios.post(API_BASE, { server: newStatus ? 1 : 0 });
//       setIsOpen(newStatus);
//       alert(res.data?.message || `Server is now ${newStatus ? "Open" : "Closed"}!`);
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to update server status.");
//     }
//   };

//   // ✅ Open modal
//   const handleClick = (status) => {
//     setPassword("");
//     setCountdown(10);
//     setShowModal(true);
//     setIsDropdownOpen(false);
//     setPendingStatus(status);
//   };

//   // ✅ Cancel modal
//   const cancelUpdate = () => {
//     setIsCancelled(true);
//     setShowModal(false);
//     setPassword("");
//     setCountdown(10);

//     if (timerId) {
//       clearInterval(timerId);
//       setTimerId(null);
//     }
//   };

//   // ✅ Handle password confirm with API
//   const handlePasswordSubmit = async () => {
//     if (password.trim() === "") {
//       alert("Please enter passcode!");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "http://38.60.244.74:3000/admin/verify-admin-passcode",
//         { passcode: password }
//       );

//       // Use API response message
//       if (res.data && res.data.success) {
//         // ✅ start countdown only if passcode verified
//         setIsCancelled(false);
//         let timeLeft = 10;

//         const id = setInterval(() => {
//           timeLeft -= 1;
//           setCountdown(timeLeft);

//           if (timeLeft === 0) {
//             clearInterval(id);
//             setTimerId(null);
//             setShowModal(false);

//             if (!isCancelled) {
//               toggleServer(pendingStatus);
//             }
//           }
//         }, 1000);

//         setTimerId(id);
//       } else {
//         alert(res.data?.message || "Passcode is incorrect!");
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to verify passcode!");
//     }
//   };

//   return (
//     <div className="flex flex-col items-start gap-3 relative">
//       <div className="text-center">
//         <div className="font-semibold text-lg text-neutral-300 mb-2">
//           Server Status
//         </div>

//         {loading ? (
//           <span className="text-neutral-400 text-sm">Loading...</span>
//         ) : (
//           <div className="relative w-32">
//             {/* Dropdown button */}
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-semibold 
//               ${
//                 isOpen
//                   ? "bg-green-700 text-green-100"
//                   : "bg-red-700 text-red-100"
//               } 
//               border ${
//                 isOpen ? "border-green-500" : "border-red-500"
//               } hover:border-yellow-500 transition-colors duration-300`}
//             >
//               <span>{isOpen ? "Open" : "Closed"}</span>
//               <svg
//                 className="h-4 w-4 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>

//             {/* Dropdown options */}
//             {isDropdownOpen && (
//               <ul className="absolute mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
//                 <li
//                   onClick={() => handleClick(true)}
//                   className="px-3 py-2 cursor-pointer hover:bg-green-600 hover:text-white rounded-t-lg text-green-400"
//                 >
//                   Open
//                 </li>
//                 <li
//                   onClick={() => handleClick(false)}
//                   className="px-3 py-2 cursor-pointer hover:bg-red-600 hover:text-white rounded-b-lg text-red-400"
//                 >
//                   Closed
//                 </li>
//               </ul>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ✅ Passcode + Countdown Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
//             <button
//               onClick={cancelUpdate}
//               className="absolute top-2 right-2 text-neutral-400 hover:text-white"
//             >
//               <X size={18} />
//             </button>

//             <h3 className="text-lg font-semibold mb-4 text-center text-white">
//               {countdown === 10
//                 ? `Enter Passcode to ${pendingStatus ? "Open" : "Close"} Server`
//                 : `Processing in ${countdown}s...`}
//             </h3>

//             {countdown === 10 ? (
//               <>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter passcode"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handlePasswordSubmit();
//                   }}
//                   autoFocus
//                   className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4 text-white"
//                 />
//                 <div className="flex justify-between">
//                   <button
//                     onClick={cancelUpdate}
//                     className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handlePasswordSubmit}
//                     className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col items-center">
//                 <div className="w-full bg-neutral-800 rounded-full h-2 mb-3">
//                   <div
//                     className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
//                     style={{ width: `${(countdown / 10) * 100}%` }}
//                   ></div>
//                 </div>
//                 <button
//                   onClick={cancelUpdate}
//                   className="bg-red-500 text-black px-3 py-2 rounded-md text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { useAlert } from "../../AlertProvider"; 

export default function ServerToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(isOpen);
  const [timerId, setTimerId] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);

  const { showAlert } = useAlert(); 

  const API_BASE = "http://38.60.244.74:3000/open-server";

useEffect(() => {
  let intervalId;

  const fetchServerStatus = async () => {
    try {
      const res = await axios.get(API_BASE);
      if (res.data && res.data.data) {
        setIsOpen(res.data.data.server === 1);
      }
    } catch (error) {
      console.error("Failed to fetch server status:", error);
      showAlert(error.response?.data?.message || "Server status ဖတ်ရန်မအောင်မြင်ပါ", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch immediately once
  fetchServerStatus();

  // Then fetch every 500ms
  intervalId = setInterval(fetchServerStatus, 500);

  // Cleanup on unmount
  return () => clearInterval(intervalId);
}, []);


  const toggleServer = async (newStatus) => {
    try {
      const res = await axios.post(API_BASE, { server: newStatus ? 1 : 0 });
      setIsOpen(newStatus);
      showAlert(res.data?.message || `Server is now ${newStatus ? "Open" : "Closed"}!`, "success");
    } catch (error) {
      console.error(error);
      showAlert(error.response?.data?.message || "Server update မအောင်မြင်ပါ ", "error");
    }
  };

  const handleClick = (status) => {
    setPassword("");
    setCountdown(10);
    setShowModal(true);
    setIsDropdownOpen(false);
    setPendingStatus(status);
  };

  const cancelUpdate = () => {
    setIsCancelled(true);
    setShowModal(false);
    setPassword("");
    setCountdown(10);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  const handlePasswordSubmit = async () => {
    if (password.trim() === "") {
      showAlert("Passcode ထည့်ပေးပါ ", "warning");
      return;
    }

    try {
      const res = await axios.post(
        "http://38.60.244.74:3000/admin/verify-admin-passcode",
        { passcode: password }
      );

      if (res.data && res.data.success) {
        setIsCancelled(false);
        let timeLeft = 10;

        const id = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);

          if (timeLeft === 0) {
            clearInterval(id);
            setTimerId(null);
            setShowModal(false);

            if (!isCancelled) {
              toggleServer(pendingStatus);
            }
          }
        }, 1000);

        setTimerId(id);
      } else {
        showAlert(res.data?.message || "Passcode မှားနေပါသည် ", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert(error.response?.data?.message || "Passcode စစ်ဆေးမှု မအောင်မြင်ပါ ", "error");
    }
  };

  return (
 <div className="flex flex-col items-start gap-3 relative">
      <div className="text-center">
        <div className="font-semibold text-lg text-neutral-300 mb-2">
          Server Status
        </div>

        {loading ? (
          <span className="text-neutral-400 text-sm">Loading...</span>
        ) : (
          <div className="relative w-32">
            {/* Dropdown button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-semibold 
              ${
                isOpen
                  ? "bg-green-700 text-green-100"
                  : "bg-red-700 text-red-100"
              } 
              border ${
                isOpen ? "border-green-500" : "border-red-500"
              } hover:border-yellow-500 transition-colors duration-300`}
            >
              <span>{isOpen ? "Open" : "Closed"}</span>
              <svg
                className="h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown options */}
            {isDropdownOpen && (
              <ul className="absolute mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                <li
                  onClick={() => handleClick(true)}
                  className="px-3 py-2 cursor-pointer hover:bg-green-600 hover:text-white rounded-t-lg text-green-400"
                >
                  Open
                </li>
                <li
                  onClick={() => handleClick(false)}
                  className="px-3 py-2 cursor-pointer hover:bg-red-600 hover:text-white rounded-b-lg text-red-400"
                >
                  Closed
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* ✅ Passcode + Countdown Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={cancelUpdate}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center text-white">
              {countdown === 10
                ? `Enter Passcode to ${pendingStatus ? "Open" : "Close"} Server`
                : `Processing in ${countdown}s...`}
            </h3>

            {countdown === 10 ? (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePasswordSubmit();
                  }}
                  autoFocus
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4 text-white"
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
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full bg-neutral-800 rounded-full h-2 mb-3">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(countdown / 10) * 100}%` }}
                  ></div>
                </div>
                <button
                  onClick={cancelUpdate}
                  className="bg-red-500 text-black px-3 py-2 rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
