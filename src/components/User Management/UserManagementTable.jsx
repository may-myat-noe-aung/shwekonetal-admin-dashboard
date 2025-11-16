import React, { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Trash2,
  Eye,
  Users,
  ArrowUpRight,
  Filter,
  Shield,
  UserPlus,
  Download,
} from "lucide-react";
import SummaryCards from "./SummaryCards";
import UserDetailModal from "./UserDetailModal.jsx";
import UserConfirmTable from "./UserConfirmTable.jsx";
import AgentTable from "./AgentTable.jsx";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function UserTableWithSummary() {
  const [users, setUsers] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageWindow, setPageWindow] = useState(1); // sliding window
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [csvMessage, setCsvMessage] = useState("");
  const pageSize = 5;
  const pagesPerWindow = 5;

  const [previewPhoto, setPreviewPhoto] = useState(null);

  // --- API fetch after 500ms
  const [newUsersApiCount, setNewUsersApiCount] = useState(0); // ✅ New Users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/users");
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json(); // { new_users: 0, users: [...] }

        setNewUsersApiCount(data.new_users || 0);

        const filtered = (data.users || []).filter((u) =>
          ["approved", "pending"].includes(u.status?.toLowerCase())
        );

        setUsers(filtered);
      } catch (err) {
        console.error(err);
        alert("Cannot load users");
      }
    };

    // ပထမ fetch တစ်ခါ
    fetchUsers();

    // 500ms အကြိမ် fetch
    const intervalId = setInterval(fetchUsers, 500);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  // --- Summary counts
  const totalUsers = users.length;
  const approvedCount = users.filter((u) => u.status === "approved").length;
  const pendingCount = users.filter((u) => u.status === "pending").length;

  // --- Delete User
  const handleDelete = async (user) => {
    if (!user) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.fullname}?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://38.60.244.74:3000/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      alert(`${user.fullname} deleted ✅`);
      setViewUser(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user ❌");
    }
  };

  // --- Approve/Reject
  const handleAction = async (action, user) => {
    if (!user) return;
    try {
      const res = await fetch(`http://38.60.244.74:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: action } : u))
      );
      alert(`${user.fullname} ${action}d successfully ✅`);
      setViewUser(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update user ❌");
    }
  };

  const sendMessage = (user) => {
    alert(`Send message to ${user.fullname}`);
  };

  // --- Filtered Users (search + role + date)
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchesSearch = [
          u.fullname,
          u.email,
          u.id_type,
          u.agent ? u.agent : "Normal",
          u.id_number,
          u.phone,
          u.state,
          u.city,
          u.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesRole =
          roleFilter === "All"
            ? true
            : roleFilter === "Normal User"
            ? u.agent === null
            : roleFilter === "Agent User"
            ? u.agent !== null
            : true;

        return matchesSearch && matchesRole;
      })
      .filter((u) => {
        const dateObj = new Date(u.create_at);
        if (isNaN(dateObj.getTime())) return true; // skip invalid or missing dates
        const itemTime = dateObj.getTime();
        const fromTime = fromDate ? new Date(fromDate).getTime() : null;
        const toTime = toDate
          ? new Date(toDate).setHours(23, 59, 59, 999)
          : null; // include full day

        // ✅ Case 1: fromDate & toDate both exist → range
        if (fromTime && toTime) {
          return itemTime >= fromTime && itemTime <= toTime;
        }

        // ✅ Case 2: only one date → single day filter
        if (fromTime || toTime) {
          const singleDate = new Date(fromTime || toTime);
          const startOfDay = new Date(
            singleDate.setHours(0, 0, 0, 0)
          ).getTime();
          const endOfDay = new Date(
            singleDate.setHours(23, 59, 59, 999)
          ).getTime();
          return itemTime >= startOfDay && itemTime <= endOfDay;
        }

        // ✅ Case 3: no filter → show all
        return true;
      });
  }, [users, searchQuery, roleFilter, fromDate, toDate]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const startPage = (pageWindow - 1) * pagesPerWindow + 1;
  const endPage = Math.min(startPage + pagesPerWindow - 1, totalPages);
  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

  const StatusBadge = ({ status }) => {
    const colors = {
      approved: "bg-emerald-600 text-white",
      pending: "bg-yellow-600 text-white",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const handleExport = async () => {
    try {
      const res = await fetch("http://38.60.244.74:3000/users");
      const data = await res.json();

      if (!data.users || !Array.isArray(data.users)) {
        alert("No users found to export.");
        return;
      }

      // Only approved + pending
      const available = data.users.filter((u) =>
        ["approved"].includes(u.status?.toLowerCase())
      );

      // Apply frontend filters
      const filtered = available
        .filter((u) => {
          // Search (fullname, email, id_type, id_number)
          const text = `${u.fullname} ${u.agent} ${u.phone} ${
            u.agent ? u.agent : "Normal"
          } ${u.state} ${u.city} ${u.email} ${u.id_type} ${u.id_number} ${
            u.status
          }`.toLowerCase();

          const matchesSearch = searchQuery
            ? text.includes(searchQuery.toLowerCase())
            : true;

          // Role filter
          const matchesRole =
            roleFilter === "All"
              ? true
              : roleFilter === "Normal User"
              ? u.agent === null
              : roleFilter === "Agent User"
              ? u.agent !== null
              : true;

          return matchesSearch && matchesRole;
        })
        .filter((u) => {
          // Date filter
          const createdAt = new Date(u.create_at);
          if (isNaN(createdAt)) return true;

          const fromTime = fromDate
            ? new Date(fromDate).setHours(0, 0, 0, 0)
            : null;

          const toTime = toDate
            ? new Date(toDate).setHours(23, 59, 59, 999)
            : null;

          let matchesDate = false;

          if (fromTime && toTime) {
            matchesDate =
              createdAt.getTime() >= fromTime && createdAt.getTime() <= toTime;
          } else if (fromTime || toTime) {
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
            matchesDate = true;
          }

          return matchesDate;
        });

      if (filtered.length === 0) {
        alert("No matching users to export.");
        return;
      }

      // Convert to Excel format
      const exportData = filtered.map((item, count) => ({
        ID: String(count + 1),
        Agent: item.agent ? item.agent : "Normal",
        UserID: item.id,
        Name: item.fullname,
        Gender: item.gender,
        ID_Type: item.id_type,
        ID_Number: item.id_number,
        Email: item.email,
        Phone: item.phone,
        State: item.state,
        City: item.city,
        Address: item.address,
        Status: item.status,
        Date: new Date(item.create_at).toLocaleDateString(),
        Time: new Date(item.create_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, "Users.xlsx");
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export users ❌");
    }
  };

  return (
    <main className="bg-neutral-950 text-neutral-100 ">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Summary Section */}
        <SummaryCards
          total={totalUsers}
          approved={approvedCount}
          pending={pendingCount}
          newUsers={newUsersApiCount}
        />

        {/* Confirm Modal */}
        <UserConfirmTable
          viewUser={viewUser}
          onClose={() => setViewUser(null)}
          handleAction={handleAction}
        />

        <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg w-full">
          {/* Filters */}
          <div className="">
            <div className="">
              <div className="mb-4">
                {["All", "Normal User", "Agent User"].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRoleFilter(r);
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-full border border-neutral-700 text-sm mr-4 ${
                      roleFilter === r
                        ? "bg-yellow-500 text-black font-semibold"
                        : "text-yellow-400 hover:bg-neutral-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row justify-between mb-3 gap-3">
                <div className="flex gap-4 ">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-full bg-neutral-900 border border-neutral-500 px-3 py-1.5 text-sm w-full md:w-64"
                  />

                  <button
                    onClick={handleExport}
                    className="flex rounded-2xl items-center gap-1 text-xs px-2 py-1 border border-neutral-500 text-neutral-300 hover:text-white"
                  >
                    <Download size={14} /> Export
                  </button>
                </div>
                <div className="flex gap-4">
                  {/* Date Filters */}
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="rounded-full bg-yellow-600 text-neutral-900 px-3 py-1.5 text-sm"
                  />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="rounded-full bg-yellow-600 text-neutral-900 px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-[800px] md:min-w-full text-sm text-center border-collapse">
              <thead className="bg-neutral-900/80 border-b border-neutral-700">
                <tr className="text-white">
                  {[
                    "Photo",
                    "Full Name",
                    "Agent",
                    "ID Type",
                    "ID Number",
                    "Email",
                    "Phone",
                    "Date",
                    "State/City",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-2 py-2 text-xs md:text-sm whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-6 text-white/50 h-[150px]">
                      No users
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="px-1 py-2">
                        {u.photo ? (
                          <img
                            src={
                              u.photo.startsWith("http")
                                ? u.photo
                                : `http://38.60.244.74:3000/uploads/${u.photo}`
                            }
                            alt="Profile"
                            className="h-10 w-10 rounded-full mx-auto object-cover cursor-pointer"
                            onClick={() =>
                              setPreviewPhoto(
                                u.photo.startsWith("http")
                                  ? u.photo
                                  : `http://38.60.244.74:3000/uploads/${u.photo}`
                              )
                            }
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full mx-auto flex items-center justify-center bg-emerald-500 text-white font-semibold text-xs">
                            {u.fullname
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 4)}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2">{u.fullname}</td>
                      <td className="px-2 py-2 hidden md:table-cell">
                        {u.agent || "Normal"}
                      </td>
                      <td className="px-2 py-2 hidden md:table-cell">
                        {u.id_type}
                      </td>
                      <td className="px-2 py-2 break-words whitespace-normal hidden lg:table-cell">
                        {u.id_number}
                      </td>
                      <td className="px-2 py-2 break-words whitespace-normal hidden lg:table-cell">
                        {u.email}
                      </td>
                      <td className="px-2 py-2 hidden md:table-cell">
                        {u.phone}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {u.create_at
                          ? new Intl.DateTimeFormat("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }).format(new Date(u.create_at))
                          : "-"}
                      </td>
                      <td className="px-2 py-2 hidden md:table-cell">
                        {u.state} / {u.city}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => setViewUser(u)}
                          className="flex items-center gap-1 px-2 py-1 bg-sky-600 hover:bg-sky-700 rounded text-white text-xs md:text-sm"
                        >
                          <Eye className="h-4 w-4" /> view
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between px-4 py-2 text-sm text-neutral-400 gap-2 md:gap-0 mt-4">
              <p>
                Page {totalPages === 0 ? 0 : page} / {totalPages}
              </p>
              <div className="flex gap-2 flex-wrap">
                <button
                  disabled={page === 1}
                  onClick={() => {
                    const newPage = Math.max(1, page - 1);
                    setPage(newPage);
                    if (newPage < startPage)
                      setPageWindow(Math.max(1, pageWindow - 1));
                  }}
                  className={`px-3 py-1 rounded-md border border-neutral-700 ${
                    page === 1
                      ? "text-neutral-500 cursor-not-allowed"
                      : "text-yellow-400 hover:bg-neutral-900"
                  }`}
                >
                  Prev
                </button>

                {visiblePages.map((n) => (
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
                  onClick={() => {
                    const newPage = Math.min(totalPages, page + 1);
                    setPage(newPage);
                    if (newPage > endPage) setPageWindow(pageWindow + 1);
                  }}
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
        </div>

        {/* Details Modal */}
        <UserDetailModal
          viewUser={viewUser}
          onClose={() => setViewUser(null)}
          handleDelete={handleDelete}
          sendMessage={sendMessage}
        />

        <AgentTable />

        {/* Photo Preview Modal */}
        {previewPhoto && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="relative p-4 bg-neutral-900 rounded-xl">
              <button
                className="absolute top-2 right-2 text-white"
                onClick={() => setPreviewPhoto(null)}
              >
                ✕
              </button>
              <img
                src={previewPhoto}
                alt="Preview"
                className="max-h-[80vh] max-w-[80vw] rounded"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
