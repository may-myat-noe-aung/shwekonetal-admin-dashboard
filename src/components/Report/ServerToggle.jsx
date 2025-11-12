
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";

// // export default function ServerToggle() {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [alertMessage, setAlertMessage] = useState("");
// //   const [showAlert, setShowAlert] = useState(false);
// //   const [showConfirm, setShowConfirm] = useState(false);
// //   const [loading, setLoading] = useState(true);

// //   const API_BASE = "http://38.60.244.74:3000/open-server";

// //   // ✅ Fetch server status on load
// //   useEffect(() => {
// //     const fetchServerStatus = async () => {
// //       try {
// //         const res = await axios.get(API_BASE);
// //         if (res.data && res.data.data) {
// //           setIsOpen(res.data.data.server === 1);
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch server status:", error);
// //         setAlertMessage("Failed to load server status.");
// //         setShowAlert(true);
// //         setTimeout(() => setShowAlert(false), 2000);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchServerStatus();
// //   }, []);

// //   // ✅ Handle toggle (after confirm)
// //   const toggleServer = async () => {
// //     const newStatus = !isOpen;
// //     try {
// //       await axios.post(API_BASE, { server: newStatus ? 1 : 0 });
// //       setIsOpen(newStatus);
// //       setAlertMessage(`Server is now ${newStatus ? "Open" : "Closed"}!`);
// //       setShowAlert(true);
// //       setTimeout(() => setShowAlert(false), 2000);
// //     } catch (error) {
// //       setAlertMessage("Failed to update server status.");
// //       setShowAlert(true);
// //       setTimeout(() => setShowAlert(false), 2000);
// //       console.error(error);
// //     }
// //   };

// //   const handleClick = () => setShowConfirm(true);
// //   const handleConfirm = () => {
// //     setShowConfirm(false);
// //     toggleServer();
// //   };
// //   const handleCancel = () => setShowConfirm(false);

// //   return (
// //     <div className="flex flex-col items-start gap-3 relative">
// //       <div className="flex items-center gap-3">
// //         <span className="font-semibold text-sm text-neutral-300">
// //           Server Status:
// //         </span>

// //         {/* If still loading */}
// //         {loading ? (
// //           <span className="text-neutral-400 text-sm">Loading...</span>
// //         ) : (
// //           <>
// //             <button
// //               onClick={handleClick}
// //               className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${
// //                 isOpen ? "bg-green-500" : "bg-red-500"
// //               }`}
// //             >
// //               <span
// //                 className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
// //                   isOpen ? "translate-x-8" : "translate-x-1"
// //                 }`}
// //               />
// //             </button>

// //             <span
// //               className={`font-semibold text-sm ${
// //                 isOpen ? "text-green-400" : "text-red-400"
// //               }`}
// //             >
// //               {isOpen ? "Open" : "Closed"}
// //             </span>
// //           </>
// //         )}
// //       </div>

// //       {/* ✅ Alert box */}
// //       {showAlert && (
// //         <div
// //           className={`absolute top-12 left-0 px-4 py-2 rounded-md text-white font-semibold shadow-md ${
// //             isOpen ? "bg-green-500" : "bg-red-500"
// //           } transition-opacity duration-300`}
// //         >
// //           {alertMessage}
// //         </div>
// //       )}

// //       {/* ✅ Confirm modal */}
// //       {showConfirm && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
// //           <div className="bg-neutral-900 p-6 rounded-xl shadow-lg w-80 text-center">
// //             <p className="mb-4 text-sm font-semibold text-white">
// //               Are you sure you want to {isOpen ? "close" : "open"} the server?
// //             </p>
// //             <div className="flex justify-around">
// //               <button
// //                 onClick={handleConfirm}
// //                 className="px-4 py-2 bg-green-500 rounded-md text-white font-semibold hover:bg-green-600"
// //               >
// //                 Yes
// //               </button>
// //               <button
// //                 onClick={handleCancel}
// //                 className="px-4 py-2 bg-red-500 rounded-md text-white font-semibold hover:bg-red-600"
// //               >
// //                 No
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X } from "lucide-react";

// export default function ServerToggle() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const API_BASE = "http://38.60.244.74:3000/open-server";

//   // ✅ Fetch server status on load
//   useEffect(() => {
//     const fetchServerStatus = async () => {
//       try {
//         const res = await axios.get(API_BASE);
//         if (res.data && res.data.data) {
//           setIsOpen(res.data.data.server === 1);
//         }
//       } catch (error) {
//         console.error("Failed to fetch server status:", error);
//         setAlertMessage("Failed to load server status.");
//         setShowAlert(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServerStatus();
//   }, []);

//   // ✅ Handle toggle (after confirm)
//   const toggleServer = async () => {
//     const newStatus = !isOpen;
//     try {
//       await axios.post(API_BASE, { server: newStatus ? 1 : 0 });
//       setIsOpen(newStatus);
//       setAlertMessage(`Server is now ${newStatus ? "Open" : "Closed"}!`);
//       setShowAlert(true);
//     } catch (error) {
//       setAlertMessage("Failed to update server status.");
//       setShowAlert(true);
//       console.error(error);
//     }
//   };

//   const handleClick = () => setShowConfirm(true);
//   const handleConfirm = () => {
//     setShowConfirm(false);
//     toggleServer();
//   };
//   const handleCancel = () => setShowConfirm(false);

//   const closeAlert = () => setShowAlert(false);

