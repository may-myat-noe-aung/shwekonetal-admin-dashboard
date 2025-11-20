import { useState, useEffect, useMemo } from "react";
import { Eye } from "lucide-react";
import ConfirmUserDetailModal from "./ConfirmUserDetailModal";
import { useAlert } from "../../AlertProvider";

export default function UserConfirmTable() {
  const [users, setUsers] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [pageWindow, setPageWindow] = useState(1);

  const { showAlert } = useAlert();

  // Show only pending users
  const pendingUsers = useMemo(
    () => users.filter((u) => u.status?.toLowerCase() === "pending"),
    [users]
  );

  const totalPages = Math.ceil(pendingUsers.length / perPage);
  const startPage = pageWindow;
  const endPage = Math.min(pageWindow + 4, totalPages);
  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

  // Paginated users
  const paginatedUsers = pendingUsers.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
       setUsers(data.users || []);

      } catch (err) {
        console.error("Error fetching users:", err);
        showAlert("users အချက်အလက်များကို load ဆွဲလို့မရပါ။ သင့် internet connection ကို စစ်ဆေးပါ", "warning");
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 500);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (type, user) => {
    try {
      const url = `http://38.60.244.74:3000/users/${type}/${user.id}`;
      const res = await fetch(url, { method: "PATCH" });
      if (!res.ok) throw new Error(`Failed to ${type} user`);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: type === "approve" ? "approved" : "rejected" }
            : u
        )
      );

      const data = await res.json();

      showAlert(data.message, "success");
    } catch (err) {
      console.error(err);
      const apiMessage =
      err.response?.data?.message || err.response?.data?.error || "Something went wrong";
      showAlert(apiMessage, "error");
    }
  };

  return (
    <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">User Confirm</h2>

      <div className="overflow-x-hidden">
        <table className="min-w-full text-sm text-left text-white/80">
          <thead className="border-b border-neutral-600 text-white">
            <tr>
              {[
                "Photo",
                "Full Name",
                "Agent",
                  "ID Type",
                  "ID Number",
                  "Email",
                  "Phone",
                  "State/City",
                  "Status",
                  "Actions",
              ].map((h) => (
                <th key={h} className="px-3 py-2 text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-white/50 h-[150px]">
                  No pending users
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-3 py-2 text-center">
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

                  <td className="px-3 py-2 text-center">{u.fullname}</td>
                  <td className="px-3 py-2 text-center">{u.agent || "Normal"}</td>
                  <td className="px-3 py-2 text-center">{u.id_type}</td>
                  <td className="px-3 py-2 text-center">{u.id_number}</td>
                  <td className="px-3 py-2 text-center">{u.email}</td>
                  <td className="px-3 py-2 text-center">{u.phone}</td>
                  <td className="px-3 py-2 text-center">{u.state} / {u.city}</td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        u.status?.toLowerCase() === "pending"
                          ? "bg-yellow-500 text-white"
                          : u.status?.toLowerCase() === "approved"
                          ? "bg-emerald-600"
                          : "bg-rose-600"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setViewUser(u)}
                        className="flex items-center gap-1 px-2 py-1 bg-sky-600 hover:bg-sky-700 rounded text-white text-sm"
                      >
                        <Eye size={14} /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between px-4 py-2 text-sm text-neutral-400 gap-2 md:gap-0 mt-4">
          <p>Page {totalPages === 0 ? 0 : page} / {totalPages}</p>
          <div className="flex gap-2 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => {
                const newPage = Math.max(1, page - 1);
                setPage(newPage);
                if (newPage < startPage) setPageWindow(Math.max(1, pageWindow - 1));
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

      {/* Detail Modal */}
      {viewUser && (
        <ConfirmUserDetailModal
          viewUser={viewUser}
          handleAction={handleAction}
          previewPhoto={previewPhoto}
          setPreviewPhoto={setPreviewPhoto}
          onClose={() => setViewUser(null)}
        />
      )}
    </div>
  );
}
