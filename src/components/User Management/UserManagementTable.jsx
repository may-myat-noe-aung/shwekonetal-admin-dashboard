

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
  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const res = await fetch("http://38.60.244.74:3000/users");
          if (!res.ok) throw new Error("Failed to fetch users");
          const data = await res.json();
          const filtered = data.filter((u) =>
            ["approved", "rejected"].includes(u.status?.toLowerCase())
          );
          setUsers(filtered);
        } catch (err) {
          console.error(err);
          alert("Cannot load users");
        }
      };
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  // --- Summary counts
  const totalUsers = users.length;
  const approvedCount = users.filter((u) => u.status === "approved").length;
  const rejectedCount = users.filter((u) => u.status === "rejected").length;
  const today = new Date().toISOString().slice(0, 10);
  const newUsersCount = users.filter(
    (u) => u.createdAt && u.createdAt.slice(0, 10) === today
  ).length;

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
        const matchesSearch = [u.fullname, u.email, u.id_type, u.id_number]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "All" ? true : u.role === roleFilter;
        return matchesSearch && matchesRole;
      })
      .filter((u) => {
        const createdAt = u.create_at; // ✅ use real field name from your API
        if (!createdAt) return false;

        // convert backend date to YYYY-MM-DD
        const dateOnly = new Date(createdAt).toISOString().slice(0, 10);

        if (fromDate && dateOnly < fromDate) return false;
        if (toDate && dateOnly > toDate) return false;
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
      rejected: "bg-rose-600 text-white",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <main className="bg-neutral-950 text-neutral-100 ">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Summary Section */}
        <SummaryCards
          total={totalUsers}
          approved={approvedCount}
          rejected={rejectedCount}
          newUsers={newUsersCount}
        />

        {/* Filters */}
        <div>
          <div className="">
            <div className="mb-4">
              {["All", "Normal", "Promotor"].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRoleFilter(r);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-full border border-neutral-700 text-sm ${
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
                  className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm w-full md:w-64"
                />

                <button className="flex rounded-2xl items-center gap-1 text-xs px-2 py-1 border border-neutral-700 text-neutral-300 hover:text-white">
                  <Download size={14} /> Export CSV
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
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="min-w-[800px] md:min-w-full text-sm text-center">
            <thead className="bg-neutral-900/80">
              <tr className="text-white">
                {[
                  "Photo",
                  "Full Name",
                  "ID Type",
                  "ID Number",
                  "Email",
                  "Phone",
                  "State/City",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-3 py-2 ">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-white/50 h-[150px]">
                    No users
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-neutral-900/50 transition-colors"
                  >
                    <td className="px-3 py-2">
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
                    <td className="px-3 py-2">{u.fullname}</td>
                    <td className="px-3 py-2">{u.id_type}</td>
                    <td className="px-3 py-2 break-words whitespace-normal">
                      {u.id_number}
                    </td>
                    <td className="px-3 py-2 break-words whitespace-normal">
                      {u.email}
                    </td>
                    <td className="px-3 py-2">{u.phone}</td>
                    <td className="px-3 py-2 break-words whitespace-normal">
                      {u.state} / {u.city}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => setViewUser(u)}
                        className="flex items-center gap-1 px-2 py-1 bg-sky-600 hover:bg-sky-700 rounded text-white text-sm"
                      >
                        <Eye className="h-4 w-4 " /> view
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Sliding Window */}
          <div className="flex flex-col md:flex-row justify-between px-4 py-2 text-sm text-neutral-400 gap-2 md:gap-0">
            <p>
              Page {totalPages === 0 ? 0 : page} / {pageWindow}
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

        {/* Details Modal */}
        <UserDetailModal
          viewUser={viewUser}
          onClose={() => setViewUser(null)}
          handleDelete={handleDelete}
          sendMessage={sendMessage}
        />

        {/* Confirm Modal */}
        <UserConfirmTable
          viewUser={viewUser}
          onClose={() => setViewUser(null)}
          handleAction={handleAction}
        />

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
