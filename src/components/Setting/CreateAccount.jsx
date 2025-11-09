// import { X } from "lucide-react";
// import React, { useState } from "react";

// export default function CreateAccount() {
//   const [newAccount, setNewAccount] = useState({
//     role: "Seller",
//     name: "",
//     password: "",
//     email: "",
//     phone: "",
//     gender: "Female",
//     photo: null,
//     passcode: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [showPasscodeModal, setShowPasscodeModal] = useState(false);
// const [passcode, setPasscode] = useState("");
// const [saving, setSaving] = useState(false);




//   const handleNewChange = (field, value) => {
//     setNewAccount((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: "" })); // clear error when typing
//   };

//   const handleRegister = async () => {
//     // Validation
//     const newErrors = {};
//     if (!newAccount.name.trim()) newErrors.name = "Name is required";
//     if (!newAccount.email.trim()) newErrors.email = "Email is required";
//     if (!newAccount.password.trim()) newErrors.password = "Password is required";
//     if (!newAccount.role.trim()) newErrors.role = "Role is required";

//     setErrors(newErrors);
//     setSuccessMessage("");

//     const handleSaveClick = () => {
//   setShowPasscodeModal(true);
//   setPasscode("");
// };

// const handlePasscodeSubmit = async () => {
//   if (!passcode.trim()) {
//     alert("Enter passcode!");
//     return;
//   }

//   try {
//     const res = await fetch("http://38.60.244.74:3000/admin/verify-owner-passcode", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ passcode }),
//     });
//     const data = await res.json();
//     if (!data.success) {
//       alert("Incorrect passcode!");
//       return;
//     }

//     // Passcode verified, now save account
//     await handleSaveAccount();
//     setShowPasscodeModal(false);
//   } catch (err) {
//     console.error(err);
//     alert("Passcode verification failed!");
//   }
// };



//     if (Object.keys(newErrors).length > 0) return;

//     // Prepare FormData
//     const formData = new FormData();
//     formData.append("name", newAccount.name);
//     formData.append("email", newAccount.email);
//     formData.append("password", newAccount.password);
//     formData.append("role", newAccount.role);
//     formData.append("gender", newAccount.gender);
//     formData.append("photo", newAccount.photo || "");
//     formData.append("phone", newAccount.phone);
//     if (newAccount.role === "Manager") formData.append("passcode", newAccount.passcode);

//     try {
//       setLoading(true);
//       const res = await fetch("http://38.60.244.74:3000/admin", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       if (res.ok && data.success) {
//         setSuccessMessage("✅ Account registered successfully!");
//         setNewAccount({
//           role: "Seller",
//           name: "",
//           password: "",
//           email: "",
//           phone: "",
//           gender: "Female",
//           photo: null,
//           passcode: "",
//         });
//         setErrors({});
//       } else {
//         alert(`❌ Failed: ${data.message || "Something went wrong"}`);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("❌ Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Inside your component
// const handlePasscodeConfirm = async () => {
//   if (!passcode.trim()) return alert("Enter passcode!");

//   try {
//     const res = await fetch(
//       "http://38.60.244.74:3000/admin/verify-owner-passcode",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ passcode: passcode.trim() }),
//       }
//     );
//     const data = await res.json();

//     if (!data.success) return alert("Incorrect passcode!");

//     // Passcode verified → now save the account
//     await handleRegister(); // call your existing register function
//     setShowPasscodeModal(false);
//   } catch (err) {
//     console.error(err);
//     alert("Passcode verification failed!");
//   }
// };


//   return (
//     <div>
//       <h3 className="font-bold text-2xl mb-6 text-amber-400">
//         Register New Account
//       </h3>

//       {/* Photo Upload at top */}
//       <div className="flex items-center gap-4 mb-6">
//         <img
//           src={
//             newAccount.photo
//               ? URL.createObjectURL(newAccount.photo)
//               : "/default-avatar.png"
//           }
//           alt="Profile"
//           className="w-20 h-20 rounded-full object-cover border border-neutral-700"
//         />
//         <label className="cursor-pointer text-sm text-amber-400 hover:text-amber-300 transition">
//           Upload Photo
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file) handleNewChange("photo", file);
//             }}
//           />
//         </label>
//       </div>

//       <div className="grid grid-cols-2 gap-6">
//         {/* Role */}
//         <div>
//           <label className="block text-sm mb-2 text-neutral-400">
//             Role <span className="text-red-500">*</span>
//           </label>
//           <select
//             value={newAccount.role}
//             onChange={(e) => handleNewChange("role", e.target.value)}
//             className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-sm text-neutral-200 focus:outline-none ${
//               errors.role ? "border-red-500" : "border-neutral-700 focus:border-amber-400"
//             }`}
//           >
//             <option value="Seller">Seller</option>
//             <option value="Manager">Manager</option>
//           </select>
//           {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
//         </div>

