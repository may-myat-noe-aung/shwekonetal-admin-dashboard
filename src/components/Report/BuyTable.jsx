// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Search,
//   Download,
//   ChevronUp,
//   ChevronDown,
//   Info,
// } from "lucide-react";

// const API_BASE = "http://38.60.244.74:3000";

// export default function BuyTable() {
//   const [buyData, setBuyData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });
//   const [page, setPage] = useState(1);
//   const [selectedTxn, setSelectedTxn] = useState(null);
//   const [previewImg, setPreviewImg] = useState(null);

//   const itemsPerPage = 6;

//   // ✅ Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/buyTable`);
//         const data = await res.json();
//         if (data.success) {
//           // Convert created_at to Date object for sorting & display
//           const formatted = data.data.map((item) => ({
//             ...item,
//             date: new Date(item.created_at),
//           }));
//           setBuyData(formatted);
//         }
//       } catch (err) {
//         console.error("Error fetching buyTable:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // ✅ Sorting
//   const requestSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const sortedData = useMemo(() => {
//     const sorted = [...buyData];
//     sorted.sort((a, b) => {
//       const aVal = a[sortConfig.key];
//       const bVal = b[sortConfig.key];
//       if (typeof aVal === "string") return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
//       if (aVal instanceof Date) return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
//       return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
//     });
//     return sorted;
//   }, [buyData, sortConfig]);

//   // ✅ Search
//   const filteredData = sortedData.filter((item) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       item.userid?.toLowerCase().includes(term) ||
//       item.method?.toLowerCase().includes(term) ||
//       item.gold?.includes(term) ||
//       item.status?.toLowerCase().includes(term)
//     );
//   });

//   // ✅ Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const paginatedSales = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

//   // ✅ Export CSV
//   const exportCSV = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       ["UserID,Gold,Price,Method,Status,Date,Time"]
//         .concat(
//           buyData.map(
//             (d) =>
//               `${d.userid},${d.gold},${d.price},${d.method},${d.status},${d.date.toLocaleDateString()},${d.date.toLocaleTimeString()}`
//           )
//         )
//         .join("\n");
//     const a = document.createElement("a");
//     a.href = encodeURI(csvContent);
//     a.download = "buyTable.csv";
//     a.click();
//   };

//   return (
//     <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-xl font-semibold text-yellow-400">Buy Transactions</h3>

//         <div className="flex gap-2">
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
//             <input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="All Search..."
//               className="w-64 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               type="text"
//             />
//           </div>

//           <button
//             onClick={exportCSV}
//             className="flex rounded-2xl items-center gap-1 text-xs px-2 py-1 border border-neutral-700  text-neutral-300 hover:text-white"
//           >
//             <Download size={14} /> Export
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <table className="min-w-full text-sm">
//         <thead>
//           <tr className="border-b border-neutral-800 text-neutral-500">
//             {[
//               { label: "User ID", key: "userid" },
//               { label: "Gold", key: "gold" },
//               { label: "Price", key: "price" },
//               { label: "Date", key: "date" },
//               { label: "Time", key: "time" },
//               { label: "Method", key: "method" },
//               { label: "Status", key: "status" },
//               { label: "Details", key: "details" },
//             ].map((col) => (
//               <th
//                 key={col.key}
//                 className="py-2 px-3 cursor-pointer select-none text-center"
//                 onClick={() => col.key !== "details" && requestSort(col.key)}
//               >
//                 <div className="flex items-center justify-center gap-1">
//                   {col.label}
//                   {col.key !== "details" && (
//                     sortConfig.key === col.key ? (
//                       sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                     ) : (
//                       <ChevronUp size={14} className="opacity-30 rotate-180" />
//                     )
//                   )}
//                 </div>
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="8" className="text-center py-10 text-yellow-400">
//                 Loading...
//               </td>
//             </tr>
//           ) : paginatedSales.length === 0 ? (
//             <tr>
//               <td colSpan="8" className="text-center py-10 text-neutral-500">
//                 No transactions found.
//               </td>
//             </tr>
//           ) : (
//             paginatedSales.map((s) => (
//               <tr
//                 key={s.id}
//                 className="border-b border-neutral-800 hover:bg-neutral-800/50"
//               >
//                 <td className="py-2 px-3 text-center">{s.userid}</td>
//                 <td className="py-2 px-3 text-center">{s.gold}</td>
//                 <td className="py-2 px-3 text-center">{s.price.toLocaleString()} ကျပ်</td>
//                 <td className="py-2 px-3 text-center">{s.date.toLocaleDateString()}</td>
//                 <td className="py-2 px-3 text-center">{s.date.toLocaleTimeString()}</td>
//                 <td className="py-2 px-3 text-center">{s.method}</td>
//                 <td
//                   className={`py-2 px-3 text-center font-semibold ${
//                     s.status === "approved"
//                       ? "text-green-400"
//                       : s.status === "pending"
//                       ? "text-yellow-400"
//                       : "text-red-400"
//                   }`}
//                 >
//                   {s.status}
//                 </td>
//                 <td className="py-2 px-3 text-center">
//                   <button
//                     onClick={() => setSelectedTxn(s)}
//                     className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-500 text-white hover:bg-yellow-400 transition-all duration-200"
//                   >
//                     <Info size={14} /> Details
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="flex justify-between px-4 pt-4 text-sm text-neutral-400">
//         <p>
//           Page {totalPages === 0 ? 0 : page} of {totalPages}
//         </p>
//         <div className="flex gap-2">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             className={`px-3 py-1 rounded-md border border-neutral-700 ${
//               page === 1
//                 ? "text-neutral-500 cursor-not-allowed"
//                 : "text-yellow-400 hover:bg-neutral-900"
//             }`}
//           >
//             Prev
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//             <button
//               key={n}
//               onClick={() => setPage(n)}
//               className={`px-3 py-1 rounded-md border border-neutral-700 ${
//                 page === n
//                   ? "bg-yellow-500 text-black font-semibold"
//                   : "text-yellow-400 hover:bg-neutral-900"
//               }`}
//             >
//               {n}
//             </button>
//           ))}

