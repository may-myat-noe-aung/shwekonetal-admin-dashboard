

// import React, { useState, useEffect, useRef } from "react";
// import { Eye, EyeOff } from "lucide-react";

// export default function ChangePasscodeForm({ email }) {
//   const [showNewPasscode, setShowNewPasscode] = useState(false);
//   const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);
//   const [showOwnerPasscodeSecurity, setShowOwnerPasscodeSecurity] = useState(false);
//   const [security, setSecurity] = useState({
//     email: email || "",
//     passcode: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [emails, setEmails] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(); // ✅ Added ref

//   // Fetch emails from API
//   useEffect(() => {
//     const fetchEmails = async () => {
//       try {
//         const res = await fetch("http://38.60.244.74:3000/admin");
//         const json = await res.json();
//         if (json.success && Array.isArray(json.data)) {
//           const sorted = json.data
//             .filter(item => item.email && item.role)
//             .sort((a, b) => {
//               const order = { owner: 0, manager: 1, seller: 2 };
//               return (order[a.role.toLowerCase()] ?? 99) - (order[b.role.toLowerCase()] ?? 99);
//             });
//           setEmails(sorted);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchEmails();
//   }, []);

//   // Update security if prop changes
//   useEffect(() => {
//     if (email) setSecurity(prev => ({ ...prev, email }));
//   }, [email]);

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

//   const handleSecurityChange = (field, value) => {
//     setSecurity(prev => ({ ...prev, [field]: value }));
//   };

//   const handleEnterFocusNext = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const next = e.currentTarget.closest("form,div")?.querySelectorAll("input, select");
//       const inputs = Array.from(next);
//       const index = inputs.indexOf(e.currentTarget);
//       if (inputs[index + 1]) inputs[index + 1].focus();
//     }
//   };

//   const handleCancelSecurity = () => {
//     setSecurity({
//       email: "",
//       passcode: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//   };

