import React, { useState, useMemo } from "react";
import { Info, Search, Download, ChevronUp, ChevronDown } from "lucide-react";
import TransactionPopup from "./TransactionPopup.jsx";
import { useNavigate } from "react-router-dom";

const RecentTransactions = ({ sales, updateStatus }) => {
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [actionTaken, setActionTaken] = useState("none");
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  // --- Filtered Sales ---
  const filteredSales = useMemo(() => {
    return sales.filter(
      (s) =>
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.userid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sales, searchTerm]);

  // --- Sorted Sales ---
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
    const headers = ["ID", "User", "Type", "Gold", "Price", "Status", "Date"];
    const rows = sales.map((s) => [
      s.id,
      s.userid,
      s.type,
      s.gold,
      s.price,
      s.status,
      s.date.toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sales_data.csv";
    link.click();
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        <div className="flex gap-2">
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

      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-neutral-500">
            {[
              { label: "User ID", key: "userid" },
              { label: "Customer Name", key: "fullname" },
              { label: "Type", key: "type" },
              { label: "ကျပ် ပဲ ရွေး", key: "gold" },
              { label: "Price", key: "price" },
              { label: "Date", key: "date" },
              { label: "Time", key: "time" },
              { label: "Payment", key: "payment" },
              { label: "Status", key: "status" },
              { label: "Details", key: "details" },
            ].map((col) => (
              <th
                key={col.key}
                className=" py-2 px-3 cursor-pointer select-none text-center"
                onClick={() => col.key !== "details" && requestSort(col.key)}
              >
                <div className="flex items-center gap-1">
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
                        <ChevronUp
                          size={14}
                          className="opacity-30 rotate-180"
                        />
                      )}
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {paginatedSales.length === 0 ? (
            <tr className="h-[490px]">
              <td colSpan={10} className="text-center py-10 text-neutral-500">
                No transactions found.
              </td>
            </tr>
          ) : (
            paginatedSales.map((s) => (
              <tr
                key={s.id}
                className="border-b border-neutral-800 hover:bg-neutral-800/50 h-[30px]"
              >
                <td className="py-2 px-3">{s.userid}</td>
                <td className="py-2 px-3">{s.fullname}</td>
                <td
                  className={`py-1 px-3 capitalize font-semibold ${
                    s.type === "buy"
                      ? "text-green-400 px-2"
                      : s.type === "sell"
                      ? "text-blue-400 px-2"
                      : s.type === "delivery"
                      ? "text-orange-400 px-2"
                      : "text-neutral-300 px-2"
                  }`}
                >
                  {s.type}
                </td>
                <td className="py-2 px-3">{s.gold}</td>
                <td className="py-2 px-3">{s.price.toLocaleString()} Ks</td>
                <td className="py-2 px-3">{s.date.toLocaleDateString()}</td>
                <td className="py-2 px-3">{s.date.toLocaleTimeString()}</td>
                <td className="py-2 px-3 capitalize">{s.method}</td>
                <td
                  className={`py-2 px-3 capitalize font-semibold ${
                    s.status === "approved"
                      ? "text-emerald-400  px-2"
                      : s.status === "pending"
                      ? "text-yellow-400 px-2"
                      : "text-rose-400  px-2"
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

      {/* --- Popup, Passcode & Photo Preview */}
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

export default RecentTransactions;