//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             className={`px-3 py-1 rounded-md border border-neutral-700 ${
//               page === totalPages
//                 ? "text-neutral-500 cursor-not-allowed"
//                 : "text-yellow-400 hover:bg-neutral-900"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* --- Details Popup --- */}
//       {selectedTxn && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-lg relative">
//             <button
//               onClick={() => setSelectedTxn(null)}
//               className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-200"
//             >
//               ✕
//             </button>

//             <h2 className="text-lg font-semibold mb-4 text-yellow-400">
//               {selectedTxn.id}
//             </h2>

//             <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
//               <p><span className="text-neutral-400">User ID -</span> {selectedTxn.userid}</p>
//               <p><span className="text-neutral-400">Gold -</span> {selectedTxn.gold}</p>
//               <p><span className="text-neutral-400">Price -</span> {selectedTxn.price.toLocaleString()} ကျပ်</p>
//               <p><span className="text-neutral-400">Method -</span> {selectedTxn.method}</p>
//               <p><span className="text-neutral-400">Status -</span> {selectedTxn.status}</p>
//               <p><span className="text-neutral-400">Date -</span> {selectedTxn.date.toLocaleString()}</p>
//             </div>

//             <div className="flex gap-2 overflow-x-auto">
//               {selectedTxn.photos?.map((file, idx) => (
//                 <img
//                   key={idx}
//                   src={`${API_BASE}/uploads/${file}`}
//                   alt="Proof"
//                   onClick={() =>
//                     setPreviewImg(`${API_BASE}/uploads/${file}`)
//                   }
//                   className="w-28 h-40 object-cover border border-neutral-700 rounded-lg cursor-pointer hover:scale-105 transition"
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Photo Preview */}
//       {previewImg && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="relative">
//             <button
//               onClick={() => setPreviewImg(null)}
//               className="absolute -top-8 right-0 text-white text-xl"
//             >
//               ✕
//             </button>
//             <img
//               src={previewImg}
//               alt="Preview"
//               className="max-h-[80vh] max-w-[90vw] rounded-lg"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react";

const API_BASE = "http://38.60.244.74:3000";

