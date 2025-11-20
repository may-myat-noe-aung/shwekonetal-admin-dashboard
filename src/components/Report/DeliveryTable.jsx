import React, { useEffect, useState, useMemo } from "react";
import { Search, Download, ChevronUp, ChevronDown, Info } from "lucide-react";

const API_BASE = "http://38.60.244.74:3000";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DeliveryTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [goldTotal, setGoldTotal] = useState("");

  const itemsPerPage = 6;

useEffect(() => {
  let intervalId;

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/deliTable`);
      const result = await res.json();
      if (result.success) {
        const formatted = result.data.map((item) => ({
          ...item,
          date: new Date(item.created_at),
        }));
        setData(formatted);
        setGoldTotal(result.goldTotal);
      }
    } catch (err) {
      console.error("Error fetching delivery table:", err);
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  fetchData();

  // fetch every 500ms
  intervalId = setInterval(fetchData, 500);

  // cleanup interval on unmount
  return () => clearInterval(intervalId);
}, []);


  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sorted = [...data];
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
    return sorted;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.userid?.toLowerCase().includes(term) ||
      item.method?.toLowerCase().includes(term) ||
      item.type?.toLowerCase().includes(term) ||
      item.gold?.toString().includes(term) ||
      item.status?.toLowerCase().includes(term) ||
      item.fullname?.toLowerCase().includes(term) ||
      (item.agent
        ? item.agent.toLowerCase().includes(term)
        : "normal".includes(term)) ||
    item.seller?.toLowerCase().includes(term) ||
      item.manager?.toLowerCase().includes(term) ||
      item.service_fees?.toString().toLowerCase().includes(term) ||
      item.deli_fees?.toString().toLowerCase().includes(term) ||
      item.price?.toString().toLowerCase().includes(term);
    // date range filter
    const createdAt = new Date(item.created_at);
    const fromTime = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const toTime = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

    let matchesDate = false;

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

  // Export EXCEL
  const handleExport = async () => {
    try {
      const res = await fetch("http://38.60.244.74:3000/deliTable");
      const data = await res.json();

      if (!data.success && !Array.isArray(data.data)) {
        alert("No data found to export.");
        return;
      }

      // frontend filter logic (search + date)
      const filtered = data.data
        .filter((s) => ["delivery"].includes(s.type?.toLowerCase()))
        .filter((s) => {
          // search (fullname, id_number, email)
          const text = `${s.fullname} ${s.userid} ${s.deli_fees} ${
            s.agent ? s.agent : "Normal"
          } ${s.seller} ${s.manager} ${s.service_fees}`.toLowerCase();
          const matchesSearch = searchTerm
            ? text.includes(searchTerm.toLowerCase())
            : true;

          // date range filter
          const createdAt = new Date(s.created_at);
          const fromTime = fromDate
            ? new Date(fromDate).setHours(0, 0, 0, 0)
            : null;
          const toTime = toDate
            ? new Date(toDate).setHours(23, 59, 59, 999)
            : null;

          let matchesDate = false;

          if (fromTime && toTime) {
            // ✅ Range filter
            matchesDate =
              createdAt.getTime() >= fromTime && createdAt.getTime() <= toTime;
          } else if (fromTime || toTime) {
            // ✅ Only one date → one-day filter
            const singleDate = new Date(fromTime || toTime);
            const startOfDay = new Date(
              singleDate.setHours(0, 0, 0, 0)
            ).getTime();
            const endOfDay = new Date(
              singleDate.setHours(23, 59, 59, 999)
            ).getTime();

            matchesDate =
              createdAt.getTime() >= startOfDay &&
              createdAt.getTime() <= endOfDay;
          } else {
            // ✅ No date filters → show all
            matchesDate = true;
          }

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
        Agent: item.agent ? item.agent : "Normal",
        Type: item.type,
        Gold: item.gold,
        Delivery_Fees: `${
          item.deli_fees ? item.deli_fees.toLocaleString() : "-"
        } ကျပ်`,
        Server_Fees: `${
          item.services_fees ? item.deli_fees.toLocaleString() : "-"
        } ကျပ်`,
        Phone: item.payment_phone,
        Address: item.address,
        Delivery_Type: item.deli_type,
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
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Delivery Sales Report"
      );

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, "Delivery Sales Report.xlsx");
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
        <h3 className="text-xl font-semibold text-purple-400">
          Delivery Transactions
        </h3>
        <div className="flex flex-row md:flex-row gap-2">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="All Search..."
                className="w-56 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-yellow-500">Gold Total - {goldTotal}</h3>
        <div className="flex gap-4">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-36 rounded-2xl bg-yellow-600 text-neutral-900 pl-3 pr-4 py-2 text-sm focus:outline-none focus:ring-2 hover:bg-yellow-500 focus:ring-yellow-500 appearance-none"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-36 rounded-2xl bg-yellow-600 text-neutral-900 pl-3 pr-4 py-2 text-sm focus:outline-none focus:ring-2 hover:bg-yellow-500 focus:ring-yellow-500 appearance-none"
          />
        </div>
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-neutral-500 text-center">
            {[
              { label: "User ID", key: "userid" },
              { label: "User Name", key: "fullname" },
              { label: "Seller", key: "seller" },
              { label: "Manager", key: "manager" },
              { label: "Agent", key: "agent" },
              { label: "Gold", key: "gold" },
              { label: "Date", key: "date" },
              { label: "Delivery Fees", key: "deli_fees" },
              { label: "Service Fees", key: "service_fees" },

              { label: "Details", key: "details" },
            ].map((col) => (
              <th
                key={col.key}
                className="py-2 px-3 cursor-pointer select-none text-center"
                onClick={() => col.key !== "details" && requestSort(col.key)}
              >
                <div className="flex items-center justify-center gap-1">
                  {col.label}
                  {col.key !== "details" &&
                    (sortConfig.key === col.key ? (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )
                    ) : (
                      <ChevronUp size={14} className="opacity-30 rotate-180" />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center py-10 text-yellow-500">
                Loading...
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center py-10 text-neutral-500">
                No transactions found.
              </td>
            </tr>
          ) : (
            paginatedData.map((s) => (
              <tr
                key={s.id}
                className="border-b border-neutral-800 hover:bg-neutral-800/50"
              >
                <td className="py-2 px-3 text-center">{s.userid}</td>
                <td className="py-2 px-3 text-center">{s.fullname}</td>

                <td className="py-2 px-3 text-center">{s.seller || "-"}</td>
                <td className="py-2 px-3 text-center">{s.manager || "-"}</td>
                <td className="py-2 px-3">{s.agent || "Normal"}</td>

                <td className="py-2 px-3 text-center">{s.gold}</td>

                <td className="py-2 px-3 text-center">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(s.date || s.created_at))}
                </td>
                <td className="py-2 px-3 text-center">
                  {s.deli_fees || "-"} ကျပ်
                </td>
                <td className="py-2 px-3 text-center">
                  {s.service_fees || "-"} ကျပ်
                </td>

                <td className="py-2 px-3 flex justify-center">
                  <button
                    onClick={() => setSelectedTxn(s)}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-600 text-white hover:bg-yellow-500 transition-all duration-200"
                  >
                    <Info size={14} /> Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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

      {selectedTxn && selectedTxn.type === "delivery" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setSelectedTxn(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-200"
            >
              ✕
            </button>

            {/* --- Transaction fullname --- */}
            <h2 className="text-lg font-semibold mb-4 text-purple-400">
              {selectedTxn.fullname}
            </h2>

            {/* --- Customer & Delivery Cards --- */}
            <div className="bg-purple-900/20 p-4 rounded-xl mb-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
                {/* Customer Info */}
                <div className="col-span-2 rounded-xl p-3">
                  <p className="font-medium text-purple-300 mb-2">
                    🧍 Customer Info
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="text-neutral-400">Full Name -</span>{" "}
                      {selectedTxn.fullname || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Phone -</span>{" "}
                      {selectedTxn.payment_phone || "-"}
                    </p>

                    <p>
                      <span className="text-neutral-400">Seller -</span>{" "}
                      {selectedTxn.seller || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Manager -</span>{" "}
                      {selectedTxn.manager || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Date -</span>{" "}
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(
                        new Date(selectedTxn.date || selectedTxn.created_at)
                      )}
                    </p>
                    <p>
                      <span className="text-neutral-400">Time -</span>{" "}
                      {selectedTxn.created_at.split(" ")[1]}
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
                    <p>
                      <span className="text-neutral-400">Agent -</span>{" "}
                      {selectedTxn.agent || "Normal"}
                    </p>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="col-span-2 bg-purple-950/30 border border-purple-800/40 rounded-xl p-3">
                  <p className="font-medium text-purple-300 mb-2">
                    📦 Delivery Info
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[16px]">
                    <p className="col-span-2">
                      <span className="text-neutral-400">
                        Delivery Address -
                      </span>{" "}
                      {selectedTxn.address || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Delivery Type -</span>{" "}
                      {selectedTxn.deli_type || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Gold -</span>{" "}
                      {selectedTxn.gold || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Delivery Fee -</span>{" "}
                      {selectedTxn.deli_fees
                        ? `${selectedTxn.deli_fees} ကျပ်`
                        : "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Service Fee -</span>{" "}
                      {selectedTxn.service_fees
                        ? `${selectedTxn.service_fees} ကျပ်`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Fees & Actions (only pending) --- */}
            {/* {selectedTxn.status === "pending" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowPasscode({ type: "approve" });
                }}
              >
                <div className="flex gap-4 mb-4">
                  <div>
                    <label className="text-sm text-neutral-400">
                      Delivery Fee
                    </label>
                    <input
                      type="number"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(Number(e.target.value))}
                      required
                      className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400">
                      Service Fee
                    </label>
                    <input
                      type="number"
                      value={serviceFee}
                      onChange={(e) => setServiceFee(Number(e.target.value))}
                      required
                      className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    className={`px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-sm ${
                      actionTaken !== "none"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={actionTaken !== "none"}
                  >
                    Transfer
                  </button>

                  <button
                    onClick={() => setShowPasscode({ type: "reject" })}
                    className={`px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-sm ${
                      actionTaken !== "none"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => setShowChat(true)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm"
                  >
                    💬 Message
                  </button>
                </div>
              </form>
            )} */}

            {/* --- Photos --- */}
            {selectedTxn.photos?.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mt-3">
                {selectedTxn.photos.map((file, idx) => (
                  <img
                    key={idx}
                    src={`${API_BASE}/uploads/${file}`}
                    alt="Proof"
                    onClick={() => setPreviewImg(`${API_BASE}/uploads/${file}`)}
                    className="w-28 h-40 object-cover border border-neutral-700 rounded-lg cursor-pointer hover:scale-105 transition"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
