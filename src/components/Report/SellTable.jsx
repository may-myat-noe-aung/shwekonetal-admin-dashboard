import React, { useState, useEffect, useMemo } from "react";
import { ChevronUp, ChevronDown, Info, Search, Download } from "lucide-react";


import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE = "http://38.60.244.74:3000";

export default function SellTable() {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [priceTotal, setPriceTotal] = useState(0);
  const [goldTotal, setGoldTotal] = useState("");

  const itemsPerPage = 6;

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_BASE}/sellTable`);
      const data = await res.json();
      if (data.success) {
        // Map table data for display (with date object for sorting)
        const mapped = data.data.map((item) => ({
          ...item,
          date: new Date(item.created_at), // still needed for table sorting/filter
        }));
        setSales(mapped);

        // ✅ Use API totals directly
        setPriceTotal(data.priceTotal);
        setGoldTotal(data.goldTotal);
      }
    } catch (err) {
      console.error("Error fetching sellTable:", err);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedSales = useMemo(() => {
    let sorted = [...sales];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === "string")
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        if (aVal instanceof Date)
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      });
    }
    return sorted;
  }, [sales, sortConfig]);

  const filteredSales = sortedSales.filter((s) => {
    // Search filter
    const matchesSearch = Object.values(s)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesDate = false;
    // date range filter
    const createdAt = new Date(s.created_at);
    const fromTime = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const toTime = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;
    if (fromTime && toTime) {
      // ✅ Range filter
      matchesDate =
        createdAt.getTime() >= fromTime && createdAt.getTime() <= toTime;
    } else if (fromTime || toTime) {
      // ✅ Only one date → one-day filter
      const singleDate = new Date(fromTime || toTime);
      const startOfDay = new Date(singleDate.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(singleDate.setHours(23, 59, 59, 999)).getTime();

      matchesDate =
        createdAt.getTime() >= startOfDay && createdAt.getTime() <= endOfDay;
    } else {
      // ✅ No date filters → show all
      matchesDate = true;
    }

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Export EXCEL
    const handleExport = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/sales");
        const data = await res.json();
        
        if (!data.success && !Array.isArray(data.data)) {
          alert("No data found to export.");
          return;
        }
  
        // frontend filter logic (search + date)
        const filtered = data.data
          .filter((s) => ["sell"].includes(s.type?.toLowerCase()))
          .filter((s) => {
            // search (fullname, id_number, email)
            const text = `${s.fullname} ${s.userid} ${s.price} ${s.status} ${s.method}`.toLowerCase();
            const matchesSearch = searchTerm
            ? text.includes(searchTerm.toLowerCase())
            : true;
  
            // date range filter
            const createdAt = new Date(s.created_at);
            const fromTime = fromDate ? new Date(fromDate).getTime() : null;
            const toTime = toDate ? new Date(toDate).getTime() + 86399999 : null;
  
            const matchesDate =
              (!fromTime || createdAt.getTime() >= fromTime) &&
              (!toTime || createdAt.getTime() <= toTime);
  
            return matchesSearch && matchesDate;
          });
  
        if (filtered.length === 0) {
          alert("No matching data to export.");
          return;
        }
  
        // convert to excel
        const exportData = filtered.map((item, count) => ({
          ID: String(count + 1),
          UserID: item.userid,
          Name: item.fullname,
          Seller: item.seller,
          Manager: item.manager,
          Type: item.type,
          Gold: item.gold,
          Price: `${item.price.toLocaleString()} ကျပ်`,
          Payment_Phone: item.payment_phone,
          Payment_Name: item.payment_name,
          Method: item.method,
          Status: item.status,
          Date: new Date(item.created_at).toLocaleDateString(),
          Time: new Date(item.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        }));
  
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sell Sales Report");
  
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
  
        saveAs(blob, "Sell Sales Report.xlsx");
      } catch (error) {
        console.error("Export error:", error);
      }
    };

  return (
    <>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
          <h3 className="text-xl font-semibold text-red-500">
            Sell Transactions
          </h3>
          <div className="flex flex-row gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-56 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
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

        <div className="flex items-top justify-between mb-4">
          <div>
            <h3 className="text-sm text-yellow-500">
              Gold Total - {goldTotal}
            </h3>
            <h3 className="text-sm text-yellow-500">
              Price Total - {priceTotal.toLocaleString()} ကျပ်
            </h3>
          </div>

          {/* Date Filter */}
          <div className="flex gap-4">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-36 rounded-2xl bg-yellow-600 text-neutral-900  pl-3 pr-4 py-2 text-sm focus:outline-none hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 appearance-none"
              placeholder="From"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-36 rounded-2xl bg-yellow-600 text-neutral-900  pl-3 pr-4 py-2 text-sm focus:outline-none hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 appearance-none"
              placeholder="To"
            />
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500">
              {[
                { label: "User ID", key: "userid" },
                 { label: "Seller", key: "seller" },      
  { label: "Manager", key: "manager" },  
                { label: "ကျပ် ပဲ ရွေး", key: "gold" },
                { label: "Price", key: "price" },
                { label: "Date", key: "date" },
                { label: "Method", key: "method" },
                { label: "Payment Name", key: "payment_name" },
                { label: "Payment Phone", key: "payment_phone" },
                { label: "Details", key: "details" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="py-2 px-3 cursor-pointer select-none text-center"
                  onClick={() => col.key !== "details" && requestSort(col.key)}
                >
                  <div className="flex items-center gap-1 justify-center">
                    {col.label}
                    {col.key !== "details" &&
                      (sortConfig.key === col.key ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      ) : (
                        <ChevronUp
                          size={14}
                          className="opacity-30 rotate-180"
                        />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedSales.length === 0 ? (
              <tr className="h-[150px]">
                <td colSpan={10} className="text-center py-10 text-neutral-500">
                  No sell transactions found.
                </td>
              </tr>
            ) : (
              paginatedSales.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/50 text-center"
                >
                  <td className="py-2 px-3">{s.userid}</td>
                    <td className="py-2 px-3 text-center">{s.seller || "-"}</td>      {/* ✅ new */}
  <td className="py-2 px-3 text-center">{s.manager || "-"}</td> 
                  
          
                  <td className="py-2 px-3">{s.gold}</td>
                  <td className="py-2 px-3">{s.price.toLocaleString()} Ks</td>
                  <td className="py-2 px-3">{s.date.toLocaleDateString()}</td>
                  <td className="py-2 px-3">{s.method}</td>
                  <td className="py-2 px-3">{s.payment_name || "-"}</td>
                  <td className="py-2 px-3">{s.payment_phone || "-"}</td>
            
                  <td className="py-2 px-3">
                    <button
                      onClick={() => setSelectedTxn(s)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-600 text-white hover:bg-yellow-500 transition-all duration-200"
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
      </div>

      {/* --- Detail Modal for Sell --- */}
      {selectedTxn && selectedTxn.type === "sell" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTxn(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-white"
            >
              ✕
            </button>

            {/* Transaction ID */}
            <h2 className="text-lg font-semibold mb-4 text-red-500">
              {selectedTxn.fullname}
            </h2>

            <div className="bg-red-900/20 rounded-xl p-3 mb-3 ">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5 ">
                <p>
                  <span className="text-neutral-400">Full Name -</span>{" "}
                  {selectedTxn.fullname || "-"}
                </p>
                <p>
                  <span className="text-neutral-400">User ID -</span>{" "}
                  {selectedTxn.userid || "-"}
                </p>
                <p>
                  <span className="text-neutral-400">Type -</span>{" "}
                  <span className="font-semibold px-2 py-1 rounded-full text-red-400 bg-red-900/20">
                    {selectedTxn.type || "-"}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-400">Gold -</span>{" "}
                  {selectedTxn.gold || "-"}
                </p>
                <p>
                  <span className="text-neutral-400">Price -</span>{" "}
                  {selectedTxn.price?.toLocaleString() || "-"} Ks
                </p>
                <p>
                  <span className="text-neutral-400">Method -</span>{" "}
                  {selectedTxn.method || "-"}
                </p>
                   <p>
        <span className="text-neutral-400">Seller -</span> {selectedTxn.seller || "-"}
      </p>
      <p>
        <span className="text-neutral-400">Manager -</span> {selectedTxn.manager || "-"}
      </p>
        
              
                <p>
                  <span className="text-neutral-400">Date -</span>{" "}
                  {selectedTxn.date
                    ? new Date(selectedTxn.date).toLocaleDateString()
                    : "-"}
                </p>
                <p>
                  <span className="text-neutral-400">Time -</span>{" "}
                  {selectedTxn.date
                    ? new Date(selectedTxn.date).toLocaleTimeString()
                    : "-"}
                </p>
                        <p>
                  <span className="text-neutral-400">Status -</span>{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded-full ${
                      selectedTxn.status === "approved"
                        ? "text-emerald-400 bg-emerald-900/20"
                        : selectedTxn.status === "pending"
                        ? "text-yellow-400 bg-yellow-900/20"
                        : "text-rose-400 bg-rose-900/20"
                    }`}
                  >
                    {selectedTxn.status || "-"}
                  </span>
                </p>
              </div>

              {/* Payment Info */}
              <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-3 mb-3">
                <p className="font-medium text-red-500 mb-2">
                  💰 Payment Info
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="text-neutral-400">Name -</span>{" "}
                    {selectedTxn.payment_name || "-"}
                  </p>
                  <p>
                    <span className="text-neutral-400">Phone -</span>{" "}
                    {selectedTxn.payment_phone || "-"}
                  </p>
                  <p>
                    <span className="text-neutral-400">Method -</span>{" "}
                    {selectedTxn.method || "-"}
                  </p>
                  <p>
                    <span className="text-neutral-400">Amount -</span>{" "}
                    {selectedTxn.price?.toLocaleString()} Ks
                  </p>
                </div>
              </div>
            </div>

            {/* Photos */}
            {selectedTxn.photos?.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mt-2">
                {selectedTxn.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={`${API_BASE}/uploads/${photo}`}
                    onClick={() =>
                      setPreviewImg(`${API_BASE}/uploads/${photo}`)
                    }
                    className="w-28 h-40 object-cover border border-neutral-700 rounded-lg cursor-pointer hover:scale-105 transition"
                    alt="Sell proof"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