//   return (
//     <div className="flex flex-col items-start gap-3 relative">
//       <div className="flex items-center gap-3">
//         <span className="font-semibold text-sm text-neutral-300">
//           Server Status:
//         </span>

//         {loading ? (
//           <span className="text-neutral-400 text-sm">Loading...</span>
//         ) : (
//           <>
//             <button
//               onClick={handleClick}
//               className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${
//                 isOpen ? "bg-green-500" : "bg-red-500"
//               }`}
//             >
//               <span
//                 className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
//                   isOpen ? "translate-x-8" : "translate-x-1"
//                 }`}
//               />
//             </button>
//             <span
//               className={`font-semibold text-sm ${
//                 isOpen ? "text-green-400" : "text-red-400"
//               }`}
//             >
//               {isOpen ? "Open" : "Closed"}
//             </span>
//           </>
//         )}
//       </div>

//       {/* ✅ Modern alert modal (same as passcode style) */}
//       {showAlert && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
//             <button
//               onClick={closeAlert}
//               className="absolute top-2 right-2 text-neutral-400 hover:text-white"
//             >
//               <X size={18} />
//             </button>

//             <h3 className="text-lg font-semibold mb-4 text-center">
//               {alertMessage.includes("Failed") ? "Error" : "Success"}
//             </h3>

//             <p
//               className={`text-center mb-6 ${
//                 alertMessage.includes("Failed")
//                   ? "text-red-400"
//                   : "text-green-400"
//               }`}
//             >
//               {alertMessage}
//             </p>

//             <div className="flex justify-center">
//               <button
//                 onClick={closeAlert}
//                 className={`px-4 py-2 rounded-md text-sm font-semibold ${
//                   alertMessage.includes("Failed")
//                     ? "bg-red-500 text-white hover:bg-red-600"
//                     : "bg-green-500 text-white hover:bg-green-600"
//                 }`}
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm modal */}
//       {showConfirm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-neutral-900 p-6 rounded-xl shadow-lg w-80 text-center">
//             <p className="mb-4 text-sm font-semibold text-white">
//               Are you sure you want to {isOpen ? "close" : "open"} the server?
//             </p>
//             <div className="flex justify-around">
//               <button
//                 onClick={handleConfirm}
//                 className="px-4 py-2 bg-green-500 rounded-md text-white font-semibold hover:bg-green-600"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={handleCancel}
//                 className="px-4 py-2 bg-red-500 rounded-md text-white font-semibold hover:bg-red-600"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function ServerToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://38.60.244.74:3000/open-server";

  // ✅ Fetch server status
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const res = await axios.get(API_BASE);
        if (res.data && res.data.data) {
          setIsOpen(res.data.data.server === 1);
        }
      } catch (error) {
        console.error("Failed to fetch server status:", error);
        setAlertMessage("Failed to load server status.");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };
    fetchServerStatus();
  }, []);

  // ✅ Update server after password + timer
  const toggleServer = async () => {
    const newStatus = !isOpen;
    try {
      await axios.post(API_BASE, { server: newStatus ? 1 : 0 });
      setIsOpen(newStatus);
      setAlertMessage(`Server is now ${newStatus ? "Open" : "Closed"}!`);
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to update server status.");
      setShowAlert(true);
    }
  };

  // ✅ Open modal
  const handleClick = () => {
    setPassword("");
    setCountdown(10);
    setShowModal(true);
  };

  // ✅ Cancel modal
  const cancelUpdate = () => {
    setShowModal(false);
    setPassword("");
    setCountdown(10);
  };

  // ✅ Handle password confirm
  const handlePasswordSubmit = () => {
    if (password.trim() === "") {
      setAlertMessage("Please enter passcode!");
      setShowAlert(true);
      return;
    }
    // Start countdown
    let timeLeft = 10;
    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft === 0) {
        clearInterval(timer);
        setShowModal(false);
        toggleServer();
      }
    }, 1000);
  };

  // ✅ Close alert
  const closeAlert = () => setShowAlert(false);

  return (
    <div className="flex flex-col items-start gap-3 relative">
<div className="text-center">
  <div className="font-semibold text-lg text-neutral-300 mb-2">
    Server Status
  </div>

  {loading ? (
    <span className="text-neutral-400 text-sm">Loading...</span>
  ) : (
    <>
      <div className="relative">
        <select
          value={isOpen ? "open" : "closed"}
          onChange={handleClick} // opens passcode modal
          className={`appearance-none w-32 py-2 pl-3 pr-8 rounded-lg text-sm font-semibold bg-neutral-800 border border-neutral-700 text-white cursor-pointer transition-colors duration-300 ${
            isOpen ? "border-green-500" : "border-red-500"
          } hover:border-yellow-500`}
        >
          <option value="open" className="text-green-400">
            Open
          </option>
          <option value="closed" className="text-red-400">
            Closed
          </option>
        </select>
        {/* Dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-4 w-4 text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </>
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
                ? `Enter Passcode to ${
                    isOpen ? "Close" : "Open"
                  } Server`
                : `Processing in ${countdown}s...`}
            </h3>

            {countdown === 10 ? (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
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

      {/* ✅ Modern Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={closeAlert}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              {alertMessage.includes("Failed") ? "Error" : "Notice"}
            </h3>

            <p
              className={`text-center mb-6 ${
                alertMessage.includes("Failed")
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {alertMessage}
            </p>

            <div className="flex justify-center">
              <button
                onClick={closeAlert}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${
                  alertMessage.includes("Failed")
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
