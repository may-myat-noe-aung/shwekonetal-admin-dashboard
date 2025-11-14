// import React from "react";
// import { Check, X } from "lucide-react";

// export default function ConfirmUserDetailModal({
//   viewUser,
//   handleAction,
//   previewPhoto,
//   setPreviewPhoto,
//   onClose,
// }) {
//   if (!viewUser) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
//       <div className="bg-neutral-900 rounded-2xl shadow-2xl p-6 w-[520px] relative animate-fadeIn">
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-white/70 hover:text-white text-lg font-bold"
//         >
//           ✖
//         </button>

//         {/* Header Section */}
//         <div className="flex flex-col items-center mb-5">
//           {viewUser.photo ? (
//             <img
//               src={
//                 viewUser.photo.startsWith("http")
//                   ? viewUser.photo
//                   : `http://38.60.244.74:3000/uploads/${viewUser.photo}`
//               }
//               alt="Profile"
//               className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 mb-3"
//             />
//           ) : (
//             <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl mb-3">
//               {viewUser.fullname
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")
//                 .toUpperCase()
//                 .slice(0, 3)}
//             </div>
//           )}
//           <h3 className="text-lg font-semibold text-white">{viewUser.fullname}</h3>
//           <p className="text-white/60 text-sm">{viewUser.email}</p>
//         </div>

//         {/* ID Photos */}
//         <div className="grid grid-cols-2 gap-3 mb-5">
//           {["id_front_photo", "id_back_photo"].map((key, idx) => (
//             <div
//               key={idx}
//               className="bg-neutral-800/70 p-2 rounded-lg cursor-pointer"
//               onClick={() => setPreviewPhoto(viewUser[key])}
//             >
//               <img
//                 src={
//                   viewUser[key]
//                     ? viewUser[key].startsWith("http")
//                       ? viewUser[key]
//                       : `http://38.60.244.74:3000/uploads/${viewUser[key]}`
//                     : `https://via.placeholder.com/200x120?text=${
//                         key === "id_front_photo" ? "Front+ID" : "Back+ID"
//                       }`
//                 }
//                 alt={key}
//                 className="w-full h-32 object-cover rounded-md"
//               />
//               <p className="text-center text-white/70 text-xs mt-1">
//                 {key === "id_front_photo" ? "မှတ်ပုံတင် အရှေ့ဘက်" : "မှတ်ပုံတင် အနောက်ဘက်"}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Info Grid */}
//         <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-white/80 text-sm mb-6">
//           <div>
//             <p className="text-white/500 mb-1 text-xs">ID Type</p>
//             <p>{viewUser.id_type}</p>
//           </div>
//           <div>
//             <p className="text-white/500 mb-1 text-xs">ID Number</p>
//             <p>{viewUser.id_number}</p>
//           </div>
//           <div>
//             <p className="text-white/500 mb-1 text-xs">Phone</p>
//             <p>{viewUser.phone}</p>
//           </div>
//           <div>
//             <p className="text-white/500 mb-1 text-xs">State / City</p>
//             <p>
//               {viewUser.state} / {viewUser.city}
//             </p>
//           </div>
//           <div>
//             <p className="text-white/500 mb-1 text-xs">Address</p>
//             <p>{viewUser.address}</p>
//           </div>
//           <div>
//             <p className="text-white/500 mb-1 text-xs">Status</p>
//             <span
//               className={`px-3 py-1 rounded-full text-xs ${
//                 viewUser.status?.toLowerCase() === "pending"
//                   ? "bg-yellow-500 text-white"
//                   : viewUser.status?.toLowerCase() === "approved"
//                   ? "bg-emerald-600"
//                   : "bg-rose-600"
//               }`}
//             >
//               {viewUser.status}
//             </span>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => handleAction("reject", viewUser)}
//             className="flex items-center gap-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-white text-sm font-medium"
//           >
//             Reject <X size={14} />
//           </button>
//           <button
//             onClick={() => handleAction("approve", viewUser)}
//             className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium"
//           >
//             Approve <Check size={14} />
//           </button>
//         </div>

//         {/* Photo Preview */}
//         {previewPhoto && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
//             onClick={() => setPreviewPhoto(null)}
//           >
//             <img
//               src={
//                 previewPhoto.startsWith("http")
//                   ? previewPhoto
//                   : `http://38.60.244.74:3000/uploads/${previewPhoto}`
//               }
//               alt="Preview"
//               className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg object-contain"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";

const API_BASE = "http://38.60.244.74:3000";

