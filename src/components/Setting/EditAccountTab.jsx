// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { X } from "lucide-react";

// export default function EditAccountTab() {
//   const [accounts, setAccounts] = useState([]);
//   const [selectedEmail, setSelectedEmail] = useState("");
//   const [account, setAccount] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [password, setPassword] = useState("");

//   const roles = ["owner", "manager", "seller"];

//   const nameRef = useRef(null);
//   const phoneRef = useRef(null);
//   const genderRefs = {
//     male: useRef(null),
//     female: useRef(null),
//     other: useRef(null),
//   };
//   const roleRef = useRef(null);

//   // Fetch accounts
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get("http://38.60.244.74:3000/admin");
//         if (res.data.success) {
//           const order = { owner: 1, manager: 2, seller: 3 };
//           const sorted = [...res.data.data].sort(
//             (a, b) => order[a.role] - order[b.role]
//           );
//           setAccounts(sorted);
//           const firstOwner = sorted.find((a) => a.role === "owner");
//           setSelectedEmail(firstOwner?.email || sorted[0]?.email || "");
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAccounts();
//   }, []);

//   // Set selected account
//   useEffect(() => {
//     const acc = accounts.find((a) => a.email === selectedEmail);
//     if (acc) {
//       if (!["male", "female"].includes(acc.gender?.toLowerCase()))
//         acc.gender = "other";
//       setAccount(acc);
//       setTimeout(() => nameRef.current?.focus(), 0);
//     } else setAccount(null);
//   }, [selectedEmail, accounts]);

//   // Handle Enter key
//   const handleEnter = (e, nextRef) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       nextRef?.current?.focus();
//     }
//   };

//   // Open passcode modal
//   const handleSaveClick = () => {
//     if (!account) return;
//     setShowModal(true);
//   };

//   // Cancel modal
//   const cancelModal = () => {
//     setShowModal(false);
//     setPassword("");
//   };

//   // Submit passcode & update
//   const handlePasswordSubmit = async () => {
//     if (!password) {
//       alert("Please enter passcode");
//       return;
//     }

//     try {
//       // Verify owner passcode
//       const verify = await axios.post(
//         "http://38.60.244.74:3000/admin/verify-owner-passcode",
//         { passcode: password },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (!verify.data.success) {
//         alert("Incorrect passcode!");
//         return;
//       }

//       // If passcode is correct, update account
//       setSaving(true);
//       const formData = new FormData();
//       formData.append("strid", account.id);
//       formData.append("name", account.name);
//       formData.append("email", account.email);
//       formData.append("phone", account.phone);
//       formData.append("gender", account.gender);
//       formData.append("role", account.role);
//       if (account.photo instanceof File)
//         formData.append("photo", account.photo);
//       else if (typeof account.photo === "string")
//         formData.append("photo", account.photo);

//       const res = await axios.put("http://38.60.244.74:3000/admin", formData);
//       if (res.data.success) {
//         alert("Account updated successfully ✅");
//         setShowModal(false);
//         setPassword("");
//       } else {
//         alert("Failed to update ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error verifying passcode or updating account ❌");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="text-neutral-400">Loading accounts...</p>;

//   return (
//     <div>
//       <div className="flex justify-between">
//         <h3 className="font-bold text-text-xl mb-6 text-amber-400">
//           Edit Account
//         </h3>

//         {/* Email Select */}
//         <div className="mb-6">
//           {/* <label className="block text-sm text-neutral-400 mb-2">
//           Select Email:
//         </label> */}
//           <select
//             value={selectedEmail}
//             onChange={(e) => setSelectedEmail(e.target.value)}
//             className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-400"
//           >
//             {accounts.map((a) => (
//               <option key={a.id} value={a.email}>
//                 {a.email}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {account && (
//         <div className="">
//           {/* Left: Photo */}
//           <div className="flex flex-col items-start mb-4">
//             <div className="relative w-24 h-24 mb-2">
//               {/* Photo or Initials */}
//               <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
//                 {account.photo ? (
//                   <img
//                     src={
//                       account.photo instanceof File
//                         ? URL.createObjectURL(account.photo)
//                         : `http://38.60.244.74:3000/uploads/${account.photo}`
//                     }
//                     alt={account.name}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-black font-bold text-xl">
//                     {account.name
//                       ? account.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .slice(0, 2)
//                           .join("")
//                           .toUpperCase()
//                       : "NA"}
//                   </span>
//                 )}
//               </div>

