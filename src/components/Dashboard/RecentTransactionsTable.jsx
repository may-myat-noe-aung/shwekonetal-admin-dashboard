import React, { useState, useEffect, useMemo } from "react";
import { Search, Download, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function RecentTransactions() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "time",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  // 🔹 Fetch data from API
  // useEffect(() => {
  //   const fetchSales = async () => {
  //     try {
  //       const res = await fetch("http://38.60.244.74:3000/approve");
  //       const data = await res.json();
  //       if (data.success && Array.isArray(data.data)) {
  //         // Ensure time is parsed into Date object
  //         const formatted = data.data.map((item) => ({
  //           ...item,
  //           time: new Date(item.time),
  //         }));
  //         setSales(formatted);
  //       } else {
  //         setSales([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching sales:", error);
  //       setSales([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchSales();
  // }, []);
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/approve");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((item) => ({
            ...item,
            time: new Date(item.time),
          }));
          setSales(formatted);
        } else {
          setSales([]);
        }
      } catch (error) {
        console.error("Error fetching sales:", error);
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch တစ်ခါ မူလမှာ
    fetchSales();

    // 500ms အကြိမ်ကြိမ် fetch
    const intervalId = setInterval(fetchSales, 500);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);


  // 🔹 Filtered Sales
  const filteredSales = useMemo(() => {
    return sales.filter(
      (s) =>
        s.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.userid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.seller?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.manager?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sales, searchTerm]);

  // Export EXCEL
  const handleExport = async () => {
    try {
      const res = await fetch("http://38.60.244.74:3000/approve");
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const exportData = data.data
          .filter((item) => {
            const text =
              `${item.fullname}  ${item.userid} ${item.seller} ${item.manager} ${item.type} ${item.price} ${item.status} ${item.method}`.toLowerCase();
            return searchTerm ? text.includes(searchTerm.toLowerCase()) : true;
          })
          .map((item, count) => ({
            ID: String(count + 1),
            UserID: item.userid,
            Name: item.fullname,
            Seller: item.seller || "-",
            Manager: item.manager || "-",
            Type: item.type,
            Gold: item.gold,
            Price: `${item.price.toLocaleString()} ကျပ်`,
            Date: new Date(item.created_at).toLocaleString(),
            Time: new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            Status: item.status,
          }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Approved_Transactions_today"
        );

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });

        saveAs(blob, "Approved_Transactions_today.xlsx");
      } else {
        alert("No data found to export.");
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  // 🔹 Sorting
  const sortedSales = useMemo(() => {
    const sortable = [...filteredSales];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal instanceof Date) aVal = aVal.getTime();
        if (bVal instanceof Date) bVal = bVal.getTime();
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredSales, sortConfig]);

  // 🔹 Pagination
  const totalPages = Math.ceil(sortedSales.length / rowsPerPage);
  const paginatedSales = sortedSales.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // 🔹 Sort click handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-yellow-400 animate-pulse">
        Loading approved transactions...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">
          {" "}
          Approved Transactions (Today){" "}
        </h3>
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
            onClick={handleExport}
            className="flex rounded-2xl items-center gap-1 text-xs px-2 py-1 border border-neutral-700 text-neutral-300 hover:text-white"
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
              { label: "Customer", key: "fullname" },
              { label: "Seller", key: "seller" },
              { label: "Manager", key: "manager" },
              { label: "Type", key: "type" },
              { label: "Gold", key: "gold" },
              { label: "Price", key: "price" },
              { label: "Time", key: "created_at" },

              { label: "Status", key: "status" },
            ].map((col) => (
              <th
                key={col.key}
                className="py-2 px-3 cursor-pointer select-none text-center"
                onClick={() => requestSort(col.key)}
              >
                <div className="flex items-center justify-center gap-1">
                  {col.label}
                  {sortConfig.key === col.key ? (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  ) : (
                    <ChevronUp size={14} className="opacity-30 rotate-180" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedSales.length === 0 ? (
            <tr className="h-[200px]">
              <td colSpan={9} className="text-center py-10 text-neutral-500">
                No approved transactions for today found.
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
                <td className="py-2 px-3 text-center">{s.seller || "-"}</td>
                <td className="py-2 px-3 text-center">{s.manager || "-"}</td>
                <td
                  className={`py-2 px-3 text-center capitalize font-semibold ${
                    s.type === "buy"
                      ? "text-green-400"
                      : s.type === "sell"
                      ? "text-red-400"
                      : s.type === "delivery"
                      ? "text-orange-400"
                      : "text-neutral-300"
                  }`}
                >
                  {s.type}
                </td>

                <td className="py-2 px-3 text-center">{s.gold}</td>

                {/* 🔹 Show dash for delivery type */}
                <td className="py-2 px-3 text-center">
                  {s.type === "delivery"
                    ? "-"
                    : `${s.price?.toLocaleString()} ကျပ်`}
                </td>

                <td className="py-2 px-3 text-center">
                  {s.created_at
                    ? new Date(s.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                    : "-"}
                </td>

                <td
                  className={`py-2 px-3 text-center capitalize font-semibold ${
                    s.status === "approved"
                      ? "text-emerald-400"
                      : s.status === "pending"
                      ? "text-yellow-400"
                      : "text-rose-400"
                  }`}
                >
                  {s.status}
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
  );
}
