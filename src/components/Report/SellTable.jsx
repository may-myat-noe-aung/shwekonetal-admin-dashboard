import React, { useState, useEffect, useMemo } from "react";
import { ChevronUp, ChevronDown, Info, Search, Download } from "lucide-react";

const API_BASE = "http://38.60.244.74:3000";

export default function SellTable() {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [page, setPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_BASE}/sellTable`);
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map((item) => ({
          ...item,
          date: new Date(item.created_at),
        }));
        setSales(mapped);
      }
    } catch (err) {
      console.error("Error fetching sellTable:", err);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedSales = useMemo(() => {
    let sorted = [...sales];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [sales, sortConfig]);

  const filteredSales = sortedSales.filter((s) =>
    Object.values(s)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const exportCSV = () => {
    const csv = [
      [
        "User ID",
        "Type",
        "Gold",
        "Price",
        "Status",
        "Date",
        "Method",
        "Payment Name",
        "Payment Phone",
      ].join(","),
      ...sales.map((s) =>
        [
          s.userid,
          s.type,
          s.gold,
          s.price,
          s.status,
          s.created_at,
          s.method,
          s.payment_name,
          s.payment_phone,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sell_transactions.csv";
    link.click();
  };

  return (
    <>
      {/* Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-yellow-400">Sell Transactions</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-64 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
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

        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500">
              {[
                { label: "User ID", key: "userid" },
                { label: "Type", key: "type" },
                { label: "ကျပ် ပဲ ရွေး", key: "gold" },
                { label: "Price", key: "price" },
                { label: "Date", key: "date" },
                { label: "Method", key: "method" },
                { label: "Payment Name", key: "payment_name" },
                { label: "Payment Phone", key: "payment_phone" },
                { label: "Status", key: "status" },
                { label: "Details", key: "details" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="py-2 px-3 cursor-pointer select-none text-center"
                  onClick={() => col.key !== "details" && requestSort(col.key)}
                >
                  <div className="flex items-center gap-1 justify-center">
                    {col.label}
                    {col.key !== "details" && (
                      sortConfig.key === col.key ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
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
            {paginatedSales.length === 0 ? (
              <tr className="h-[480px]">
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
                  <td className="py-2 px-3 text-blue-400 font-semibold capitalize">
                    {s.type}
                  </td>
                  <td className="py-2 px-3">{s.gold}</td>
                  <td className="py-2 px-3">{s.price.toLocaleString()} Ks</td>
                  <td className="py-2 px-3">{s.date.toLocaleDateString()}</td>
                  <td className="py-2 px-3">{s.method}</td>
                  <td className="py-2 px-3">{s.payment_name || "-"}</td>
                  <td className="py-2 px-3">{s.payment_phone || "-"}</td>
                  <td
                    className={`py-2 px-3 font-semibold ${
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
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-500 text-white hover:bg-yellow-400 transition-all duration-200"
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

      {/* --- Detail Card --- */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setSelectedTxn(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-yellow-400 mb-4">
              Sell Detail
            </h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><span className="text-neutral-400">User ID:</span> {selectedTxn.userid}</p>
              <p><span className="text-neutral-400">Type:</span> {selectedTxn.type}</p>
              <p><span className="text-neutral-400">Gold:</span> {selectedTxn.gold}</p>
              <p><span className="text-neutral-400">Price:</span> {selectedTxn.price.toLocaleString()} Ks</p>
              <p><span className="text-neutral-400">Method:</span> {selectedTxn.method}</p>
              <p><span className="text-neutral-400">Payment Name:</span> {selectedTxn.payment_name || "-"}</p>
              <p><span className="text-neutral-400">Payment Phone:</span> {selectedTxn.payment_phone || "-"}</p>
              <p><span className="text-neutral-400">Date:</span> {selectedTxn.date.toLocaleDateString()}</p>
              <p>
                <span className="text-neutral-400">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    selectedTxn.status === "approved"
                      ? "text-emerald-400"
                      : selectedTxn.status === "pending"
                      ? "text-yellow-400"
                      : "text-rose-400"
                  }`}
                >
                  {selectedTxn.status}
                </span>
              </p>
            </div>

            {/* Photos */}
            {selectedTxn.photos && selectedTxn.photos.length > 0 && (
              <div className="mt-4">
                <p className="text-neutral-400 text-sm mb-2">Photos:</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedTxn.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={`${API_BASE}/uploads/${photo}`}
                      onClick={() => setPreviewImg(`${API_BASE}/uploads/${photo}`)}
                      className="w-20 h-20 object-cover rounded-md border border-neutral-700 cursor-pointer hover:opacity-80"
                      alt="Sell proof"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Image Preview --- */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
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
    </>
  );
}
