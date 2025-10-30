import React, { useState, useEffect, useMemo } from "react";
import { Check, X, Eye, MessageCircle } from "lucide-react";

export default function UserConfirmTable() {
  const [users, setUsers] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [passcode, setPasscode] = useState("");

  // ✅ Fetch real users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Cannot load user data ❌");
      }
    };

    fetchUsers();
  }, []);

  // ✅ Only show pending users
  const pendingUsers = useMemo(
    () => users.filter((u) => u.status?.toLowerCase() === "pending"),
    [users]
  );

  const handleAction = (type, user) => {
    setActionType(type);
    setViewUser(user);
    setPasscode("");
    setShowPasscodeModal(true);
  };

  // const confirmAction = async () => {
  //   if (passcode === "1234") {
  //     try {
  //       const updatedStatus =
  //         actionType === "approve" ? "approved" : "rejected";

  //       // ✅ Update API
  //       await fetch(`http://38.60.244.74:3000/users/${viewUser.id}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ ...viewUser, status: updatedStatus }),
  //       });

  //       // ✅ Update UI
  //       setUsers((prev) =>
  //         prev.map((u) =>
  //           u.id === viewUser.id ? { ...u, status: updatedStatus } : u
  //         )
  //       );

  //       alert(
  //         `${viewUser.fullname} ${
  //           actionType === "approve" ? "approved ✅" : "rejected ❌"
  //         }`
  //       );

  //       setShowPasscodeModal(false);
  //       setViewUser(null);
  //     } catch (err) {
  //       console.error("Update failed:", err);
  //       alert("Failed to update user ❌");
  //     }
  //   } else {
  //     alert("Incorrect passcode ❌");
  //   }
  // };

  const confirmAction = async () => {
  if (passcode !== "1234") {
    alert("Incorrect passcode ❌");
    return;
  }

  try {
    if (actionType === "approve") {
      // PATCH request to approve endpoint
      const res = await fetch(
        `http://38.60.244.74:3000/users/approve/${viewUser.id}`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Failed to approve user");
    } else if (actionType === "reject") {
      // PATCH request to reject endpoint (if exists)
      const res = await fetch(
        `http://38.60.244.74:3000/users/reject/${viewUser.id}`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Failed to reject user");
    }

    // Update UI
    setUsers((prev) =>
      prev.map((u) =>
        u.id === viewUser.id
          ? { ...u, status: actionType === "approve" ? "approved" : "rejected" }
          : u
      )
    );

    alert(
      `${viewUser.fullname} ${
        actionType === "approve" ? "approved ✅" : "rejected ❌"
      }`
    );

    setShowPasscodeModal(false);
    setViewUser(null);
  } catch (err) {
    console.error(err);
    alert("Action failed ❌");
  }
};

  return (
    <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">User Confirm</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-white/80">
          <thead className="bg-neutral-800/70 text-white">
            <tr>
              {[
                "Photo",
                "Full Name",
                "ID Type",
                "ID Number",
                "Email",
                "Phone",
                "State/City",
                "Status",
                "Actions",
              ].map((h) => (
                <th key={h} className="px-3 py-2 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-white/50">
                  No pending users
                </td>
              </tr>
            ) : (
              pendingUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-neutral-800/50 transition-colors"
                >
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
                      <div className="h-10 w-10 rounded-full mx-auto flex items-center justify-center bg-emerald-500 text-white font-semibold text-xs  ">
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
                  <td className="px-3 py-2 text-center">{u.id_type}</td>
                  <td className="px-3 py-2 text-center">{u.id_number}</td>
                  <td className="px-3 py-2 text-center">{u.email}</td>
                  <td className="px-3 py-2 text-center">{u.phone}</td>
                  <td className="px-3 py-2 text-center">
                    {u.state} / {u.city}
                  </td>
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
                    <div className=" flex justify-center gap-2">
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
      </div>

      {/* Detail Modal */}
      {viewUser && !showPasscodeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-neutral-900 rounded-2xl shadow-2xl p-6 w-[520px] relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setViewUser(null)}
              className="absolute top-3 right-3 text-white/70 hover:text-white text-lg font-bold"
            >
              ✖
            </button>

            {/* Header Section */}
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

            {/* ID Photos */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-neutral-800/70 p-2 rounded-lg">
                <img
                  src={
                    viewUser.id_front_photo
                      ? viewUser.id_front_photo.startsWith("http")
                        ? viewUser.id_front_photo
                        : `http://38.60.244.74:3000/uploads/${viewUser.id_front_photo}`
                      : "https://via.placeholder.com/200x120?text=Front+ID"
                  }
                  alt="Front ID"
                  className="w-full h-32 object-cover rounded-md"
                />
                <p className="text-center text-white/70 text-xs mt-1">
                  မှတ်ပုံတင် အရှေ့ဘက်
                </p>
              </div>
              <div className="bg-neutral-800/70 p-2 rounded-lg">
                <img
                  src={
                    viewUser.id_back_photo
                      ? viewUser.id_back_photo.startsWith("http")
                        ? viewUser.id_back_photo
                        : `http://38.60.244.74:3000/uploads/${viewUser.id_back_photo}`
                      : "https://via.placeholder.com/200x120?text=Back+ID"
                  }
                  alt="Back ID"
                  className="w-full h-32 object-cover rounded-md"
                />
                <p className="text-center text-white/70 text-xs mt-1">
                  မှတ်ပုံတင် အနောက်ဘက်
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-white/80 text-sm mb-6">
              <div className="mb-4">
                <p className="text-white/500 mb-2 text-xs">ID Type</p>
                <p>{viewUser.id_type}</p>
              </div>
              <div className="mb-4">
                <p className="text-white/500 mb-2 text-xs">ID Number</p>
                <p>{viewUser.id_number}</p>
              </div>
              <div className="mb-4">
                <p className="text-white/500 mb-2 text-xs">Phone</p>
                <p>{viewUser.phone}</p>
              </div>
              <div className="mb-4">
                <p className="text-white/500 mb-2 text-xs">State / City</p>
                <p>
                  {viewUser.state} / {viewUser.city}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-white/500 mb-2 text-xs">Address</p>
                <p>{viewUser.address}</p>
              </div>
              <div className="mb-4">
                <p className="text-white/500 mb-2 text-xs">Status</p>
                <span
                  className={`px-3 py-1 rounded-full  text-xs ${
                    viewUser.status?.toLowerCase() === "pending"
                      ? "bg-yellow-500 text-white"
                      : viewUser.status?.toLowerCase() === "approved"
                      ? "bg-emerald-600"
                      : "bg-rose-600"
                  }`}
                >
                  {viewUser.status}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mx-8 gap-4">
              <button
                onClick={() => handleAction("reject", viewUser)}
                className="flex items-center gap-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-white text-sm font-medium"
              >
              Reject  <X size={14} /> 
              </button>
              <button
                onClick={() => handleAction("approve", viewUser)}
                className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium"
              >
                Approve <Check size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Passcode Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-80 text-center shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Enter Passcode
            </h3>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode..."
              className="w-full p-2 rounded bg-neutral-800 text-white text-center mb-4 focus:outline-none"
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white text-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPasscodeModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}