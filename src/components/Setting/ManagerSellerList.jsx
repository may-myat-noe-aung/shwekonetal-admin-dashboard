import React, { useEffect, useState } from "react";

export default function ManagerSellerList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://38.60.244.74:3000/admin");
        const data = await res.json();
        if (data.success) {
          // Only show managers & sellers
          const filtered = data.data.filter((a) => a.role !== "owner");
          setAccounts(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this account?")) return;

  try {
    // Call your DELETE API
    const res = await fetch(`http://38.60.244.74:3000/admin/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      // Remove account from state so table updates
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      alert("Account deleted successfully ✅");
    } else {
      alert("Failed to delete account ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Error deleting account ❌");
  }
};


  if (loading) return <p className="text-neutral-400">Loading...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm table-auto">
        <thead>
          <tr className="border-b border-neutral-800 text-neutral-500 text-center">
            <th className="py-2 px-3">Photo</th>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Email</th>
            <th className="py-2 px-3">Role</th>
            <th className="py-2 px-3">Phone</th>
            <th className="py-2 px-3">Gender</th>
            <th className="py-2 px-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr
              key={a.id}
              className="border-b border-neutral-800 hover:bg-neutral-800/50 text-center"
            >
              <td className="py-2 px-3">
                {a.photo ? (
                  <img
                    src={`http://38.60.244.74:3000/uploads/${a.photo}`}
                    alt={a.name}
                    className="w-10 h-10 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-semibold flex items-center justify-center mx-auto">
                    {a.name
                      ? a.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "NA"}
                  </div>
                )}
              </td>
              <td className="py-2 px-3">{a.name}</td>
              <td className="py-2 px-3">{a.email}</td>
              <td className="py-2 px-3">{a.role}</td>
              <td className="py-2 px-3">{a.phone || "-"}</td>
              <td className="py-2 px-3">{a.gender || "-"}</td>
              <td className="py-2 px-3">
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-400 hover:text-red-600 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