//         {/* Name */}
//         <div>
//           <label className="block text-sm mb-2 text-neutral-400">
//             Full Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={newAccount.name}
//             onChange={(e) => handleNewChange("name", e.target.value)}
//             className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-sm focus:outline-none ${
//               errors.name ? "border-red-500" : "border-neutral-700 focus:border-amber-400"
//             }`}
//           />
//           {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm mb-2 text-neutral-400">
//             Email <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             value={newAccount.email}
//             onChange={(e) => handleNewChange("email", e.target.value)}
//             className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-sm focus:outline-none ${
//               errors.email ? "border-red-500" : "border-neutral-700 focus:border-amber-400"
//             }`}
//           />
//           {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block text-sm mb-2 text-neutral-400">
//             Password <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="password"
//             value={newAccount.password}
//             onChange={(e) => handleNewChange("password", e.target.value)}
//             className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-sm focus:outline-none ${
//               errors.password ? "border-red-500" : "border-neutral-700 focus:border-amber-400"
//             }`}
//           />
//           {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm mb-2 text-neutral-400">Phone Number</label>
//           <input
//             type="text"
//             value={newAccount.phone}
//             onChange={(e) => handleNewChange("phone", e.target.value)}
//             className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
//           />
//         </div>

//         {/* Gender */}
//         <div>
//           <label className="block text-sm mb-2 text-neutral-400">Gender</label>
//           <div className="flex gap-4">
//             {["Female", "Male", "Other"].map((g) => (
//               <label key={g} className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name="gender"
//                   checked={newAccount.gender === g}
//                   onChange={() => handleNewChange("gender", g)}
//                   className="text-amber-400 focus:ring-amber-400"
//                 />
//                 <span className="text-neutral-300 text-sm">{g}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Passcode for Manager */}
//         {newAccount.role === "Manager" && (
//           <div>
//             <label className="block text-sm mb-2 text-neutral-400">Passcode</label>
//             <input
//               type="password"
//               value={newAccount.passcode}
//               onChange={(e) => handleNewChange("passcode", e.target.value)}
//               className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
//             />
//           </div>
//         )}

//         {/* Submit Button */}
//         <div className="col-span-2 flex flex-col gap-2 pt-4">
// <button
//   onClick={handlePasscodeConfirm}
//   className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
// >
//   Confirm
// </button>

//           {successMessage && (
//             <p className="text-green-500 text-sm mt-1">{successMessage}</p>
//           )}
//         </div>

// {showPasscodeModal && (
//   <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//     <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
//       <button
//         onClick={() => setShowPasscodeModal(false)}
//         className="absolute top-2 right-2 text-neutral-400 hover:text-white"
//       >
//         <X size={18} />
//       </button>

//       <h3 className="text-lg font-semibold mb-4 text-center">
//         Enter Owner Passcode
//       </h3>

//       <input
//         type="password"
//         value={passcode}
//         onChange={(e) => setPasscode(e.target.value)}
//         placeholder="Enter passcode"
//         className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
//       />

//       <div className="flex justify-between">
//         <button
//           onClick={() => setShowPasscodeModal(false)}
//           className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={async () => {
//             try {
//               const res = await fetch(
//                 "http://38.60.244.74:3000/admin/verify-owner-passcode",
//                 {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify({ passcode }),
//                 }
//               );
//               const data = await res.json();
//               if (!data.success) return alert("Incorrect passcode!");
              
//               // Passcode correct → now save account
//               handleSaveAccount(); 
//               setShowPasscodeModal(false);
//             } catch (err) {
//               console.error(err);
//               alert("Passcode verification failed!");
//             }
//           }}
//           className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
//         >
//           Confirm
//         </button>
//       </div>
//     </div>
//   </div>
// )}
        
//       </div>
//     </div>
//   );
// }

import { X } from "lucide-react";
import React, { useState } from "react";

