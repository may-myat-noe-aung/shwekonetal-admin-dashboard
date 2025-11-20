import React, { useEffect, useState, useMemo } from "react";
import { Search, Download, ChevronUp, ChevronDown, Info } from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE = "http://38.60.244.74:3000";

export default function BuyTable() {
  const [buyData, setBuyData] = useState([]);
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
  const [priceTotal, setPriceTotal] = useState(0);
  const [goldTotal, setGoldTotal] = useState("");

  const itemsPerPage = 6;

  // ✅ Fetch data from API
useEffect(() => {
  let intervalId;

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/buyTable`);
      const data = await res.json();
      if (data.success) {
        const formatted = data.data.map((item) => ({
          ...item,
          date: new Date(item.created_at),
        }));
        setBuyData(formatted);

        // Update totals from API
        setPriceTotal(data.priceTotal);
        setGoldTotal(data.goldTotal);
      }
    } catch (err) {
      console.error("Error fetching buyTable:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  fetchData();

  // 500ms interval fetch
  intervalId = setInterval(fetchData, 500);

  return () => clearInterval(intervalId); // Cleanup on unmount
}, []);




  // ✅ Sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  // const sortedData = useMemo(() => {
  //   const sorted = [...buyData];
  //   sorted.sort((a, b) => {
  //     const aVal = a[sortConfig.key];
  //     const bVal = b[sortConfig.key];
  //     if (typeof aVal === "string")
  //       return sortConfig.direction === "asc"
  //         ? aVal.localeCompare(bVal)
  //         : bVal.localeCompare(aVal);
  //     if (aVal instanceof Date)
  //       return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
  //     return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
  //   });
  //   return sorted;
  // }, [buyData, sortConfig]);

  // Export EXCEL

  const sortedData = useMemo(() => {
    const sorted = [...buyData];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // handle null/undefined
      if (aVal == null) aVal = "";
      if (bVal == null) bVal = "";

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (aVal instanceof Date) {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [buyData, sortConfig]);

  const handleExport = async () => {
    try {
      const res = await fetch("http://38.60.244.74:3000/buyTable");
      const data = await res.json();

      if (!data.success && !Array.isArray(data.data)) {
        alert("No data found to export.");
        return;
      }

      // frontend filter logic (search + date)
      const filtered = data.data
        .filter((s) => ["buy"].includes(s.type?.toLowerCase()))
        .filter((s) => {
          // search (fullname, id_number, email)
          const text =
            `${s.fullname} ${s.userid} ${s.seller} ${s.agent ? s.agent : 'Normal'} ${s.manager} ${s.price} ${s.method}`.toLowerCase();
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
        Agent: item.agent ? item.agent : 'Normal',
        Type: item.type,
        Gold: item.gold,
        Price: `${item.price.toLocaleString()} ကျပ်`,
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Buy Sales Report");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, "Buy Sales Report.xlsx");
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  // ✅ Search + Date filter
  const filteredData = sortedData.filter((item) => {
    const term = searchTerm.toLowerCase();

    // Search filter
    const matchesSearch =
      item.userid?.toLowerCase().includes(term) ||
      item.fullname?.toLowerCase().includes(term) ||
      (item.agent
        ? item.agent.toLowerCase().includes(term)
        : "normal".includes(term)
      ) ||
      item.seller?.toLowerCase().includes(term) ||
      item.manager?.toLowerCase().includes(term) ||
      item.price?.toString().toLowerCase().includes(term) ||
      item.method?.toLowerCase().includes(term) ||
      item.type?.toLowerCase().includes(term) ||
      item.gold?.toString().includes(term) ||
      item.status?.toLowerCase().includes(term);

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

  // ✅ Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedSales = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
        <h3 className="text-xl font-semibold text-green-400">
          Buy Transactions
        </h3>

        <div className="flex flex-row md:flex-row gap-2">
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="All Search..."
                className="w-56 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 "
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
      </div>

      <div className="flex items-top justify-between mb-4">
        <div>
          <h3 className="text-sm text-yellow-500">Gold Total - {goldTotal}</h3>
          <h3 className="text-sm text-yellow-500">
            Price Total - {priceTotal.toLocaleString()} ကျပ်
          </h3>
        </div>

        {/* Date Filter */}
        <div className="flex gap-4">
          <div className="relative ">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-36 rounded-2xl bg-yellow-600  text-neutral-900  pl-3 pr-4 py-2 text-sm focus:outline-none focus:ring-2 hover:bg-yellow-500  focus:ring-yellow-500 appearance-none"
            />
          </div>

          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-36 rounded-2xl bg-yellow-600  text-neutral-900  pl-3 pr-4 py-2 text-sm focus:outline-none focus:ring-2 hover:bg-yellow-500  focus:ring-yellow-500 appearance-none"
              placeholder="To"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-neutral-500">
            {[
              { label: "User ID", key: "userid" },
              { label: "User Name", key: "fullname" },
              { label: "Seller", key: "seller" },
              { label: "Manager", key: "manager" },
              { label: "Agent", key: "agent" },
              { label: "Gold", key: "gold" },
              { label: "Price", key: "price" },
              { label: "Date", key: "date" },
              { label: "Method", key: "method" },
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
              <td colSpan="9" className="text-center py-10 text-yellow-500">
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
                <td className="py-2 px-3 text-center">{s.fullname}</td>
                <td className="py-2 px-3 text-center">
                  {s.seller || "-"}
                </td>{" "}
                <td className="py-2 px-3 text-center">{s.manager || "-"}</td>
                <td className="py-2 px-3">{s.agent || "Normal"}</td>
                <td className="py-2 px-3 text-center">{s.gold}</td>
                <td className="py-2 px-3 text-center">
                  {s.price.toLocaleString()} ကျပ်
                </td>
                <td className="py-2 px-3 text-center">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(s.date || s.created_at))}
                </td>
                <td className="py-2 px-3 text-center">{s.method}</td>
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

      {/* --- BUY TRANSACTION DETAILS --- */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setSelectedTxn(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-200"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-green-400">
              {selectedTxn.fullname}
            </h2>

            {/* --- Dynamic Content based on type --- */}
            {selectedTxn.type === "buy" ? (
              <div className="bg-green-900/20 p-4 rounded-xl mb-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
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
                    <span className="font-semibold px-2 py-1 rounded-full text-green-400 bg-green-900/20">
                      {selectedTxn.type || "-"}
                    </span>
                  </p>
                  <p>
                    <span className="text-neutral-400">Gold -</span>{" "}
                    {selectedTxn.gold || "-"}
                  </p>
                  <p>
                    <span className="text-neutral-400">Amount -</span>{" "}
                    {selectedTxn.price?.toLocaleString() || "-"} Ks
                  </p>
                  <p>
                    <span className="text-neutral-400">Payment Method -</span>{" "}
                    {selectedTxn.method || "-"}
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
                    {selectedTxn.date
                      ? selectedTxn.date.toLocaleTimeString()
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
                  <p>
                    <span className="text-neutral-400">Agent -</span>{" "}
                    {selectedTxn.agent || "Normal"}
                  </p>
                </div>
              </div>
            ) : (
              // Delivery transaction UI (you can style differently)
              <div className="bg-blue-900/20 p-4 rounded-xl mb-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
                  <p>
                    <span className="text-neutral-400">User ID -</span>{" "}
                    {selectedTxn.userid || "-"}
                  </p>
                  <p>
                    <span className="text-neutral-400">Gold -</span>{" "}
                    {selectedTxn.gold || "-"}
                  </p>
                  <p>
                    <span className="text-neutral-400">Type -</span>{" "}
                    {selectedTxn.type || "-"}
                  </p>
                  <p>
                    <span className="text-neutral-400">Price -</span>{" "}
                    {selectedTxn.price?.toLocaleString() || "-"} ကျပ်
                  </p>
                  <p>
                    <span className="text-neutral-400">Method -</span>{" "}
                    {selectedTxn.method || "-"}
                  </p>
                  <p>
                    <span className="text-neutral-400">Status -</span>{" "}
                    {selectedTxn.status || "-"}
                  </p>
                  <p>
                    <p>
                      <span className="text-neutral-400">Seller -</span>{" "}
                      {selectedTxn.seller || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Manager -</span>{" "}
                      {selectedTxn.manager || "-"}
                    </p>
                    <span className="text-neutral-400">Date -</span>{" "}
                    {selectedTxn.date ? selectedTxn.date.toLocaleString() : "-"}
                  </p>
                </div>
              </div>
            )}

            {/* --- Photos --- */}
    <div className="flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-hidden">
  {selectedTxn.photos?.map((file, idx) => (
    <img
      key={idx}
      src={`${API_BASE}/uploads/${file}`}
      alt="Proof"
      onClick={() => setPreviewImg(`${API_BASE}/uploads/${file}`)}
      className="w-28 h-40 object-cover border border-neutral-700 rounded-lg cursor-pointer hover:scale-105 transition flex-shrink-0"
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
