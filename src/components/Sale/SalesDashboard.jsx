import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Users,
  Wallet,
  PieChart as PieChartIcon,
  Download,
  ChevronUp,
  ChevronDown,
  Info,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_URL = "http://38.60.244.74:3000/sales";

// --- Summary Card Component ---
function SummaryCard({ title, value, sub, icon, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div
        className={
          "pointer-events-none absolute inset-0 bg-gradient-to-br " + accent
        }
      />
      <div className="flex items-center justify-between relative z-0">
        <div>
          <p className="text-sm text-neutral-400 mb-2">{title}</p>
          <p className="text-lg font-semibold mb-1">{value}</p>
          <p className="text-xs text-neutral-500">{sub}</p>
        </div>
        <div className="p-2 rounded-lg bg-neutral-800 text-yellow-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

const SalesDashboard = () => {
  // --- States ---
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [page, setPage] = useState(1); // current page
  const [rowsPerPage] = useState(10); // rows per page

  // --- Sales Trend Chart State ---
  const [chartData, setChartData] = useState([]);

  // --- Fetch Real API Data ---
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((item, i) => ({
            id: item.id || `TXN_${i}`,
            userid: item.userid || "-",
            fullname: item.fullname || "-",
            payment_name: item.payment_name || "-",
            payment_phone: item.payment_phone || "-",
            method: item.method || "-",
            type: item.type || "sell",
            gold: parseFloat(item.gold || 0),
            price: parseInt(item.price || 0),
            status: item.status || "pending",
            photos:
              item.photos && item.photos.length
                ? item.photos
                : [
                    "/images/default1.jpg",
                    "/images/default2.jpg",
                    "/images/default3.jpg",
                    "/images/default4.jpg",
                    "/images/default5.jpg",
                    "/images/default6.jpg",
                  ],
            date: item.created_at
              ? new Date(item.created_at)
              : new Date(Date.now() - i * 3600 * 1000),
          }));
          setSales(mapped);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  // --- Fetch Chart Data for Sales Trend ---
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch(
          "http://38.60.244.74:3000/sales/gold-times-today"
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setChartData(json.data);
        } else {
          console.error("Invalid chart data structure:", json);
        }
      } catch (err) {
        console.error("Failed to load chart data:", err);
      }
    };

    fetchChartData();
  }, []);

  //   useEffect(() => {
  //   if (page > totalPages) setPage(totalPages || 1);
  // }, [page, totalPages]);

  // --- Filtered Sales based on search ---
  const filteredSales = useMemo(() => {
    return sales.filter(
      (s) =>
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.userid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || // customer name
        s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sales, searchTerm]);

  // --- Sorted Sales (filtered first) ---
  const sortedSales = useMemo(() => {
    const sortable = [...filteredSales];
if (sortConfig.key) {
  sortable.sort((a, b) => {
    let aVal, bVal;

    // ✅ Special case: sorting by time only
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

  // --- Derived Data (Summary + Charts) ---
  const totalGold = useMemo(
    () => sales.reduce((sum, s) => sum + (s.gold || 0), 0),
    [sales]
  );
  const totalPrice = useMemo(
    () => sales.reduce((sum, s) => sum + (s.price || 0), 0),
    [sales]
  );
  const totalApproved = sales.filter(
    (s) => s.status.toLowerCase() === "approved"
  ).length;

  const statusCounts = useMemo(() => {
    const counts = { approved: 0, pending: 0, rejected: 0 };
    sales.forEach((s) => {
      const status = s.status?.toLowerCase();
      if (counts[status] !== undefined) counts[status]++;
    });
    return counts;
  }, [sales]);

  const pieData = [
    { name: "Approved", value: statusCounts.approved },
    { name: "Pending", value: statusCounts.pending },
    { name: "Rejected", value: statusCounts.rejected },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  const totalPages = Math.ceil(sortedSales.length / rowsPerPage);

  // Slice sales for current page
  const paginatedSales = sortedSales.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // --- CSV Export ---
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

  // --- Status Update (local only) ---
  const updateStatus = (id, newStatus) => {
    setSales((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: newStatus.toLowerCase() } : s
      )
    );
  };

  // --- Sorting Function ---
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  // --- Loading/Error UI ---
  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Loading sales data...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        {error}
      </div>
    );

  // --- UI ---
  return (
    <div className=" bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Gold Weight"
            value={`${totalGold.toFixed(2)} g`}
            sub="Total gold sold"
            icon={<BarChart3 size={20} />}
            accent="from-yellow-600/10 to-yellow-400/5"
          />
          <SummaryCard
            title="Total Transactions"
            value={sales.length}
            sub="All recorded transactions"
            icon={<Users size={20} />}
            accent="from-blue-600/10 to-blue-400/5"
          />
          <SummaryCard
            title="Total Sale Amount"
            value={`${totalPrice.toLocaleString()} Ks`}
            sub="Gross sales"
            icon={<Wallet size={20} />}
            accent="from-green-600/10 to-green-400/5"
          />
          <SummaryCard
            title="Total Approved"
            value={totalApproved}
            sub="All Approved Orders"
            icon={<PieChartIcon size={20} />}
            accent="from-purple-600/10 to-purple-400/5"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h3 className="text-xl font-semibold mb-3">
              Sales Trend (Gold / Hr)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#52525b" />
                <YAxis stroke="#52525b" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#171717", border: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#eab308"
                  fill="#eab30830"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-1 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h3 className="text-xl font-semibold mb-3">Transaction Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#eab308",
                    border: "none",
                    borderRadius: "10px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table with Sorting & Details */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
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

          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500">
                {[
                  { label: "User ID", key: "userid" },
                  { label: "Customer Name", key: "fullname" },
                  { label: "Type", key: "type" },
                  { label: "Gold", key: "gold" },
                  { label: "Price", key: "price" },
                  { label: "Date", key: "date" }, // Date only
                  { label: "Time", key: "time" }, // Time only
                  { label: "Payment", key: "payment" },
                  { label: "Status", key: "status" },
                  { label: "Details", key: "details" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="text-left py-2 px-3 cursor-pointer select-none"
                    onClick={() =>
                      col.key !== "details" && requestSort(col.key)
                    }
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
            <tbody className="h-[500px]">
              {paginatedSales.length === 0 ? (
                <tr>
                  <td
                    colSpan={9} // number of table columns
                    className="text-center py-10 text-neutral-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginatedSales.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <td className="py-2 px-3">{s.userid}</td>
                    <td className="py-2 px-3">{s.fullname}</td>
                    <td className="py-2 px-3 capitalize">{s.type}</td>
                    <td className="py-2 px-3">{s.gold}</td>
                    <td className="py-2 px-3">{s.price.toLocaleString()} Ks</td>
                    <td className="py-2 px-3">{s.date.toLocaleDateString()}</td>
                    <td className="py-2 px-3">{s.date.toLocaleTimeString()}</td>

                    <td className="py-2 px-3 capitalize">{s.method}</td>
                    <td className="py-2 px-3 capitalize">{s.status}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => setSelectedTxn(s)}
                        className="flex items-center gap-1 px-2 py-1 text-xs border border-neutral-700 rounded-md hover:bg-neutral-800"
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

        {/* --- Popup Card --- */}
        {selectedTxn && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-lg relative">
              {/* Header */}
              <button
                onClick={() => {
                  setSelectedTxn(null);
                  setActionTaken("none");
                  setShowPasscode(false);
                  setPasscode("");
                }}
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold mb-4 text-yellow-400">
                {selectedTxn.id}
              </h2>

              {/* Details */}
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
                  {selectedTxn.type || "-"}
                </p>
                <p>
                  <span className="text-neutral-400">ကျပ် ပဲ ရွေး -</span>{" "}
                  {selectedTxn.gold}
                </p>
                <p>
                  <span className="text-neutral-400">Amount -</span>{" "}
                  {selectedTxn.price.toLocaleString()} Ks
                </p>
                <p>
                  <span className="text-neutral-400">Payment Method -</span>{" "}
                  {selectedTxn.method || "-"}
                </p>
                <p>
                  <span className="text-neutral-400">Status -</span>{" "}
                  {selectedTxn.status || "-"}
                </p>
                <p>
                  <span className="text-neutral-400">Date -</span>{" "}
                  {selectedTxn.date.toLocaleDateString()}
                </p>
                <p>
                  <span className="text-neutral-400">Time -</span>{" "}
                  {selectedTxn.date.toLocaleTimeString()}
                </p>

                {/* Show extra fields if type = sell */}
                {selectedTxn.type === "sell" && (
                  <>
                    <p>
                      <span className="text-neutral-400">Payment Name -</span>{" "}
                      {selectedTxn.payment_name || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Payment Phone -</span>{" "}
                      {selectedTxn.payment_phone || "-"}
                    </p>
                  </>
                )}
              </div>

              {/* Photos (only if NOT sell) */}
              {selectedTxn.type !== "sell" && (
                <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                  {selectedTxn.photos?.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Photo ${idx + 1}`}
                      onClick={() => setPreviewImg(url)}
                      className="cursor-pointer rounded-lg border border-neutral-700 hover:scale-105 transition w-36 h-48 object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                {selectedTxn.status !== "approved" &&
                  selectedTxn.status !== "rejected" && (
                    <>
                      <button
                        onClick={() => setShowPasscode({ type: "approve" })}
                        className={`px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-sm ${
                          actionTaken !== "none"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
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
                    </>
                  )}

                <button
                  onClick={() => navigate("/chat")}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm"
                >
                  💬 Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Passcode Modal --- */}
        {showPasscode && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-[320px] text-center">
              <h3 className="text-yellow-400 font-semibold mb-4">
                Enter Passcode
              </h3>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••"
                className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-center tracking-widest text-lg mb-4"
              />
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setShowPasscode(false);
                    setPasscode("");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (passcode !== "1234") return alert("❌ Wrong passcode!");

                    try {
                      const type = showPasscode.type;
                      setActionTaken(type);
                      const url =
                        type === "approve"
                          ? `http://38.60.244.74:3000/sales/approve/${selectedTxn.id}`
                          : `http://38.60.244.74:3000/sales/reject/${selectedTxn.id}`;

                      const res = await fetch(url, { method: "PATCH" });
                      if (!res.ok) throw new Error("Request failed");

                      updateStatus(
                        selectedTxn.id,
                        type === "approve" ? "approved" : "rejected"
                      );

                      alert(
                        type === "approve"
                          ? "✅ Transaction approved successfully!"
                          : "🚫 Transaction rejected successfully!"
                      );
                    } catch (err) {
                      console.error(err);
                      alert("❌ Failed to process transaction");
                    } finally {
                      setShowPasscode(false);
                      setPasscode("");
                      setActionTaken("none");
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Preview Modal --- */}
        {previewImg && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
            <div className="relative w-screen h-screen flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => setPreviewImg(null)}
                className="absolute top-4 right-6 text-white text-4xl font-bold z-50 hover:scale-110 transition"
              >
                ✕
              </button>

              {/* Image */}
              <img
                src={previewImg}
                alt="Preview"
                className="min-w-[15vw] min-h-[15vh] object-contain rounded-2xl shadow-2xl scale-[1.45] transition-transform duration-300"
              />
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
    </div>
  );
};

export default SalesDashboard;
