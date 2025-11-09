// import React from "react";
// import { Check, Trash2, X } from "lucide-react";

// export default function UserDetailModal({ viewUser, onClose, handleAction, handleDelete }) {
//   if (!viewUser) return null;

//   // Helper to get photo URL safely
//   const getPhotoUrl = (photo, placeholder) => {
//     if (!photo) return placeholder;
//     return photo.startsWith("http") ? photo : `http://38.60.244.74:3000/uploads/${photo}`;
//   };

//   const getStatusClasses = (status) => {
//     if (!status) return "bg-gray-500 text-white";
//     const s = status.toLowerCase();
//     return s === "pending"
//       ? "bg-yellow-500 text-white"
//       : s === "approved"
//       ? "bg-emerald-600 text-white"
//       : "bg-rose-600 text-white";
//   };

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

//         {/* Header */}
//         <div className="flex flex-col items-center mb-5">
//           {viewUser.photo ? (
//             <img
//               src={getPhotoUrl(viewUser.photo, "https://via.placeholder.com/80")}
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
//           <div className="bg-neutral-800/70 p-2 rounded-lg">
//             <img
//               src={getPhotoUrl(viewUser.id_front_photo, "https://via.placeholder.com/200x120?text=Front+ID")}
//               alt="Front ID"
//               className="w-full h-32 object-cover rounded-md"
//             />
//             <p className="text-center text-white/70 text-xs mt-1">မှတ်ပုံတင် အရှေ့ဘက်</p>
//           </div>

//           <div className="bg-neutral-800/70 p-2 rounded-lg">
//             <img
//               src={getPhotoUrl(viewUser.id_back_photo, "https://via.placeholder.com/200x120?text=Back+ID")}
//               alt="Back ID"
//               className="w-full h-32 object-cover rounded-md"
//             />
//             <p className="text-center text-white/70 text-xs mt-1">မှတ်ပုံတင် အနောက်ဘက်</p>
//           </div>
//         </div>

//         {/* Info Grid */}
//         <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-white/80 text-sm mb-6">
//           {[
//             { label: "ID Type", value: viewUser.id_type },
//             { label: "ID Number", value: viewUser.id_number },
//             { label: "Phone", value: viewUser.phone },
//             { label: "State / City", value: `${viewUser.state} / ${viewUser.city}` },
//             { label: "Address", value: viewUser.address },
//             {
//               label: "Status",
//               value: (
//                 <span className={`px-3 py-1 rounded-full text-xs ${getStatusClasses(viewUser.status)}`}>
//                   {viewUser.status}
//                 </span>
//               ),
//             },
//           ].map((item, idx) => (
//             <div key={idx} className="mb-4">
//               <p className="text-white/500 mb-2 text-xs">{item.label}</p>
//               <p>{item.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => handleDelete(viewUser)}
//             className="flex items-center gap-1 px-2 py-1 bg-rose-600 hover:bg-rose-700 rounded text-white text-sm"
//           >
//             <Trash2 className="h-4 w-4" /> Delete
//           </button>

//           <button
//             onClick={() => handleAction("approve", viewUser)}
//             className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium"
//           >
//             Approve <Check size={14} />
//           </button>

//           <button
//             onClick={() => handleAction("reject", viewUser)}
//             className="flex items-center gap-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-white text-sm font-medium"
//           >
//             Reject <X size={14} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React from "react";
// import { Trash2, Mail } from "lucide-react";

// export default function UserDetailModal({ viewUser, onClose, handleDelete, sendMessage }) {
//   if (!viewUser) return null;

//   const getPhotoUrl = (photo, placeholder) => {
//     if (!photo) return placeholder;
//     return photo.startsWith("http") ? photo : `http://38.60.244.74:3000/uploads/${photo}`;
//   };

//   const getStatusClasses = (status) => {
//     if (!status) return "bg-gray-500 text-white";
//     const s = status.toLowerCase();
//     return s === "pending"
//       ? "bg-yellow-500 text-white"
//       : s === "approved"
//       ? "bg-emerald-600 text-white"
//       : "bg-rose-600 text-white";
//   };

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

//         {/* Header */}
//         <div className="flex flex-col items-center mb-5">
//           {viewUser.photo ? (
//             <img
//               src={getPhotoUrl(viewUser.photo, "https://via.placeholder.com/80")}
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
//           <div className="bg-neutral-800/70 p-2 rounded-lg">
//             <img
//               src={
//                 viewUser.id_front_photo
//                   ? getPhotoUrl(viewUser.id_front_photo, "https://via.placeholder.com/200x120?text=Front+ID")
//                   : "https://via.placeholder.com/200x120?text=Front+ID"
//               }
//               alt="Front ID"
//               className="w-full h-32 object-cover rounded-md"
//             />
//             <p className="text-center text-white/70 text-xs mt-1">မှတ်ပုံတင် အရှေ့ဘက်</p>
//           </div>
//           <div className="bg-neutral-800/70 p-2 rounded-lg">
//             <img
//               src={
//                 viewUser.id_back_photo
//                   ? getPhotoUrl(viewUser.id_back_photo, "https://via.placeholder.com/200x120?text=Back+ID")
//                   : "https://via.placeholder.com/200x120?text=Back+ID"
//               }
//               alt="Back ID"
//               className="w-full h-32 object-cover rounded-md"
//             />
//             <p className="text-center text-white/70 text-xs mt-1">မှတ်ပုံတင် အနောက်ဘက်</p>
//           </div>
//         </div>

