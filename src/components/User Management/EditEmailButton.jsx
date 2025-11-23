import React, { useState } from "react";
import { Edit, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAlert } from "../../AlertProvider";

export default function EditEmailButton({ user }) {
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user.email || "");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showAlert } = useAlert();

const handlePasscodeSubmit = async () => {
  if (!passcode) {
    showAlert("Passcode ထည့်ပေးပါ", "warning");
    return;
  }

  try {
    // 1️⃣ Verify admin passcode
    const verifyRes = await axios.post(
      "http://38.60.244.74:3000/admin/verify-admin-passcode",
      { passcode }
    );

    // 2️⃣ Change user email
    const changeRes = await axios.patch(
      `http://38.60.244.74:3000/change-email/${user.id}`,
      {
        email: newEmail,
        password: adminPassword,
      }
    );

    showAlert(changeRes.data?.message || "Email changed successfully", "success");

    // ✅ Clear input values after success
    setNewEmail("");
    setAdminPassword("");
    setPasscode("");

    // Close popups
    setShowPasscode(false);
    setShowEditEmail(false);

  } catch (error) {
    const apiMessage =
    error.response?.data?.message || error.response?.data?.error || "Something went wrong";
    showAlert(apiMessage, "error");
  }
};

  return (
    <>
      {/* Edit Email Button */}
      <button
        onClick={() => setShowEditEmail(true)}
        className="flex items-center gap-1 px-2 py-1 bg-sky-600 hover:bg-sky-700 rounded text-white text-xs md:text-sm"
      >
        <Edit className="h-4 w-4" /> Email
      </button>

      {/* --- Edit Email Popup --- */}
      {showEditEmail && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          onClick={() => setShowEditEmail(false)}
        >
          <div
            className="bg-neutral-900 rounded-2xl shadow-2xl p-6 w-80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-center text-white mb-4">
              Change User Email
            </h3>

            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              autoFocus
              placeholder="Enter new email"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-3"
            />
{/* Original password input */}
<div className="relative mb-4">
  <input
    type={showPassword ? "text" : "password"} // toggle type
    value={adminPassword}
    onChange={(e) => setAdminPassword(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") setShowPasscode(true);
    }}
    placeholder="Enter user password"
    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm pr-10"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
  >
    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
  </button>
</div>


            <button
              onClick={() => setShowPasscode(true)}
              className="w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold"
            >
              Change Email
            </button>
          </div>
        </div>
      )}

      {/* --- Passcode Popup --- */}
      {showPasscode && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          onClick={() => setShowPasscode(false)}
        >
          <div
            className="bg-neutral-900 rounded-2xl shadow-2xl p-6 w-80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-center text-white mb-2">
              Enter Passcode
            </h3>

            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePasscodeSubmit();
              }}
            />

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setShowPasscode(false)}
                className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePasscodeSubmit}
                className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
