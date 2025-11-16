// import React, { useState } from "react";
// import { Lock, Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function SignIn() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

// const handleLogin = async (e) => {
//   e.preventDefault();
//   if (!email || !password) return alert("Please fill all fields");

//   try {
//     const res = await fetch("http://38.60.244.74:3000/login-admin", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       // save to localStorage
//       localStorage.setItem("adminRole", data.role);
//       localStorage.setItem("adminId", data.id);

//       alert(data.message || "Login successful!");

//       // redirect based on role
//       if (data.role === "owner") navigate("/");
//       else if (data.role === "manager") navigate("/sale");
//       else if (data.role === "seller") navigate("/sale");
//     } else {
//       // login failed, remove any stale data
//       localStorage.removeItem("adminRole");
//       localStorage.removeItem("adminId");

//       alert(data.message || "❌ Login failed");
//     }
//   } catch (err) {
//     console.error(err);

//     // clear login-related data on error
//     localStorage.removeItem("adminRole");
//     localStorage.removeItem("adminId");

//     alert("❌ Something went wrong");
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
//       <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-sm shadow-xl">
//         <h2 className="text-2xl font-semibold text-center mb-6 text-yellow-400">
//           Admin Sign In
//         </h2>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="text-sm text-neutral-400 mb-1 block">
//               Email Address
//             </label>
//             <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
//               <Mail className="h-4 w-4 text-neutral-400" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="bg-transparent flex-1 outline-none text-sm"
//                 placeholder="Enter account email"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm text-neutral-400 mb-1 block">
//               Password
//             </label>
//             <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
//               <Lock className="h-4 w-4 text-neutral-400" />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="bg-transparent flex-1 outline-none text-sm"
//                 placeholder="Enter password"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-medium py-2 rounded-lg transition"
//           >
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Lock, Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import bgImage from "../assets/images/other_photo/gold4.jpg"; // <- your local image path

// export default function SignIn() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!email || !password) return alert("Please fill all fields");

//     try {
//       const res = await fetch("http://38.60.244.74:3000/login-admin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("adminRole", data.role);
//         localStorage.setItem("adminId", data.id);
//         alert(data.message || "Login successful!");
//         if (data.role === "owner") navigate("/");
//         else if (data.role === "manager") navigate("/sale");
//         else if (data.role === "seller") navigate("/sale");
//       } else {
//         localStorage.removeItem("adminRole");
//         localStorage.removeItem("adminId");
//         alert(data.message || "❌ Login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       localStorage.removeItem("adminRole");
//       localStorage.removeItem("adminId");
//       alert("❌ Something went wrong");
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center text-white bg-cover bg-center"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div className="bg-neutral-900/90 border border-neutral-700 rounded-2xl p-8 w-full max-w-sm shadow-xl backdrop-blur-sm">
//         <h2 className="text-2xl font-semibold text-center mb-6 text-yellow-400">
//           Admin Sign In
//         </h2>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="text-sm text-neutral-300 mb-1 block">
//               Email Address
//             </label>
//             <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500 transition">
//               <Mail className="h-5 w-5 text-neutral-400" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="bg-transparent flex-1 outline-none text-sm placeholder:text-neutral-500"
//                 placeholder="Enter account email"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm text-neutral-300 mb-1 block">
//               Password
//             </label>
//             <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500 transition">
//               <Lock className="h-5 w-5 text-neutral-400" />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="bg-transparent flex-1 outline-none text-sm placeholder:text-neutral-500"
//                 placeholder="Enter password"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-medium py-2 rounded-lg transition"
//           >
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/other_photo/gold4.jpg"; // <- your local image path

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Refs for inputs and button
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const submitRef = useRef(null);

  // Auto-focus email input on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");

    try {
      const res = await fetch("http://38.60.244.74:3000/login-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminRole", data.role);
        localStorage.setItem("adminId", data.id);
        alert(data.message || "Login successful!");
        if (data.role === "owner") navigate("/");
        else if (data.role === "manager") navigate("/sale");
        else if (data.role === "seller") navigate("/sale");
      } else {
        localStorage.removeItem("adminRole");
        localStorage.removeItem("adminId");
        alert(data.message || "❌ Login failed");
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem("adminRole");
      localStorage.removeItem("adminId");
      alert("❌ Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-neutral-900/90 border border-neutral-700 rounded-2xl p-8 w-full max-w-sm shadow-xl backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-yellow-400">
          Admin Sign In
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-300 mb-1 block">
              Email Address
            </label>
            <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500 transition">
              <Mail className="h-5 w-5 text-neutral-400" />
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 outline-none text-sm placeholder:text-neutral-500"
                placeholder="Enter account email"
                onKeyDown={(e) => {
                  if (e.key === "Enter") passwordRef.current?.focus();
                }}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-300 mb-1 block">
              Password
            </label>
            <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500 transition">
              <Lock className="h-5 w-5 text-neutral-400" />
              <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent flex-1 outline-none text-sm placeholder:text-neutral-500"
                placeholder="Enter password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRef.current?.click();
                }}
              />
            </div>
          </div>

          <button
            ref={submitRef}
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-medium py-2 rounded-lg transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