//         {/* Info Grid */}
//         <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-white/80 text-sm mb-6">
//           {[
//             { label: "ID Type", value: viewUser.id_type },
//             { label: "ID Number", value: viewUser.id_number },
//             { label: "Phone", value: viewUser.phone },
//             { label: "State / City", value: `${viewUser.state} / ${viewUser.city}` },
//             { label: "Address", value: viewUser.address },
//             {
//               label: "Status",
//               value: (
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs ${getStatusClasses(viewUser.status)}`}
//                 >
//                   {viewUser.status}
//                 </span>
//               ),
//             },
//           ].map((item, idx) => (
//             <div key={idx} className="mb-4">
//               <p className="text-white/500 mb-2 text-xs">{item.label}</p>
//               <p>{item.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => handleDelete(viewUser)}
//             className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 rounded text-white text-sm"
//           >
//             <Trash2 className="h-4 w-4" /> Delete
//           </button>

//           <button
//             onClick={() => sendMessage(viewUser)}
//             className="flex items-center gap-1 px-3 py-1 bg-sky-600 hover:bg-sky-700 rounded text-white text-sm"
//           >
//             <Mail className="h-4 w-4" /> Message
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Trash2, Mail } from "lucide-react";

export default function UserDetailModal({ viewUser, onClose, handleDelete, sendMessage }) {
  if (!viewUser) return null;

  const getPhotoUrl = (photo, placeholder) => {
    if (!photo) return placeholder;
    return photo.startsWith("http") ? photo : `http://38.60.244.74:3000/uploads/${photo}`;
  };

  const getStatusClasses = (status) => {
    if (!status) return "bg-gray-500 text-white";
    const s = status.toLowerCase();
    return s === "pending"
      ? "bg-yellow-500 text-white"
      : s === "approved"
      ? "bg-emerald-600 text-white"
      : "bg-rose-600 text-white";
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

        {/* Header */}
        <div className="flex flex-col items-center mb-5">
          {viewUser.photo ? (
            <img
              src={getPhotoUrl(viewUser.photo, "https://via.placeholder.com/80")}
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
          <h3 className="text-lg font-semibold text-white">{viewUser.fullname}</h3>
          <p className="text-white/60 text-sm">{viewUser.email}</p>
        </div>

        {/* ID Photos */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-neutral-800/70 p-2 rounded-lg">
            <img
              src={
                viewUser.id_front_photo
                  ? getPhotoUrl(viewUser.id_front_photo, "https://via.placeholder.com/200x120?text=Front+ID")
                  : "https://via.placeholder.com/200x120?text=Front+ID"
              }
              alt="Front ID"
              className="w-full h-32 object-cover rounded-md"
            />
            <p className="text-center text-white/70 text-xs mt-1">မှတ်ပုံတင် အရှေ့ဘက်</p>
          </div>
          <div className="bg-neutral-800/70 p-2 rounded-lg">
            <img
              src={
                viewUser.id_back_photo
                  ? getPhotoUrl(viewUser.id_back_photo, "https://via.placeholder.com/200x120?text=Back+ID")
                  : "https://via.placeholder.com/200x120?text=Back+ID"
              }
              alt="Back ID"
              className="w-full h-32 object-cover rounded-md"
            />
            <p className="text-center text-white/70 text-xs mt-1">မှတ်ပုံတင် အနောက်ဘက်</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-white/80 text-sm mb-6">
          {[
            { label: "ID Type", value: viewUser.id_type },
            { label: "ID Number", value: viewUser.id_number },
            { label: "Phone", value: viewUser.phone },
            { label: "State / City", value: `${viewUser.state} / ${viewUser.city}` },
            { label: "Address", value: viewUser.address },
            {
              label: "Status",
              value: (
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusClasses(viewUser.status)}`}
                >
                  {viewUser.status}
                </span>
              ),
            },
          ].map((item, idx) => (
            <div key={idx} className="mb-4">
              <p className="text-white/500 mb-2 text-xs">{item.label}</p>
              <p>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => handleDelete(viewUser)}
            className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 rounded text-white text-sm"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>

          <button
            onClick={() => sendMessage(viewUser)} // switch to chat
            className="flex items-center gap-1 px-3 py-1 bg-sky-600 hover:bg-sky-700 rounded text-white text-sm"
          >
            <Mail className="h-4 w-4" /> Message
          </button>
        </div>
      </div>
    </div>
  );
}