export default function CreateAccount() {
  const [newAccount, setNewAccount] = useState({
    role: "Seller",
    name: "",
    password: "",
    email: "",
    phone: "",
    gender: "Female",
    photo: null,
    passcode: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState(""); // owner passcode modal
  const [saving, setSaving] = useState(false);

  // Handle field changes
  const handleNewChange = (field, value) => {
    setNewAccount((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Save account function
  const handleRegister = async () => {
    // Validation
    const newErrors = {};
    if (!newAccount.name.trim()) newErrors.name = "Name is required";
    if (!newAccount.email.trim()) newErrors.email = "Email is required";
    if (!newAccount.password.trim()) newErrors.password = "Password is required";
    if (!newAccount.role.trim()) newErrors.role = "Role is required";

    setErrors(newErrors);
    setSuccessMessage("");

    if (Object.keys(newErrors).length > 0) return;

    // Prepare FormData
    const formData = new FormData();
    formData.append("name", newAccount.name);
    formData.append("email", newAccount.email);
    formData.append("password", newAccount.password);
    formData.append("role", newAccount.role);
    formData.append("gender", newAccount.gender);
    formData.append("photo", newAccount.photo || "");
    formData.append("phone", newAccount.phone);
    if (newAccount.role === "Manager") formData.append("passcode", newAccount.passcode);

    try {
      setSaving(true);
      const res = await fetch("http://38.60.244.74:3000/admin", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage("✅ Account registered successfully!");
        setNewAccount({
          role: "Seller",
          name: "",
          password: "",
          email: "",
          phone: "",
          gender: "Female",
          photo: null,
          passcode: "",
        });
        setErrors({});
      } else {
        alert(`❌ Failed: ${data.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Handle passcode verification and save
  const handlePasscodeConfirm = async () => {
    if (!passcode.trim()) return alert("Enter passcode!");

    try {
      const res = await fetch(
        "http://38.60.244.74:3000/admin/verify-owner-passcode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: passcode.trim() }),
        }
      );
      const data = await res.json();

      if (!data.success) return alert("Incorrect passcode!");

      // Passcode correct → now save account
      await handleRegister();
      setShowPasscodeModal(false);
    } catch (err) {
      console.error(err);
      alert("Passcode verification failed!");
    }
  };

  return (
    <div>
      <h3 className="font-bold text-2xl mb-6 text-amber-400">
        Register New Account
      </h3>

      {/* Photo Upload */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            newAccount.photo
              ? URL.createObjectURL(newAccount.photo)
              : "/default-avatar.png"
          }
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border border-neutral-700"
        />
        <label className="cursor-pointer text-sm text-amber-400 hover:text-amber-300 transition">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleNewChange("photo", file);
            }}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Role */}
        <div>
          <label className="block text-sm mb-2 text-neutral-400">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            value={newAccount.role}
            onChange={(e) => handleNewChange("role", e.target.value)}
            className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-sm text-neutral-200 focus:outline-none ${
              errors.role
                ? "border-red-500"
                : "border-neutral-700 focus:border-amber-400"
            }`}
          >
            <option value="Seller">Seller</option>
            <option value="Manager">Manager</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm mb-2 text-neutral-400">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={newAccount.name}
            onChange={(e) => handleNewChange("name", e.target.value)}
            className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-sm focus:outline-none ${
              errors.name
                ? "border-red-500"
                : "border-neutral-700 focus:border-amber-400"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-2 text-neutral-400">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={newAccount.email}
            onChange={(e) => handleNewChange("email", e.target.value)}
            className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-sm focus:outline-none ${
              errors.email
                ? "border-red-500"
                : "border-neutral-700 focus:border-amber-400"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-2 text-neutral-400">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={newAccount.password}
            onChange={(e) => handleNewChange("password", e.target.value)}
            className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-sm focus:outline-none ${
              errors.password
                ? "border-red-500"
                : "border-neutral-700 focus:border-amber-400"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm mb-2 text-neutral-400">
            Phone Number
          </label>
          <input
            type="text"
            value={newAccount.phone}
            onChange={(e) => handleNewChange("phone", e.target.value)}
            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm mb-2 text-neutral-400">Gender</label>
          <div className="flex gap-4">
            {["Female", "Male", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={newAccount.gender === g}
                  onChange={() => handleNewChange("gender", g)}
                  className="text-amber-400 focus:ring-amber-400"
                />
                <span className="text-neutral-300 text-sm">{g}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Passcode for Manager */}
        {newAccount.role === "Manager" && (
          <div>
            <label className="block text-sm mb-2 text-neutral-400">Passcode</label>
            <input
              type="password"
              value={newAccount.passcode}
              onChange={(e) => handleNewChange("passcode", e.target.value)}
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="col-span-2 flex flex-col gap-2 pt-4">
          <button
            onClick={() => setShowPasscodeModal(true)} // open passcode modal first
            disabled={saving}
            className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {successMessage && (
            <p className="text-green-500 text-sm mt-1">{successMessage}</p>
          )}
        </div>
      </div>

      {/* Passcode Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={() => setShowPasscodeModal(false)}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              Enter Owner Passcode
            </h3>

            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowPasscodeModal(false)}
                className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePasscodeConfirm}
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

