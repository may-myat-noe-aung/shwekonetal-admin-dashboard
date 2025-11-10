// // import React, { useEffect, useState } from "react";

// // export default function ManagerSellerList() {
// //   const [accounts, setAccounts] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     const fetchAccounts = async () => {
// //       setLoading(true);
// //       try {
// //         const res = await fetch("http://38.60.244.74:3000/admin");
// //         const data = await res.json();
// //         if (data.success) {
// //           // Only show managers & sellers
// //           const filtered = data.data.filter((a) => a.role !== "owner");
// //           setAccounts(filtered);
// //         }
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchAccounts();
// //   }, []);

// // const handleDelete = async (id) => {
// //   if (!window.confirm("Are you sure you want to delete this account?")) return;

// //   try {
// //     // Call your DELETE API
// //     const res = await fetch(`http://38.60.244.74:3000/admin/${id}`, {
// //       method: "DELETE",
// //     });
// //     const data = await res.json();

// //     if (data.success) {
// //       // Remove account from state so table updates
// //       setAccounts((prev) => prev.filter((a) => a.id !== id));
// //       alert("Account deleted successfully ✅");
// //     } else {
// //       alert("Failed to delete account ❌");
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     alert("Error deleting account ❌");
// //   }
// // };


// //   if (loading) return <p className="text-neutral-400">Loading...</p>;

// //   return (
// //     <div className="overflow-x-auto">
// //       <table className="min-w-full text-sm table-auto">
// //         <thead>
// //           <tr className="border-b border-neutral-800 text-neutral-500 text-center">
// //             <th className="py-2 px-3">Photo</th>
// //             <th className="py-2 px-3">Name</th>
// //             <th className="py-2 px-3">Email</th>
// //             <th className="py-2 px-3">Role</th>
// //             <th className="py-2 px-3">Phone</th>
// //             <th className="py-2 px-3">Gender</th>
// //             <th className="py-2 px-3">Action</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {accounts.map((a) => (
// //             <tr
// //               key={a.id}
// //               className="border-b border-neutral-800 hover:bg-neutral-800/50 text-center"
// //             >
// //               <td className="py-2 px-3">
// //                 {a.photo ? (
// //                   <img
// //                     src={`http://38.60.244.74:3000/uploads/${a.photo}`}
// //                     alt={a.name}
// //                     className="w-10 h-10 rounded-full object-cover mx-auto"
// //                   />
// //                 ) : (
// //                   <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-semibold flex items-center justify-center mx-auto">
// //                     {a.name
// //                       ? a.name
// //                           .split(" ")
// //                           .map((n) => n[0])
// //                           .slice(0, 2)
// //                           .join("")
// //                           .toUpperCase()
// //                       : "NA"}
// //                   </div>
// //                 )}
// //               </td>
// //               <td className="py-2 px-3">{a.name}</td>
// //               <td className="py-2 px-3">{a.email}</td>
// //               <td className="py-2 px-3">{a.role}</td>
// //               <td className="py-2 px-3">{a.phone || "-"}</td>
// //               <td className="py-2 px-3">{a.gender || "-"}</td>
// //               <td className="py-2 px-3">
// //                 <button
// //                   onClick={() => handleDelete(a.id)}
// //                   className="text-red-400 hover:text-red-600 font-medium"
// //                 >
// //                   Delete
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { ArrowUp, ArrowDown } from "lucide-react";

// export default function ManagerSellerList() {
//   const [accounts, setAccounts] = useState([]);
//   const [filteredAccounts, setFilteredAccounts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("http://38.60.244.74:3000/admin");
//         const data = await res.json();
//         if (data.success) {
//           const filtered = data.data.filter((a) => a.role !== "owner");
//           setAccounts(filtered);
//           setFilteredAccounts(filtered);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAccounts();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this account?")) return;

//     try {
//       const res = await fetch(`http://38.60.244.74:3000/admin/${id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (data.success) {
//         setAccounts((prev) => prev.filter((a) => a.id !== id));
//         setFilteredAccounts((prev) => prev.filter((a) => a.id !== id));
//         alert("Account deleted successfully ✅");
//       } else {
//         alert("Failed to delete account ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting account ❌");
//     }
//   };

//   // Search
//   useEffect(() => {
//     const filtered = accounts.filter(
//       (a) =>
//         a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         a.role.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredAccounts(filtered);
//   }, [searchQuery, accounts]);

//   // Sort
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });

//     const sorted = [...filteredAccounts].sort((a, b) => {
//       const valA = a[key] ? a[key].toString().toLowerCase() : "";
//       const valB = b[key] ? b[key].toString().toLowerCase() : "";
//       if (valA < valB) return direction === "asc" ? -1 : 1;
//       if (valA > valB) return direction === "asc" ? 1 : -1;
//       return 0;
//     });
//     setFilteredAccounts(sorted);
//   };

//   // Export CSV
//   const handleExport = () => {
//     const headers = ["Name", "Email", "Role", "Phone", "Gender"];
//     const rows = filteredAccounts.map((a) => [a.name, a.email, a.role, a.phone || "-", a.gender || "-"]);
//     let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "accounts.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) return <p className="text-neutral-400">Loading...</p>;

