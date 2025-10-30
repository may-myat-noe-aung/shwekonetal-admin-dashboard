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
} from "lucide-react";
import UserConfirmTable from "./UserConfirmSection";

export default function UserTableWithSummary() {
  const [users, setUsers] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        // Only approved or rejected
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
  }, []);

  // Summary counts
  const totalUsers = users.length;
  const approvedCount = users.filter((u) => u.status === "approved").length;
  const rejectedCount = users.filter((u) => u.status === "rejected").length;

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.fullname}?`)) return;
    try {
      await fetch(`http://38.60.244.74:3000/users/${user.id}`, {
        method: "DELETE",
      });
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      alert(`${user.fullname} deleted ✅`);
      setViewUser(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user ❌");
    }
  };

  const sendMessage = (user) => {
    alert(`Send message to ${user.fullname}`);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = [u.fullname, u.email, u.id_type, u.id_number]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" ? true : u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // --- Components ---
  const clsx = (...xs) => xs.filter(Boolean).join(" ");

  const SummaryCard = ({ title, value, icon, accent }) => (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div
        className={
          "pointer-events-none absolute inset-0 bg-gradient-to-br " +
          (accent || "from-yellow-500/10 to-transparent")
        }
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-400 mb-1">{title}</p>
          <p className="text-xl font-semibold text-yellow-300">{value}</p>
        </div>
        <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-yellow-400">
          {icon}
        </div>
      </div>
    </div>
  );

  const RoleBadge = ({ role }) => {
    let label = role;
    let colorClass = "bg-neutral-700 text-white";
    if (role === "Admin") colorClass = "bg-yellow-600 text-white";
    else if (role === "Promotor") colorClass = "bg-indigo-600 text-white";
    else if (typeof role === "string" && role.startsWith("P"))
      colorClass = "bg-purple-600 text-white";
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
        {label}
      </span>
    );
  };

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
    <main className="bg-neutral-950 text-neutral-100 h-full">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Summary Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Users"
            value={totalUsers}
            icon={<Users className="h-5 w-5" />}
            accent="from-sky-500/20 to-transparent"
          />
          <SummaryCard
            title="Approved"
            value={approvedCount}
            icon={<ArrowUpRight className="h-5 w-5" />}
            accent="from-emerald-500/20 to-transparent"
          />
          <SummaryCard
            title="Rejected"
            value={rejectedCount}
            icon={<Filter className="h-5 w-5" />}
            accent="from-rose-500/20 to-transparent"
          />
          <SummaryCard
            title="New Users"
            value="+"
            icon={<UserPlus className="h-5 w-5" />}
            accent="from-indigo-500/20 to-transparent"
          />
        </section>

        {/* User Table */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="flex flex-col md:flex-row justify-between mb-3 gap-3">
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
            <div className="flex gap-2">
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
          </div>

          <div className="overflow-auto rounded-xl border border-neutral-800">
            <table className="min-w-full text-sm text-center">
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
                    <th key={h} className="px-3 py-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-white/50">
                      No users
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-neutral-900/50 transition-colors "
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
                            className="h-10 w-10 rounded-full mx-auto object-cover"
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
                      <td className="px-3 py-2">{u.id_number}</td>
                      <td className="px-3 py-2">{u.email}</td>
                      <td className="px-3 py-2">{u.phone}</td>
                      <td className="px-3 py-2">
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

            {/* Pagination */}
            <div className="flex justify-between px-4 py-2 text-sm text-neutral-400">
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
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
                  )
                )}
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
        </div>

        {/* Details Modal */}
        {viewUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-neutral-900 rounded-2xl shadow-2xl p-6 w-[520px] relative">
              <button
                onClick={() => setViewUser(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white text-lg font-bold"
              >
                ✖
              </button>
              <div className="flex flex-col items-center mb-5">
                {viewUser.photo ? (
                  <img
                    src={
                      viewUser.photo.startsWith("http")
                        ? viewUser.photo
                        : `http://38.60.244.74:3000/uploads/${viewUser.photo}`
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl mb-3">
                    {viewUser.fullname
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 3)}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">
                  {viewUser.fullname}
                </h3>
                <p className="text-white/60 text-sm">{viewUser.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-white/80 text-sm mb-6">
                <div>
                  <p className="text-xs text-white/50">ID Type</p>
                  {viewUser.id_type}
                </div>
                <div>
                  <p className="text-xs text-white/50">ID Number</p>
                  {viewUser.id_number}
                </div>
                <div>
                  <p className="text-xs text-white/50">Phone</p>
                  {viewUser.phone}
                </div>
                <div>
                  <p className="text-xs text-white/50">State / City</p>
                  {viewUser.state} / {viewUser.city}
                </div>
                <div>
                  <p className="text-xs text-white/50">Address</p>
                  {viewUser.address}
                </div>
                <div>
                  <p className="text-xs text-white/50">Status</p>
                  <StatusBadge status={viewUser.status} />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => sendMessage(viewUser)}
                  className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium"
                >
                  Message <Mail size={14} />
                </button>
                <button
                  onClick={() => handleDelete(viewUser)}
                  className="flex items-center gap-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-white text-sm font-medium"
                >
                  Delete <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
        {/*        {/* User Confirm Table */}
        <UserConfirmTable />
      </div>
    </main>
  );
}