//               {/* Camera Icon always visible */}
//               <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-shadow shadow-md">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) =>
//                     setAccount({ ...account, photo: e.target.files[0] })
//                   }
//                 />
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 text-amber-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 7h2l1-2h12l1 2h2M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7H5z"
//                   />
//                   <circle
//                     cx="12"
//                     cy="13"
//                     r="3"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   />
//                 </svg>
//               </label>
//             </div>

//             <span className="text-sm text-neutral-400">Profile Photo</span>
//           </div>

//           {/* Right: Form Fields */}
//           <div className="flex-1 grid grid-cols-2 gap-6">
//             {/* Left Column */}
//             <div>
//               <label className="text-sm text-neutral-400 block mb-2">
//                 Name *
//               </label>
//               <input
//                 type="text"
//                 ref={nameRef}
//                 value={account.name || ""}
//                 onChange={(e) =>
//                   setAccount({ ...account, name: e.target.value })
//                 }
//                 onKeyDown={(e) => handleEnter(e, phoneRef)}
//                 className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-sm text-neutral-400 block mb-2">
//                 Phone *
//               </label>
//               <input
//                 type="text"
//                 ref={phoneRef}
//                 value={account.phone || ""}
//                 onChange={(e) =>
//                   setAccount({ ...account, phone: e.target.value })
//                 }
//                 onKeyDown={(e) => handleEnter(e, roleRef)}
//                 className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
//                 required
//               />
//             </div>

//             {/* Right Column */}
//             {/* <div>
//               <label className="text-sm text-neutral-400 block mb-2">
//                 Role *
//               </label>
//               <select
//                 ref={roleRef}
//                 value={account.role || ""}
//                 onChange={(e) =>
//                   setAccount({ ...account, role: e.target.value })
//                 }
//                 className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-400"
//                 required
//               >
//                 {roles.map((r) => (
//                   <option key={r} value={r}>
//                     {r.charAt(0).toUpperCase() + r.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div> */}
//             <div>
//               <label className="text-sm text-neutral-400 block mb-4">
//                 Gender *
//               </label>
//               <div className="flex gap-4">
//                 {["male", "female", "other"].map((g) => (
//                   <label key={g} className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="gender"
//                       ref={genderRefs[g]}
//                       checked={account.gender?.toLowerCase() === g}
//                       onChange={() => setAccount({ ...account, gender: g })}
//                       onKeyDown={(e) => handleEnter(e, roleRef)}
//                       className="text-amber-400 focus:ring-amber-400"
//                       required
//                     />
//                     <span className="text-neutral-300 text-sm">
//                       {g.charAt(0).toUpperCase() + g.slice(1)}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Buttons at bottom-right */}
//             <div className="col-span-2 flex justify-end gap-3 pt-4">
//               <button
//                 onClick={() => setSelectedEmail("")}
//                 className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveClick}
//                 disabled={saving}
//                 className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm"
//               >
//                 {saving ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Passcode Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
//             <button
//               onClick={cancelModal} // Cancel stops everything immediately
//               className="absolute top-2 right-2 text-neutral-400 hover:text-white"
//             >
//               <X size={18} />
//             </button>
//             <h3 className="text-lg font-semibold mb-4 text-center">
//               Enter Owner Passcode
//             </h3>
//             <input
//               type="password"
//               ref={(input) => input && input.focus()} // Auto-focus on open
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter passcode"
//               className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handlePasswordSubmit(); // Enter → Confirm
//               }}
//             />
//             <div className="flex justify-between">
//               <button
//                 onClick={cancelModal} // Stops countdown/actions immediately
//                 className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePasswordSubmit}
//                 className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
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

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { X } from "lucide-react";

// export default function EditAccountTab() {
//   const [accounts, setAccounts] = useState([]);
//   const [selectedEmail, setSelectedEmail] = useState("");
//   const [account, setAccount] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [password, setPassword] = useState("");

//   const roles = ["owner", "manager", "seller"];

//   const nameRef = useRef(null);
//   const phoneRef = useRef(null);
//   const genderRefs = {
//     male: useRef(null),
//     female: useRef(null),
//     other: useRef(null),
//   };
//   const roleRef = useRef(null);

//   // ✅ Custom Dropdown refs and state
//   const dropdownRef = useRef();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);

