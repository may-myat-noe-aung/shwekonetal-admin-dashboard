// import React, { useEffect, useState, useMemo } from "react";
// import { Search, Download, ChevronUp, ChevronDown, X } from "lucide-react";

// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// export default function ManagerSellerList() {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "name",
//     direction: "asc",
//   });

//   // --- Pagination state ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 6;

//   // --- Delete passcode modal state ---
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deletePasscode, setDeletePasscode] = useState("");
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("http://38.60.244.74:3000/admin");
//         const data = await res.json();
//         if (data.success) {
//           const filtered = data.data.filter((a) => a.role !== "owner");
//           setAccounts(filtered);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAccounts();
//   }, []);

//   // --- Filtered accounts based on search ---
//   const filteredAccounts = useMemo(() => {
//     const term = searchTerm.toLowerCase();

//     return accounts.filter((a) => {
//       const matchesText =
//         a.name.toLowerCase().includes(term) ||
//         a.email.toLowerCase().includes(term) ||
//         a.role.toLowerCase().includes(term) ||
//         (a.phone || "").toLowerCase().includes(term);

//       const matchesGender =
//         !term || (a.gender && a.gender.toLowerCase() === term);

//       return matchesText || matchesGender;
//     });
//   }, [accounts, searchTerm]);

//   // --- Sorted accounts ---
//   const sortedAccounts = useMemo(() => {
//     const sortable = [...filteredAccounts];
//     if (sortConfig.key) {
//       sortable.sort((a, b) => {
//         const valA = a[sortConfig.key]
//           ? a[sortConfig.key].toString().toLowerCase()
//           : "";
//         const valB = b[sortConfig.key]
//           ? b[sortConfig.key].toString().toLowerCase()
//           : "";
//         if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
//         if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortable;
//   }, [filteredAccounts, sortConfig]);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc")
//       direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   // --- Open delete modal ---
//   const handleDeleteClick = (account) => {
//     setDeleteTarget(account);
//     setDeletePasscode("");
//     setShowDeleteModal(true);
//   };

//   const handleExport = () => {
//     const term = searchTerm.toLowerCase();

//     // Safe filtered export
//     const exportData = sortedAccounts.filter((a) => {
//       const genderMatch =
//         !term || (a.gender && a.gender.toLowerCase() === term);

//       const textMatch =
//         a.name.toLowerCase().includes(term) ||
//         a.email.toLowerCase().includes(term) ||
//         a.role.toLowerCase().includes(term) ||
//         (a.phone || "").toLowerCase().includes(term);

//       return textMatch || genderMatch;
//     });

//     const exportList = exportData.map((a, index) => ({
//       No: index + 1,
//       Name: a.name,
//       Email: a.email,
//       Role: a.role,
//       Phone: a.phone || "-",
//       Gender: a.gender || "-",
//     }));