//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <input
//           type="text"
//           placeholder="Search by name, email, role..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-1/3 px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-200 focus:outline-none focus:border-amber-400 text-sm"
//         />
//         <button
//           onClick={handleExport}
//           className="px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-500 text-sm"
//         >
//           Export CSV
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm table-auto">
//           <thead>
//             <tr className="border-b border-neutral-800 text-neutral-500 text-center">
//               {["Photo", "Name", "Email", "Role", "Phone", "Gender", "Action"].map((header, idx) => (
//                 <th
//                   key={header}
//                   className="py-2 px-3 cursor-pointer select-none"
//                   onClick={() => idx !== 0 && idx !== 6 && handleSort(header.toLowerCase())}
//                 >
//                   <div className="flex items-center justify-center gap-1">
//                     {header}
//                     {sortConfig.key === header.toLowerCase() && (
//                       sortConfig.direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//                     )}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAccounts.map((a) => (
//               <tr
//                 key={a.id}
//                 className="border-b border-neutral-800 hover:bg-neutral-800/50 text-center"
//               >
//                 <td className="py-2 px-3">
//                   {a.photo ? (
//                     <img
//                       src={`http://38.60.244.74:3000/uploads/${a.photo}`}
//                       alt={a.name}
//                       className="w-10 h-10 rounded-full object-cover mx-auto"
//                     />
//                   ) : (
//                     <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-semibold flex items-center justify-center mx-auto">
//                       {a.name
//                         ? a.name
//                             .split(" ")
//                             .map((n) => n[0])
//                             .slice(0, 2)
//                             .join("")
//                             .toUpperCase()
//                         : "NA"}
//                     </div>
//                   )}
//                 </td>
//                 <td className="py-2 px-3">{a.name}</td>
//                 <td className="py-2 px-3">{a.email}</td>
//                 <td className="py-2 px-3">{a.role}</td>
//                 <td className="py-2 px-3">{a.phone || "-"}</td>
//                 <td className="py-2 px-3">{a.gender || "-"}</td>
//                 <td className="py-2 px-3">
//                   <button
//                     onClick={() => handleDelete(a.id)}
//                     className="text-red-400 hover:text-red-600 font-medium"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { Search, Download, ChevronUp, ChevronDown } from "lucide-react";

export default function ManagerSellerList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://38.60.244.74:3000/admin");
        const data = await res.json();
        if (data.success) {
          const filtered = data.data.filter((a) => a.role !== "owner");
          setAccounts(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  // --- Filtered accounts based on search ---
  const filteredAccounts = useMemo(() => {
    return accounts.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.gender || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  // --- Sorted accounts ---
  const sortedAccounts = useMemo(() => {
    const sortable = [...filteredAccounts];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const valA = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : "";
        const valB = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : "";
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredAccounts, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      const res = await fetch(`http://38.60.244.74:3000/admin/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAccounts((prev) => prev.filter((a) => a.id !== id));
        alert("Account deleted successfully ✅");
      } else {
        alert("Failed to delete account ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting account ❌");
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Role", "Phone", "Gender"];
    const rows = sortedAccounts.map((a) => [a.name, a.email, a.role, a.phone || "-", a.gender || "-"]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "accounts.csv";
    link.click();
  };

  if (loading) return <p className="text-neutral-400">Loading...</p>;

  return (
    <div className="">
      {/* Header: Search + Export */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h3 className="text-xl font-semibold text-yellow-400">Manager & Seller Accounts</h3>
        <div className="flex flex-col md:flex-row gap-2 md:gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, role..."
              className="w-full md:w-64 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              type="text"
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex rounded-2xl items-center gap-1 text-xs px-2 py-1 border border-neutral-700 text-neutral-300 hover:text-white"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500 text-center">
              {[
                { label: "Photo", key: "photo" },
                { label: "Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Role", key: "role" },
                { label: "Phone", key: "phone" },
                { label: "Gender", key: "gender" },
                { label: "Action", key: "action" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="py-2 px-3 cursor-pointer select-none"
                  onClick={() => col.key !== "photo" && col.key !== "action" && handleSort(col.key)}
                >
                  <div className="flex items-center justify-center gap-1">
                    {col.label}
                    {sortConfig.key === col.key && (
                      sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-neutral-500">
                  No accounts found.
                </td>
              </tr>
            ) : (
              sortedAccounts.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/50 text-center"
                >
                  <td className="py-2 px-3">
                    {a.photo ? (
                      <img
                        src={`http://38.60.244.74:3000/uploads/${a.photo}`}
                        alt={a.name}
                        className="w-10 h-10 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-semibold flex items-center justify-center mx-auto">
                        {a.name
                          ? a.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()
                          : "NA"}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3">{a.name}</td>
                  <td className="py-2 px-3">{a.email}</td>
                  <td className="py-2 px-3">{a.role}</td>
                  <td className="py-2 px-3">{a.phone || "-"}</td>
                  <td className="py-2 px-3">{a.gender || "-"}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-400 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