//   // Fetch accounts
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get("http://38.60.244.74:3000/admin");
//         if (res.data.success) {
//           const order = { owner: 1, manager: 2, seller: 3 };
//           const sorted = [...res.data.data].sort(
//             (a, b) => order[a.role] - order[b.role]
//           );
//           setAccounts(sorted);
//           const firstOwner = sorted.find((a) => a.role === "owner");
//           setSelectedEmail(firstOwner?.email || sorted[0]?.email || "");
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAccounts();
//   }, []);

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Set selected account
//   useEffect(() => {
//     const acc = accounts.find((a) => a.email === selectedEmail);
//     if (acc) {
//       if (!["male", "female"].includes(acc.gender?.toLowerCase()))
//         acc.gender = "other";
//       setAccount(acc);
//       setTimeout(() => nameRef.current?.focus(), 0);
//     } else setAccount(null);
//   }, [selectedEmail, accounts]);

//   // Handle Enter key
//   const handleEnter = (e, nextRef) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       nextRef?.current?.focus();
//     }
//   };

//   // Open passcode modal
//   const handleSaveClick = () => {
//     if (!account) return;
//     setShowModal(true);
//   };

//   // Cancel modal
//   const cancelModal = () => {
//     setShowModal(false);
//     setPassword("");
//   };

//   // Submit passcode & update
//   const handlePasswordSubmit = async () => {
//     if (!password) {
//       alert("Please enter passcode");
//       return;
//     }

//     try {
//       const verify = await axios.post(
//         "http://38.60.244.74:3000/admin/verify-owner-passcode",
//         { passcode: password },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (!verify.data.success) {
//         alert("Incorrect passcode!");
//         return;
//       }

//       setSaving(true);
//       const formData = new FormData();
//       formData.append("strid", account.id);
//       formData.append("name", account.name);
//       formData.append("email", account.email);
//       formData.append("phone", account.phone);
//       formData.append("gender", account.gender);
//       formData.append("role", account.role);
//       if (account.photo instanceof File)
//         formData.append("photo", account.photo);
//       else if (typeof account.photo === "string")
//         formData.append("photo", account.photo);

//       const res = await axios.put("http://38.60.244.74:3000/admin", formData);
//       if (res.data.success) {
//         alert("Account updated successfully ✅");
//         setShowModal(false);
//         setPassword("");
//       } else {
//         alert("Failed to update ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error verifying passcode or updating account ❌");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="text-neutral-400">Loading accounts...</p>;

//   return (
//     <div>
//       <div className="flex justify-between">
//         <h3 className="font-bold text-text-xl mb-6 text-amber-400">
//           Edit Account
//         </h3>

//         {/* ✅ Custom Email Dropdown */}
//         <div className="w-[300px] mb-6 relative" ref={dropdownRef}>
//           {/* <label className="block text-sm mb-2 text-neutral-400">Email</label> */}
//           <div
//             className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 cursor-pointer focus:outline-none focus:border-yellow-400"
//             onClick={() => setDropdownOpen((prev) => !prev)}
//             tabIndex={0}
//           >
//             {selectedEmail || "Select account email"}
//           </div>
//           {dropdownOpen && (
//             <ul className="absolute z-50 w-full max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-lg mt-1 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-neutral-800">
//               {accounts.map((a, index) => (
//                 <li
//                   key={a.id}
//                   className={`px-3 py-2 cursor-pointer ${
//                     highlightedIndex === index
//                       ? "bg-yellow-400 text-black"
//                       : "text-white hover:bg-yellow-400 hover:text-black"
//                   }`}
//                   onMouseEnter={() => setHighlightedIndex(index)}
//                   onMouseLeave={() => setHighlightedIndex(-1)}
//                   onClick={() => {
//                     setSelectedEmail(a.email);
//                     setDropdownOpen(false);
//                     setHighlightedIndex(-1);
//                   }}
//                 >
//                   {a.email}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {account && (
//         <div className="">
//           {/* Left: Photo */}
//           <div className="flex flex-col items-start mb-4">
//             <div className="relative w-24 h-24 mb-2">
//               <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
//                 {account.photo ? (
//                   <img
//                     src={
//                       account.photo instanceof File
//                         ? URL.createObjectURL(account.photo)
//                         : `http://38.60.244.74:3000/uploads/${account.photo}`
//                     }
//                     alt={account.name}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-black font-bold text-xl">
//                     {account.name
//                       ? account.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .slice(0, 2)
//                           .join("")
//                           .toUpperCase()
//                       : "NA"}
//                   </span>
//                 )}
//               </div>

