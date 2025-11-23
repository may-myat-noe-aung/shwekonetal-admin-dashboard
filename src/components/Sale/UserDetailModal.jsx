import React, { useState, useEffect } from "react";

export default function UserDetailModal({ viewUser, onClose }) {
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [user, setUser] = useState(null);

  const getPhotoUrl = (photo, placeholder) => {
    if (!photo) return placeholder;
    return photo.startsWith("http")
      ? photo
      : `http://38.60.244.74:3000/uploads/${photo}`;
  };

  const getStatusClasses = (status) => {
    if (!status) return "bg-gray-500 text-white";
    const s = status.toLowerCase();
    return s === "pending"
      ? "bg-yellow-500 text-white"
      : s === "approved"
      ? "bg-emerald-600 text-white"
      : "bg-rose-600 text-white";
  };

  useEffect(() => {
    if (!viewUser) {
      setUser(null);
      return;
    }

    const isString =
      typeof viewUser === "string" || typeof viewUser === "number";
    const userId = isString
      ? String(viewUser)
      : viewUser?.id
      ? String(viewUser.id)
      : null;
    const initialData =
      !isString && typeof viewUser === "object" ? viewUser : null;

    if (initialData) setUser(initialData);
    if (!userId) return;

    let cancelled = false;

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://38.60.244.74:3000/users/${userId}`);
        if (!res.ok) {
          console.error("Failed to fetch user:", res.status);
          return;
        }
        const data = await res.json();
        const fetched = data?.data ?? data;
        if (!cancelled) setUser(fetched);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    // fetch immediately
    fetchUser();
    // set interval to fetch every 500ms
    const intervalId = setInterval(fetchUser, 500);

    // cleanup on unmount
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [viewUser]);

  if (!user) return null;

  return (
    <>
      {/* Modal Background */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
        <div className="bg-neutral-900 rounded-2xl shadow-2xl p-6 w-[520px] relative animate-fadeIn">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white text-lg font-bold"
          >
            ✖
          </button>

          {/* Header */}
          <div className="flex flex-col items-center mb-5">
            {user.photo ? (
              <img
                src={getPhotoUrl(user.photo, "https://via.placeholder.com/80")}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 mb-3 cursor-pointer"
                onClick={() =>
                  setPreviewPhoto(
                    getPhotoUrl(user.photo, "https://via.placeholder.com/80")
                  )
                }
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl mb-3">
                {String(user.fullname || "")
                  .split(" ")
                  .map((n) => (n ? n[0] : ""))
                  .join("")
                  .toUpperCase()
                  .slice(0, 3)}
              </div>
            )}
            <div className="flex flex-row items-center">
              <h3 className="text-lg font-semibold text-white mr-2">
                {user.fullname}
              </h3>
              <p className="text-white/60 text-sm">({user.gender})</p>
            </div>
            <p className="text-white/60 text-sm">{user.email}</p>
          </div>

          {/* ID Photos */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div
              className="bg-neutral-800/70 p-2 rounded-lg cursor-pointer"
              onClick={() =>
                setPreviewPhoto(
                  getPhotoUrl(
                    user.id_front_photo,
                    "https://via.placeholder.com/200x120?text=Front+ID"
                  )
                )
              }
            >
              <img
                src={
                  user.id_front_photo
                    ? getPhotoUrl(user.id_front_photo)
                    : "https://via.placeholder.com/200x120?text=Front+ID"
                }
                alt="Front ID"
                className="w-full h-32 object-cover rounded-md"
              />
              <p className="text-center text-white/70 text-xs mt-1">
                မှတ်ပုံတင် အရှေ့ဘက်
              </p>
            </div>

            <div
              className="bg-neutral-800/70 p-2 rounded-lg cursor-pointer"
              onClick={() =>
                setPreviewPhoto(
                  getPhotoUrl(
                    user.id_back_photo,
                    "https://via.placeholder.com/200x120?text=Back+ID"
                  )
                )
              }
            >
              <img
                src={
                  user.id_back_photo
                    ? getPhotoUrl(user.id_back_photo)
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
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-white/80 text-sm">
            {[
              { label: "ID Type", value: user.id_type },
              { label: "ID Number", value: user.id_number },
              { label: "Gold", value: user.goldString },
              { label: "Member Point", value: user.member_point },
              { label: "Level", value: user.level },
              { label: "Agent", value: user.agent || "Normal" },
              { label: "Phone", value: user.phone },
              {
                label: "State / City",
                value: `${user.state || "-"} / ${user.city || "-"}`,
              },
              { label: "Address", value: user.address },
              {
                label: "Status",
                value: (
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusClasses(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-white/500 mb-2 text-xs">{item.label}</p>
                <p>{item.value ?? "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
    </>
  );
}