//   const handleChangePasscode = async () => {
//     if (!security.email || !security.passcode || !security.newPassword || !security.confirmPassword) {
//       return alert("Please fill all fields ❌");
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("http://38.60.244.74:3000/admin/passcode", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: security.email,
//           newpasscode: security.newPassword,
//           confirmPassword: security.confirmPassword,
//           passcode: security.passcode,
//         }),
//       });
//       const data = await res.json();
//       alert(`${data.success ? "✅" : "❌"} ${data.message || "Something went wrong"}`);
//       if (data.success) handleCancelSecurity();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full">
//       <h4 className="text-lg font-semibold mb-4">Change Passcode</h4>
//       <div className="space-y-5 w-full">

//         {/* Custom Email Dropdown */}
//         <div className="w-full relative" ref={dropdownRef}>
//           <label className="block text-sm mb-2 text-neutral-400">Email</label>
//           <div
//             className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 cursor-pointer focus:outline-none focus:border-yellow-400"
//             onClick={() => setDropdownOpen(prev => !prev)}
//           >
//             {security.email || "Select account email"}
//           </div>
//           {dropdownOpen && (
//             <ul className="absolute z-50 w-full max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-lg mt-1 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-neutral-800">
//               {emails.map(admin => (
//                 <li
//                   key={admin.id}
//                   className="px-3 py-2 text-neutral-200 hover:bg-yellow-400 hover:text-black cursor-pointer"
//                   onClick={() => {
//                     handleSecurityChange("email", admin.email);
//                     setDropdownOpen(false);
//                   }}
//                 >
//                   {admin.email}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* New Passcode */}
//         <div className="w-full">
//           <label className="block text-sm mb-2 text-neutral-400">New Passcode</label>
//           <div className="relative">
//             <input
//               type={showNewPasscode ? "text" : "password"}
//               value={security.newPassword}
//               onChange={(e) => {
//                 const val = e.target.value.replace(/\D/g, "").slice(0, 6);
//                 handleSecurityChange("newPassword", val);
//               }}
//               onKeyDown={handleEnterFocusNext}
//               placeholder="Enter new passcode"
//               className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
//             />
//             <span
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
//               onClick={() => setShowNewPasscode(!showNewPasscode)}
//             >
//               {showNewPasscode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
//             </span>
//           </div>
//         </div>

//         {/* Confirm Passcode */}
//         <div className="w-full">
//           <label className="block text-sm mb-2 text-neutral-400">Confirm Passcode</label>
//           <div className="relative">
//             <input
//               type={showConfirmPasscode ? "text" : "password"}
//               value={security.confirmPassword}
//               onChange={(e) => {
//                 const val = e.target.value.replace(/\D/g, "").slice(0, 6);
//                 handleSecurityChange("confirmPassword", val);
//               }}
//               onKeyDown={handleEnterFocusNext}
//               placeholder="Confirm new passcode"
//               className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
//             />
//             <span
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
//               onClick={() => setShowConfirmPasscode(!showConfirmPasscode)}
//             >
//               {showConfirmPasscode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
//             </span>
//           </div>
//         </div>

//         {/* Owner Passcode */}
//         <div className="w-full">
//           <label className="block text-sm mb-2 text-neutral-400">Owner Passcode</label>
//           <div className="relative">
//             <input
//               type={showOwnerPasscodeSecurity ? "text" : "password"}
//               value={security.passcode}
//               onChange={(e) => handleSecurityChange("passcode", e.target.value)}
//               onKeyDown={handleEnterFocusNext}
//               placeholder="Enter owner passcode"
//               className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
//             />
//             <span
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
//               onClick={() => setShowOwnerPasscodeSecurity(!showOwnerPasscodeSecurity)}
//             >
//               {showOwnerPasscodeSecurity ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
//             </span>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 pt-4">
//           <button
//             onClick={handleCancelSecurity}
//             disabled={loading}
//             className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm w-full sm:w-auto"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleChangePasscode}
//             disabled={loading}
//             className="rounded-lg bg-yellow-400 text-black px-5 py-2 hover:bg-yellow-500 transition-colors font-medium text-sm w-full sm:w-auto"
//           >
//             {loading ? "Updating..." : "Change Passcode"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasscodeForm({ email }) {
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);
  const [showOwnerPasscodeSecurity, setShowOwnerPasscodeSecurity] = useState(false);
  const [security, setSecurity] = useState({
    email: email || "",
    passcode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(); // ✅ Added ref

  // Fetch emails
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/admin");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const sorted = json.data
            .filter(item => item.email && item.role)
            .sort((a, b) => {
              const order = { owner: 0, manager: 1, seller: 2 };
              return (order[a.role.toLowerCase()] ?? 99) - (order[b.role.toLowerCase()] ?? 99);
            });
          setEmails(sorted);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    if (email) setSecurity(prev => ({ ...prev, email }));
  }, [email]);

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

  const handleSecurityChange = (field, value) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const handleEnterFocusNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = e.currentTarget.closest("form,div")?.querySelectorAll("input, select");
      const inputs = Array.from(next);
      const index = inputs.indexOf(e.currentTarget);
      if (inputs[index + 1]) inputs[index + 1].focus();
    }
  };

  const handleCancelSecurity = () => {
    setSecurity({
      email: "",
      passcode: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleChangePasscode = async () => {
    if (!security.email || !security.passcode || !security.newPassword || !security.confirmPassword) {
      return alert("Please fill all fields ❌");
    }

    setLoading(true);
    try {
      const res = await fetch("http://38.60.244.74:3000/admin/passcode", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: security.email,
          newpasscode: security.newPassword,
          confirmPassword: security.confirmPassword,
          passcode: security.passcode,
        }),
      });
      const data = await res.json();
      alert(`${data.success ? "✅" : "❌"} ${data.message || "Something went wrong"}`);
      if (data.success) handleCancelSecurity();
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full">
      <h4 className="text-lg font-semibold mb-4">Change Passcode</h4>
      <div className="space-y-5 w-full">

        {/* Custom Email Dropdown */}
        <div className="w-full relative" ref={dropdownRef}>
          <label className="block text-sm mb-2 text-neutral-400">Email</label>
          <div
            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 cursor-pointer focus:outline-none focus:border-yellow-400"
            onClick={() => setDropdownOpen(prev => !prev)}
            tabIndex={0}
          >
            {security.email || "Select account email"}
          </div>
          {dropdownOpen && (
        <ul className="absolute z-50 w-full max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-lg mt-1 scrollbar-none">
  {emails.map((admin, index) => (
    <li
      key={admin.id}
      className={`px-3 py-2 cursor-pointer hover:bg-yellow-400 hover:text-black`}
      onMouseEnter={() => setHighlightedIndex(index)}
      onMouseLeave={() => setHighlightedIndex(-1)}
      onClick={() => {
        handleSecurityChange("email", admin.email);
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }}
    >
      {admin.email}
    </li>
  ))}
</ul>

          )}
        </div>

        {/* New Passcode */}
        <div className="w-full">
          <label className="block text-sm mb-2 text-neutral-400">New Passcode</label>
          <div className="relative">
            <input
              type={showNewPasscode ? "text" : "password"}
              value={security.newPassword}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                handleSecurityChange("newPassword", val);
              }}
              onKeyDown={handleEnterFocusNext}
              placeholder="Enter new passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
              onClick={() => setShowNewPasscode(!showNewPasscode)}
            >
              {showNewPasscode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </span>
          </div>
        </div>

        {/* Confirm Passcode */}
        <div className="w-full">
          <label className="block text-sm mb-2 text-neutral-400">Confirm Passcode</label>
          <div className="relative">
            <input
              type={showConfirmPasscode ? "text" : "password"}
              value={security.confirmPassword}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                handleSecurityChange("confirmPassword", val);
              }}
              onKeyDown={handleEnterFocusNext}
              placeholder="Confirm new passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
              onClick={() => setShowConfirmPasscode(!showConfirmPasscode)}
            >
              {showConfirmPasscode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </span>
          </div>
        </div>

        {/* Owner Passcode */}
        <div className="w-full">
          <label className="block text-sm mb-2 text-neutral-400">Owner Passcode</label>
          <div className="relative">
            <input
              type={showOwnerPasscodeSecurity ? "text" : "password"}
              value={security.passcode}
              onChange={(e) => handleSecurityChange("passcode", e.target.value)}
              onKeyDown={handleEnterFocusNext}
              placeholder="Enter owner passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
              onClick={() => setShowOwnerPasscodeSecurity(!showOwnerPasscodeSecurity)}
            >
              {showOwnerPasscodeSecurity ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleCancelSecurity}
            disabled={loading}
            className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleChangePasscode}
            disabled={loading}
            className="rounded-lg bg-yellow-400 text-black px-5 py-2 hover:bg-yellow-500 transition-colors font-medium text-sm w-full sm:w-auto"
          >
            {loading ? "Updating..." : "Change Passcode"}
          </button>
        </div>

      </div>
    </div>
  );
}