export default function BuyTable() {
  const [buyData, setBuyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });
  const [page, setPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const itemsPerPage = 6;

  // ✅ Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/buyTable`);
        const data = await res.json();
        if (data.success) {
          // Convert created_at to Date object for sorting & display
          const formatted = data.data.map((item) => ({
            ...item,
            date: new Date(item.created_at),
          }));
          setBuyData(formatted);
        }
      } catch (err) {
        console.error("Error fetching buyTable:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sorted = [...buyData];
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === "string") return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      if (aVal instanceof Date) return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [buyData, sortConfig]);

  // ✅ Search
  const filteredData = sortedData.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.userid?.toLowerCase().includes(term) ||
      item.method?.toLowerCase().includes(term) ||
      item.type?.toLowerCase().includes(term) || // ✅ added type
      item.gold?.includes(term) ||
      item.status?.toLowerCase().includes(term)
    );
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedSales = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // ✅ Export CSV
  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["UserID,Gold,Type,Price,Method,Status,Date,Time"] // ✅ added Type
        .concat(
          buyData.map(
            (d) =>
              `${d.userid},${d.gold},${d.type},${d.price},${d.method},${d.status},${d.date.toLocaleDateString()},${d.date.toLocaleTimeString()}`
          )
        )
        .join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csvContent);
    a.download = "buyTable.csv";
    a.click();
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-yellow-400">Buy Transactions</h3>

        <div className="flex gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="All Search..."
              className="w-64 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              type="text"
            />
          </div>

          <button
            onClick={exportCSV}
            className="flex rounded-2xl items-center gap-1 text-xs px-2 py-1 border border-neutral-700  text-neutral-300 hover:text-white"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-neutral-500">
            {[
              { label: "User ID", key: "userid" },
              { label: "Type", key: "type" }, // ✅ added Type column
              { label: "ကျပ် ပဲ ရွေး", key: "gold" },
              { label: "Price", key: "price" },
              { label: "Date", key: "date" },
              { label: "Time", key: "time" },
              { label: "Method", key: "method" },
              { label: "Status", key: "status" },
              { label: "Details", key: "details" },
            ].map((col) => (
              <th
                key={col.key}
                className="py-2 px-3 cursor-pointer select-none text-center"
                onClick={() => col.key !== "details" && requestSort(col.key)}
              >
                <div className="flex items-center justify-center gap-1">
                  {col.label}
                  {col.key !== "details" && (
                    sortConfig.key === col.key ? (
                      sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : (
                      <ChevronUp size={14} className="opacity-30 rotate-180" />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center py-10 text-yellow-400">
                Loading...
              </td>
            </tr>
          ) : paginatedSales.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-10 text-neutral-500">
                No transactions found.
              </td>
            </tr>
          ) : (
            paginatedSales.map((s) => (
              <tr
                key={s.id}
                className="border-b border-neutral-800 hover:bg-neutral-800/50"
              >
                <td className="py-2 px-3 text-center">{s.userid}</td>
                <td className="py-2 px-3 text-center text-emerald-400">{s.type}</td> {/* ✅ added */}
                <td className="py-2 px-3 text-center">{s.gold}</td>
                <td className="py-2 px-3 text-center">{s.price.toLocaleString()} ကျပ်</td>
                <td className="py-2 px-3 text-center">{s.date.toLocaleDateString()}</td>
                <td className="py-2 px-3 text-center">{s.date.toLocaleTimeString()}</td>
                <td className="py-2 px-3 text-center">{s.method}</td>
                <td
                  className={`py-2 px-3 text-center font-semibold ${
                    s.status === "approved"
                      ? "text-green-400"
                      : s.status === "pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {s.status}
                </td>
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() => setSelectedTxn(s)}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-500 text-white hover:bg-yellow-400 transition-all duration-200"
                  >
                    <Info size={14} /> Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between px-4 pt-4 text-sm text-neutral-400">
        <p>
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1 rounded-md border border-neutral-700 ${
              page === 1
                ? "text-neutral-500 cursor-not-allowed"
                : "text-yellow-400 hover:bg-neutral-900"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded-md border border-neutral-700 ${
                page === n
                  ? "bg-yellow-500 text-black font-semibold"
                  : "text-yellow-400 hover:bg-neutral-900"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`px-3 py-1 rounded-md border border-neutral-700 ${
              page === totalPages
                ? "text-neutral-500 cursor-not-allowed"
                : "text-yellow-400 hover:bg-neutral-900"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* --- Details Popup --- */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setSelectedTxn(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-200"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-yellow-400">
              {selectedTxn.id}
            </h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
              <p><span className="text-neutral-400">User ID -</span> {selectedTxn.userid}</p>
              <p><span className="text-neutral-400">Gold -</span> {selectedTxn.gold}</p>
              <p><span className="text-neutral-400">Type -</span> {selectedTxn.type}</p> {/* ✅ added */}
              <p><span className="text-neutral-400">Price -</span> {selectedTxn.price.toLocaleString()} ကျပ်</p>
              <p><span className="text-neutral-400">Method -</span> {selectedTxn.method}</p>
              <p><span className="text-neutral-400">Status -</span> {selectedTxn.status}</p>
              <p><span className="text-neutral-400">Date -</span> {selectedTxn.date.toLocaleString()}</p>
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {selectedTxn.photos?.map((file, idx) => (
                <img
                  key={idx}
                  src={`${API_BASE}/uploads/${file}`}
                  alt="Proof"
                  onClick={() =>
                    setPreviewImg(`${API_BASE}/uploads/${file}`)
                  }
                  className="w-28 h-40 object-cover border border-neutral-700 rounded-lg cursor-pointer hover:scale-105 transition"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute -top-8 right-0 text-white text-xl"
            >
              ✕
            </button>
            <img
              src={previewImg}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
