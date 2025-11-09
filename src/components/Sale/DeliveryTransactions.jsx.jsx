

import React, { useState, useEffect, useMemo } from "react";
import { Info, Search, Download, ChevronUp, ChevronDown } from "lucide-react";
import TransactionPopup from "./TransactionPopup.jsx";
import { useNavigate } from "react-router-dom";


const DeliveryTransactions = ({ sales, updateStatus }) => {
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [actionTaken, setActionTaken] = useState("none");
  const [page, setPage] = useState(1);
  const [pageWindow, setPageWindow] = useState(1);
  const rowsPerPage = 10;
  const pagesPerWindow = 10;
  const navigate = useNavigate();

  const [salesData, setSalesData] = useState([]);

  // ✅ Fetch API
  useEffect(() => {
    fetch("http://38.60.244.74:3000/sales")
      .then(res => res.json())
      .then(data => {
        setSalesData(
          data.data.map(s => ({
            ...s,
            date: new Date(s.created_at)
          }))
        );
      });
  }, []);

  // ✅ ဒီမှာ salesData ကိုသုံးပါ (sales မဟုတ်)
  const filteredSales = useMemo(() => {
    return salesData
      .filter((s) => s.type === "delivery")
      .filter(
        (s) =>
          s.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.userid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [salesData, searchTerm]);



  const sortedSales = useMemo(() => {
    const sortable = [...filteredSales];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aVal, bVal;
        if (sortConfig.key === "time") {
          aVal =
            a.date.getHours() * 3600 +
            a.date.getMinutes() * 60 +
            a.date.getSeconds();
          bVal =
            b.date.getHours() * 3600 +
            b.date.getMinutes() * 60 +
            b.date.getSeconds();
        } else {
          aVal = a[sortConfig.key];
          bVal = b[sortConfig.key];
          if (aVal instanceof Date) aVal = aVal.getTime();
          if (bVal instanceof Date) bVal = bVal.getTime();
          if (typeof aVal === "string") aVal = aVal.toLowerCase();
          if (typeof bVal === "string") bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredSales, sortConfig]);

  const totalPages = Math.ceil(sortedSales.length / rowsPerPage);
  const paginatedSales = sortedSales.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "User",
      "Type",
      "Gold",
      "Delivery Fee",
      "Service Fee",
      "Status",
      "Date",
    ];
    const rows = filteredSales.map((s) => [
      s.id,
      s.userid,
      s.type,
      s.gold,
      s.deli_fees ?? "",
      s.service_fees ?? "",
      s.status,
      s.date.toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "delivery_transactions.csv";
    link.click();
  };

  // --- Sliding Window Pagination ---
  const startPage = (pageWindow - 1) * pagesPerWindow + 1;
  const endPage = Math.min(startPage + pagesPerWindow - 1, totalPages);
  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

  return (
  <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4  overflow-x-auto">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3">
    <h3 className="text-xl font-semibold text-purple-400">Delivery Transactions</h3>
    <div className="flex flex-col md:flex-row gap-2 md:gap-2">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="All Search..."
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
            { label: "User ID", key: "userid" },
            { label: "Customer Name", key: "fullname" },
            // { label: "Type", key: "type" },
            { label: "Gold", key: "gold" },
            { label: "Delivery Fee", key: "deliveryFee" },
            { label: "Service Fee", key: "serviceFee" },
            { label: "Delivery Date", key: "date" },
            { label: "Time", key: "time" },
            { label: "Payment", key: "payment" },
            { label: "Status", key: "status" },
            { label: "Details", key: "details" },
          ].map((col) => (
            <th
              key={col.key}
              className="py-2 px-3 cursor-pointer select-none text-center "
              onClick={() => col.key !== "details" && requestSort(col.key)}
            >
              <div className="flex items-center gap-1 justify-center">
                {col.label}
                {col.key !== "details" && (
                  <>
                    {sortConfig.key === col.key ? (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )
                    ) : (
                      <ChevronUp size={14} className="opacity-30 rotate-180" />
                    )}
                  </>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {paginatedSales.length === 0 ? (
          <tr className="h-[200px]">
            <td colSpan={12} className="text-center py-10 text-neutral-500">
              No transactions found.
            </td>
          </tr>
        ) : (
          paginatedSales.map((s) => (
            <tr
              key={s.id}
              className="border-b text-center border-neutral-800 hover:bg-neutral-800/50 h-[30px]"
            >
              <td className="py-2 px-3">{s.userid}</td>
              <td className="py-2 px-3">{s.fullname}</td>
              {/* <td className="py-1 px-3 capitalize font-semibold text-purple-400">{s.type}</td> */}
              <td className="py-2 px-3">{s.gold}</td>
              <td className="py-2 px-3">{s.deli_fees ?? "-"}</td>
              <td className="py-2 px-3">{s.service_fees ?? "-"}</td>
              <td className="py-2 px-3">{s.date.toLocaleDateString()}</td>
              <td className="py-2 px-3">{s.date.toLocaleTimeString()}</td>
              <td className="py-2 px-3 capitalize">{s.method}</td>
              <td
                className={`py-2 px-3 capitalize font-semibold ${
                  s.status === "approved"
                    ? "text-emerald-400"
                    : s.status === "pending"
                    ? "text-yellow-400"
                    : "text-rose-400"
                }`}
              >
                {s.status}
              </td>
              <td className="py-2 px-3">
                <button
                  onClick={() => setSelectedTxn(s)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-600 text-white hover:bg-yellow-500 transition-all duration-200 text-center"
                >
                  <Info size={14} /> Details
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex flex-col md:flex-row justify-between px-4 pt-4 text-sm text-neutral-400 gap-2 md:gap-0">
    <p>
      Page {totalPages === 0 ? 0 : page} of {totalPages}
    </p>
    <div className="flex gap-2 flex-wrap">
      <button
        disabled={page === 1}
        onClick={() => {
          const newPage = Math.max(1, page - 1);
          setPage(newPage);
          if (newPage < startPage) setPageWindow(pageWindow - 1);
        }}
        className={`px-3 py-1 rounded-md border border-neutral-700 ${
          page === 1 ? "text-neutral-500 cursor-not-allowed" : "text-yellow-400 hover:bg-neutral-900"
        }`}
      >
        Prev
      </button>

      {visiblePages.map((n) => (
        <button
          key={n}
          onClick={() => setPage(n)}
          className={`px-3 py-1 rounded-md border border-neutral-700 ${
            page === n ? "bg-yellow-500 text-black font-semibold" : "text-yellow-400 hover:bg-neutral-900"
          }`}
        >
          {n}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => {
          const newPage = Math.min(totalPages, page + 1);
          setPage(newPage);
          if (newPage > endPage) setPageWindow(pageWindow + 1);
        }}
        className={`px-3 py-1 rounded-md border border-neutral-700 ${
          page === totalPages ? "text-neutral-500 cursor-not-allowed" : "text-yellow-400 hover:bg-neutral-900"
        }`}
      >
        Next
      </button>
    </div>
  </div>

  {/* Popup */}
  {selectedTxn && (
    <TransactionPopup
      txn={selectedTxn}
      close={() => setSelectedTxn(null)}
      setPreviewImg={setPreviewImg}
      actionTaken={actionTaken}
      setActionTaken={setActionTaken}
      updateStatus={updateStatus}
      navigate={navigate}
    />
  )}
</div>

  );
};

export default DeliveryTransactions;