export default function ConfirmUserDetailModal({
  viewUser,
  handleAction,
  previewPhoto,
  setPreviewPhoto,
  onClose,
}) {
  const [showPasscode, setShowPasscode] = useState(false);
  const [password, setPassword] = useState("");
  const [pendingAction, setPendingAction] = useState(""); // "approve" or "reject"

  if (!viewUser) return null;

  const startAction = (type) => {
    setPendingAction(type);
    setShowPasscode(true);
  };

  const handlePasscodeSubmit = async () => {
    if (!password) {
      alert("Please enter passcode");
      return;
    }

    try {
      // Verify admin passcode
      const verifyResponse = await axios.post(
        `${API_BASE}/admin/verify-admin-passcode`,
        { passcode: password }
      );

      if (!verifyResponse.data.success) {
        alert("Incorrect password!");
        return;
      }

      // If verified, perform the actual action
      await handleAction(pendingAction, viewUser);

      // Reset modal state
      setPassword("");
      setShowPasscode(false);
      setPendingAction("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Verification failed!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl p-6 w-[520px] relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white text-lg font-bold"
        >
          ✖
        </button>

        {!showPasscode ? (
          <>
            {/* Header Section */}
            <div className="flex flex-col items-center mb-5">
              {viewUser.photo ? (
                <img
                  src={
                    viewUser.photo.startsWith("http")
                      ? viewUser.photo
                      : `${API_BASE}/uploads/${viewUser.photo}`
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 mb-3"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl mb-3">
                  {viewUser.fullname
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 3)}
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">
                {viewUser.fullname}
              </h3>
              <p className="text-white/60 text-sm">{viewUser.email}</p>
            </div>

            {/* ID Photos */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {["id_front_photo", "id_back_photo"].map((key, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-800/70 p-2 rounded-lg cursor-pointer"
                  onClick={() => setPreviewPhoto(viewUser[key])}
                >
                  <img
                    src={
                      viewUser[key]
                        ? viewUser[key].startsWith("http")
                          ? viewUser[key]
                          : `${API_BASE}/uploads/${viewUser[key]}`
                        : `https://via.placeholder.com/200x120?text=${
                            key === "id_front_photo" ? "Front+ID" : "Back+ID"
                          }`
                    }
                    alt={key}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <p className="text-center text-white/70 text-xs mt-1">
                    {key === "id_front_photo"
                      ? "မှတ်ပုံတင် အရှေ့ဘက်"
                      : "မှတ်ပုံတင် အနောက်ဘက်"}
                  </p>
                </div>
              ))}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-white/80 text-sm mb-6">
              <div>
                <p className="text-white/500 mb-1 text-xs">ID Type</p>
                <p>{viewUser.id_type}</p>
              </div>
              <div>
                <p className="text-white/500 mb-1 text-xs">ID Number</p>
                <p>{viewUser.id_number}</p>
              </div>
              <div>
                <p className="text-white/500 mb-1 text-xs">Phone</p>
                <p>{viewUser.phone}</p>
              </div>
              <div>
                <p className="text-white/500 mb-1 text-xs">State / City</p>
                <p>
                  {viewUser.state} / {viewUser.city}
                </p>
              </div>
              <div>
                <p className="text-white/500 mb-1 text-xs">Address</p>
                <p>{viewUser.address}</p>
              </div>
              <div>
                <p className="text-white/500 mb-1 text-xs">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    viewUser.status?.toLowerCase() === "pending"
                      ? "bg-yellow-500 text-white"
                      : viewUser.status?.toLowerCase() === "approved"
                      ? "bg-emerald-600"
                      : "bg-rose-600"
                  }`}
                >
                  {viewUser.status}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => startAction("reject")}
                className="flex items-center gap-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-white text-sm font-medium"
              >
                Reject <X size={14} />
              </button>
              <button
                onClick={() => startAction("approve")}
                className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium"
              >
                Approve <Check size={14} />
              </button>
            </div>
          </>
        ) : (
          // Passcode Step
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center text-white mb-2">
              Enter Admin Passcode
            </h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePasscodeSubmit();
              }}
              autoFocus
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setShowPasscode(false)}
                className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePasscodeSubmit}
                className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Photo Preview */}
        {previewPhoto && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
            onClick={() => setPreviewPhoto(null)}
          >
            <img
              src={
                previewPhoto.startsWith("http")
                  ? previewPhoto
                  : `${API_BASE}/uploads/${previewPhoto}`
              }
              alt="Preview"
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