//     if (exportList.length === 0) {
//       alert("No accounts to export.");
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(exportList);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([excelBuffer], {
//       type: "application/octet-stream",
//     });

//     saveAs(blob, "Manager_Seller_List.xlsx");
//   };

//   // --- Confirm delete with passcode ---
//   const confirmDelete = async () => {
//     if (!deletePasscode) {
//       alert("Please enter passcode");
//       return;
//     }

//     try {
//       setDeleting(true);

//       // Verify owner passcode
//       const verify = await fetch(
//         "http://38.60.244.74:3000/admin/verify-owner-passcode",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ passcode: deletePasscode }),
//         }
//       );
//       const verifyData = await verify.json();
//       if (!verifyData.success) {
//         alert(verifyData.message);
//         return;
//       }

//       // Proceed to delete account
//       const res = await fetch(
//         `http://38.60.244.74:3000/admin/${deleteTarget.id}`,
//         {
//           method: "DELETE",
//         }
//       );
//       const data = await res.json();
//       if (data.success) {
//         setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget.id));
//         alert(data.message);
//         setShowDeleteModal(false);
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting account ");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // --- Paginated accounts ---
//   const paginatedAccounts = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     const end = start + rowsPerPage;
//     return sortedAccounts.slice(start, end);
//   }, [sortedAccounts, currentPage]);

//   const totalPages = Math.ceil(sortedAccounts.length / rowsPerPage);

//   if (loading) return <p className="text-neutral-400">Loading...</p>;

//   return (
//     <div className="">
//       {/* Header: Search + Export */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
//         <h3 className="text-xl font-semibold text-yellow-400">
//           Manager & Seller Accounts
//         </h3>
//         <div className="flex flex-col md:flex-row gap-2 md:gap-2">
//           <div className="relative w-full md:w-64">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
//             <input
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1); // Reset page when searching
//               }}
//               placeholder="All Search"
//               className="w-full md:w-64 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               type="text"
//             />
//           </div>
//           <button
//             onClick={handleExport}
//             className="flex rounded-2xl items-center gap-1 text-xs px-2 py-1 border border-neutral-700 text-neutral-300 hover:text-white"
//           >
//             <Download size={14} /> Export
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm table-auto">
//           <thead>
//             <tr className="border-b border-neutral-800 text-neutral-500 text-center">
//               {[
//                 { label: "Photo", key: "photo" },
//                 { label: "Name", key: "name" },
//                 { label: "Email", key: "email" },
//                 { label: "Role", key: "role" },
//                 { label: "Phone", key: "phone" },
//                 { label: "Gender", key: "gender" },
//                 { label: "Action", key: "action" },
//               ].map((col) => (
//                 <th
//                   key={col.key}
//                   className="py-2 px-3 cursor-pointer select-none"
//                   onClick={() =>
//                     col.key !== "photo" &&
//                     col.key !== "action" &&
//                     handleSort(col.key)
//                   }
//                 >
//                   <div className="flex items-center justify-center gap-1">
//                     {col.label}
//                     {sortConfig.key === col.key &&
//                       (sortConfig.direction === "asc" ? (
//                         <ChevronUp size={14} />
//                       ) : (
//                         <ChevronDown size={14} />
//                       ))}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedAccounts.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-10 text-neutral-500">
//                   No accounts found.
//                 </td>
//               </tr>
//             ) : (
//               paginatedAccounts.map((a) => (
//                 <tr
//                   key={a.id}
//                   className="border-b border-neutral-800 hover:bg-neutral-800/50 text-center"
//                 >
//                   <td className="py-2 px-3">
//                     {a.photo ? (
//                       <img
//                         src={`http://38.60.244.74:3000/uploads/${a.photo}`}
//                         alt={a.name}
//                         className="w-10 h-10 rounded-full object-cover mx-auto"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-semibold flex items-center justify-center mx-auto">
//                         {a.name
//                           ? a.name
//                               .split(" ")
//                               .map((n) => n[0])
//                               .slice(0, 2)
//                               .join("")
//                               .toUpperCase()
//                           : "NA"}
//                       </div>
//                     )}
//                   </td>
//                   <td className="py-2 px-3">{a.name}</td>
//                   <td className="py-2 px-3">{a.email}</td>
//                   <td className="py-2 px-3">{a.role}</td>
//                   <td className="py-2 px-3">{a.phone || "-"}</td>
//                   <td className="py-2 px-3">{a.gender || "-"}</td>
//                   <td className="py-2 px-3">
//                     <button
//                       onClick={() => handleDeleteClick(a)}
//                       className="text-red-400 hover:text-red-600 mx-auto"
//                     >
//                       {/* Trash Icon */}
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 mx-auto"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
//                         />
//                       </svg>
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination UI */}
//       {totalPages > 1 && (
//         <div className="flex flex-col md:flex-row justify-between px-4 py-2 text-sm text-neutral-400 gap-2 md:gap-0 mt-4">
//           <p>
//             Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
//           </p>
//           <div className="flex gap-2 flex-wrap">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               className={`px-3 py-1 rounded-md border border-neutral-700 ${
//                 currentPage === 1
//                   ? "text-neutral-500 cursor-not-allowed"
//                   : "text-yellow-400 hover:bg-neutral-900"
//               }`}
//             >
//               Prev
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//               <button
//                 key={n}
//                 onClick={() => setCurrentPage(n)}
//                 className={`px-3 py-1 rounded-md border border-neutral-700 ${
//                   currentPage === n
//                     ? "bg-yellow-500 text-black font-semibold"
//                     : "text-yellow-400 hover:bg-neutral-900"
//                 }`}
//               >
//                 {n}
//               </button>
//             ))}
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               className={`px-3 py-1 rounded-md border border-neutral-700 ${
//                 currentPage === totalPages
//                   ? "text-neutral-500 cursor-not-allowed"
//                   : "text-yellow-400 hover:bg-neutral-900"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* --- Passcode Modal for Delete --- */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
//             <button
//               onClick={() => setShowDeleteModal(false)}
//               className="absolute top-2 right-2 text-neutral-400 hover:text-white"
//             >
//               <X size={18} />
//             </button>
//             <h3 className="text-lg font-semibold mb-4 text-center">
//               Enter Passcode to Delete
//             </h3>
//             <input
//               type="password"
//               value={deletePasscode}
//               onChange={(e) => setDeletePasscode(e.target.value)}
//               placeholder="Enter passcode"
//               className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition"
//               autoFocus
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") confirmDelete();
//               }}
//             />
//             <div className="flex justify-between">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 disabled={deleting}
//                 className="bg-red-500 text-white px-3 py-2 rounded-md text-sm"
//               >
//                 {deleting ? "Deleting..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { Search, Download, ChevronUp, ChevronDown, X } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAlert } from "../../AlertProvider"; //  import showAlert

export default function ManagerSellerList() {
  const { showAlert } = useAlert(); //  use showAlert
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletePasscode, setDeletePasscode] = useState("");
  const [deleting, setDeleting] = useState(false);

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
        showAlert("Server ချိတ်ဆက်မှု မအောင်မြင်ပါ ", "error"); // Burmese fallback
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return accounts.filter((a) => {
      const matchesText =
        a.name.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        a.role.toLowerCase().includes(term) ||
        (a.phone || "").toLowerCase().includes(term);

      const matchesGender = !term || (a.gender && a.gender.toLowerCase() === term);

      return matchesText || matchesGender;
    });
  }, [accounts, searchTerm]);

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

  const handleDeleteClick = (account) => {
    setDeleteTarget(account);
    setDeletePasscode("");
    setShowDeleteModal(true);
  };

  const handleExport = () => {
    const term = searchTerm.toLowerCase();
    const exportData = sortedAccounts.filter((a) => {
      const genderMatch = !term || (a.gender && a.gender.toLowerCase() === term);
      const textMatch =
        a.name.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        a.role.toLowerCase().includes(term) ||
        (a.phone || "").toLowerCase().includes(term);
      return textMatch || genderMatch;
    });

    const exportList = exportData.map((a, index) => ({
      No: index + 1,
      Name: a.name,
      Email: a.email,
      Role: a.role,
      Phone: a.phone || "-",
      Gender: a.gender || "-",
    }));

    if (exportList.length === 0) {
      showAlert("Network error (Server unreachable)", "error"); // Burmese fallback
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Manager_Seller_List.xlsx");
  };

  const confirmDelete = async () => {
    if (!deletePasscode) {
      showAlert("Passcode ဖြည့်ပါ ", "error");
      return;
    }

    try {
      setDeleting(true);
      const verify = await fetch(
        "http://38.60.244.74:3000/admin/verify-owner-passcode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: deletePasscode }),
        }
      );
      const verifyData = await verify.json();

      if (!verifyData.success) {
        showAlert(verifyData.message || "Passcode မမှန်ပါ ", "error");
        return;
      }

      const res = await fetch(`http://38.60.244.74:3000/admin/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        showAlert(data.message || "အကောင့် ဖျက်ပြီးပါပြီ ", "success");
        setShowDeleteModal(false);
      } else {
        showAlert(data.message || "အကောင့် ဖျက်မှု မအောင်မြင်ပါ ", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("အကောင့် ဖျက်မှုတွင် ပြဿနာရှိပါသည် ", "error");
    } finally {
      setDeleting(false);
    }
  };

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedAccounts.slice(start, end);
  }, [sortedAccounts, currentPage]);

  const totalPages = Math.ceil(sortedAccounts.length / rowsPerPage);

  if (loading) return <p className="text-neutral-400">Loading...</p>;

  return (
   <div className="">
      {/* Header: Search + Export */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h3 className="text-xl font-semibold text-yellow-400">
          Manager & Seller Accounts
        </h3>
        <div className="flex flex-col md:flex-row gap-2 md:gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page when searching
              }}
              placeholder="All Search"
              className="w-full md:w-64 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              type="text"
            />
          </div>
          <button
            onClick={handleExport}
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
                  onClick={() =>
                    col.key !== "photo" &&
                    col.key !== "action" &&
                    handleSort(col.key)
                  }
                >
                  <div className="flex items-center justify-center gap-1">
                    {col.label}
                    {sortConfig.key === col.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedAccounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-neutral-500">
                  No accounts found.
                </td>
              </tr>
            ) : (
              paginatedAccounts.map((a) => (
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
                      onClick={() => handleDeleteClick(a)}
                      className="text-red-400 hover:text-red-600 mx-auto"
                    >
                      {/* Trash Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between px-4 py-2 text-sm text-neutral-400 gap-2 md:gap-0 mt-4">
          <p>
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1 rounded-md border border-neutral-700 ${
                currentPage === 1
                  ? "text-neutral-500 cursor-not-allowed"
                  : "text-yellow-400 hover:bg-neutral-900"
              }`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`px-3 py-1 rounded-md border border-neutral-700 ${
                  currentPage === n
                    ? "bg-yellow-500 text-black font-semibold"
                    : "text-yellow-400 hover:bg-neutral-900"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-1 rounded-md border border-neutral-700 ${
                currentPage === totalPages
                  ? "text-neutral-500 cursor-not-allowed"
                  : "text-yellow-400 hover:bg-neutral-900"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* --- Passcode Modal for Delete --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Enter Passcode to Delete
            </h3>
            <input
              type="password"
              value={deletePasscode}
              onChange={(e) => setDeletePasscode(e.target.value)}
              placeholder="Enter passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmDelete();
              }}
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm"
              >
                {deleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