//               <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-shadow shadow-md">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) =>
//                     setAccount({ ...account, photo: e.target.files[0] })
//                   }
//                 />
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 text-amber-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 7h2l1-2h12l1 2h2M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7H5z"
//                   />
//                   <circle
//                     cx="12"
//                     cy="13"
//                     r="3"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   />
//                 </svg>
//               </label>
//             </div>
//             <span className="text-sm text-neutral-400">Profile Photo</span>
//           </div>

//           {/* Right: Form Fields */}
//           <div className="flex-1 grid grid-cols-2 gap-6">
//             <div>
//               <label className="text-sm text-neutral-400 block mb-2">
//                 Name *
//               </label>
//               <input
//                 type="text"
//                 ref={nameRef}
//                 value={account.name || ""}
//                 onChange={(e) =>
//                   setAccount({ ...account, name: e.target.value })
//                 }
//                 onKeyDown={(e) => handleEnter(e, phoneRef)}
//                 className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-sm text-neutral-400 block mb-2">
//                 Phone *
//               </label>
//               <input
//                 type="text"
//                 ref={phoneRef}
//                 value={account.phone || ""}
//                 onChange={(e) =>
//                   setAccount({ ...account, phone: e.target.value })
//                 }
//                 onKeyDown={(e) => handleEnter(e, roleRef)}
//                 className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-sm text-neutral-400 block mb-4">
//                 Gender *
//               </label>
//               <div className="flex gap-4">
//                 {["male", "female", "other"].map((g) => (
//                   <label key={g} className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="gender"
//                       ref={genderRefs[g]}
//                       checked={account.gender?.toLowerCase() === g}
//                       onChange={() => setAccount({ ...account, gender: g })}
//                       onKeyDown={(e) => handleEnter(e, roleRef)}
//                       className="text-amber-400 focus:ring-amber-400"
//                       required
//                     />
//                     <span className="text-neutral-300 text-sm">
//                       {g.charAt(0).toUpperCase() + g.slice(1)}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="col-span-2 flex justify-end gap-3 pt-4">
//               <button
//                 onClick={() => setSelectedEmail("")}
//                 className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveClick}
//                 disabled={saving}
//                 className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm"
//               >
//                 {saving ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Passcode Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
//             <button
//               onClick={cancelModal}
//               className="absolute top-2 right-2 text-neutral-400 hover:text-white"
//             >
//               <X size={18} />
//             </button>
//             <h3 className="text-lg font-semibold mb-4 text-center">
//               Enter Owner Passcode
//             </h3>
//             <input
//               type="password"
//               ref={(input) => input && input.focus()}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter passcode"
//               className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handlePasswordSubmit();
//               }}
//             />
//             <div className="flex justify-between">
//               <button
//                 onClick={cancelModal}
//                 className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePasswordSubmit}
//                 className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
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

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function EditAccountTab() {
  const [accounts, setAccounts] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  const roles = ["owner", "manager", "seller"];

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const genderRefs = {
    male: useRef(null),
    female: useRef(null),
    other: useRef(null),
  };
  const roleRef = useRef(null);

  // ✅ Dropdown state
  const dropdownRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://38.60.244.74:3000/admin");
        if (res.data.success) {
          const order = { owner: 1, manager: 2, seller: 3 };
          const sorted = [...res.data.data].sort(
            (a, b) => order[a.role] - order[b.role]
          );
          setAccounts(sorted);
          const firstOwner = sorted.find((a) => a.role === "owner");
          setSelectedEmail(firstOwner?.email || sorted[0]?.email || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  // Set selected account
  useEffect(() => {
    const acc = accounts.find((a) => a.email === selectedEmail);
    if (acc) {
      if (!["male", "female"].includes(acc.gender?.toLowerCase()))
        acc.gender = "other";
      setAccount(acc);
      setTimeout(() => nameRef.current?.focus(), 0);
    } else setAccount(null);
  }, [selectedEmail, accounts]);

  // Handle Enter key for inputs
  const handleEnter = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  // ✅ Handle keyboard navigation for dropdown

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open passcode modal
  const handleSaveClick = () => {
    if (!account) return;
    setShowModal(true);
  };

  // Cancel modal
  const cancelModal = () => {
    setShowModal(false);
    setPassword("");
  };

  // Submit passcode & update
  const handlePasswordSubmit = async () => {
    if (!password) {
      alert("Please enter passcode");
      return;
    }

    try {
      // Verify owner passcode
      const verify = await axios.post(
        "http://38.60.244.74:3000/admin/verify-owner-passcode",
        { passcode: password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!verify.data.success) {
        alert("Incorrect passcode!");
        return;
      }

      // If passcode is correct, update account
      setSaving(true);
      const formData = new FormData();
      formData.append("strid", account.id);
      formData.append("name", account.name);
      formData.append("email", account.email);
      formData.append("phone", account.phone);
      formData.append("gender", account.gender);
      formData.append("role", account.role);
      if (account.photo instanceof File)
        formData.append("photo", account.photo);
      else if (typeof account.photo === "string")
        formData.append("photo", account.photo);

      const res = await axios.put("http://38.60.244.74:3000/admin", formData);
      if (res.data.success) {
        alert("Account updated successfully ✅");
        setShowModal(false);
        setPassword("");
      } else {
        alert("Failed to update ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying passcode or updating account ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-neutral-400">Loading accounts...</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="font-bold text-text-xl mb-6 text-amber-400">
          Edit Account
        </h3>

        {/* ✅ Custom Email Dropdown */}
        <div className="mb-6 w-[300px] relative" ref={dropdownRef}>
          {/* <label className="block text-sm mb-2 text-neutral-400">Email</label> */}
          <div
            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 cursor-pointer focus:outline-none focus:border-yellow-400"
            onClick={() => setDropdownOpen((prev) => !prev)}
            tabIndex={0}
          >
            {selectedEmail || "Select account email"}
          </div>
          {dropdownOpen && (
            <ul className="absolute z-50 w-full max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-lg mt-1 scrollbar-none">
              {accounts.map((a, index) => (
                <li
                  key={a.id}
                  className={`px-3 py-2 cursor-pointer text-white hover:bg-yellow-400 hover:text-black`}
                  onClick={() => {
                    setSelectedEmail(a.email);
                    setDropdownOpen(false);
                  }}
                >
                  {a.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {account && (
        <div className="">
          {/* Left: Photo */}
          <div className="flex flex-col items-start mb-4">
            <div className="relative w-24 h-24 mb-2">
              {/* Photo or Initials */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                {account.photo ? (
                  <img
                    src={
                      account.photo instanceof File
                        ? URL.createObjectURL(account.photo)
                        : `http://38.60.244.74:3000/uploads/${account.photo}`
                    }
                    alt={account.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-black font-bold text-xl">
                    {account.name
                      ? account.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "NA"}
                  </span>
                )}
              </div>

              {/* Camera Icon always visible */}
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-shadow shadow-md">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setAccount({ ...account, photo: e.target.files[0] })
                  }
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h2l1-2h12l1 2h2M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7H5z"
                  />
                  <circle
                    cx="12"
                    cy="13"
                    r="3"
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                </svg>
              </label>
            </div>

            <span className="text-sm text-neutral-400">Profile Photo</span>
          </div>

          {/* Right: Form Fields */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <label className="text-sm text-neutral-400 block mb-2">
                Name *
              </label>
              <input
                type="text"
                ref={nameRef}
                value={account.name || ""}
                onChange={(e) =>
                  setAccount({ ...account, name: e.target.value })
                }
                onKeyDown={(e) => handleEnter(e, phoneRef)}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-2">
                Phone *
              </label>
              <input
                type="text"
                ref={phoneRef}
                value={account.phone || ""}
                onChange={(e) =>
                  setAccount({ ...account, phone: e.target.value })
                }
                onKeyDown={(e) => handleEnter(e, roleRef)}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400 block mb-4">
                Gender *
              </label>
              <div className="flex gap-4">
                {["male", "female", "other"].map((g) => (
                  <label key={g} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      ref={genderRefs[g]}
                      checked={account.gender?.toLowerCase() === g}
                      onChange={() => setAccount({ ...account, gender: g })}
                      onKeyDown={(e) => handleEnter(e, roleRef)}
                      className="text-amber-400 focus:ring-amber-400"
                      required
                    />
                    <span className="text-neutral-300 text-sm">
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons at bottom-right */}
            <div className="col-span-2 flex justify-end gap-3 pt-4">
              <button
                onClick={() => setSelectedEmail("")}
                className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                disabled={saving}
                className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Passcode Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={cancelModal}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Enter Owner Passcode
            </h3>
            <input
              type="password"
              ref={(input) => input && input.focus()}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePasswordSubmit();
              }}
            />
            <div className="flex justify-between">
              <button
                onClick={cancelModal}
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
    </div>
  );
}
