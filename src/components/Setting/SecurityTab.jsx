import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SecurityTab() {
  // ======= Eye toggles =======
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOwnerPasscodeSecurity, setShowOwnerPasscodeSecurity] =
    useState(false);
  const [showOwnerPasscodePassword, setShowOwnerPasscodePassword] =
    useState(false);

  // ======= State =======
  const [security, setSecurity] = useState({
    email: "",
    passcode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordData, setPasswordData] = useState({
    email: "",
    passcode: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);

  const [message, setMessage] = useState(""); // API success/error message

  // Auto fill email from localStorage
  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail");
    if (adminEmail) {
      setSecurity((prev) => ({ ...prev, email: adminEmail }));
      setPasswordData((prev) => ({ ...prev, email: adminEmail }));
    }
  }, []);

  // ======= Change Passcode =======
  const handleSecurityChange = (field, value) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelSecurity = () => {
    setSecurity({
      email: "",
      passcode: "",
      newPassword: "",
      confirmPassword: "",
    });
    setMessage("");
  };

// ======= Change Passcode =======
const handleChangePasscode = async () => {
  // Optional: only check required fields
  if (!security.email || !security.passcode || !security.newPassword || !security.confirmPassword) {
    return alert("Please fill all fields ❌");
  }

  setLoading(true);
  try {
    const res = await fetch("http://38.60.244.74:3000/admin/passcode", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: security.email,
        newpasscode: security.newPassword,
        confirmPassword: security.confirmPassword, // send confirmPassword to API
        passcode: security.passcode,
      }),
    });
    const data = await res.json();
    alert(`${data.success ? "✅" : "❌"} ${data.message || "Something went wrong"}`);
    if (data.success) handleCancelSecurity();
  } catch (err) {
    console.error(err);
    alert("❌ Something went wrong");
  } finally {
    setLoading(false);
  }
};

// ======= Change Password =======
const handleChangePassword = async () => {
  if (!passwordData.email || !passwordData.password || !passwordData.confirmPassword || !passwordData.passcode) {
    return alert("Please fill all fields ❌");
  }

  setLoadingPwd(true);
  try {
    const res = await fetch("http://38.60.244.74:3000/admin/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: passwordData.email,
        password: passwordData.password,
        confirmPassword: passwordData.confirmPassword, // send confirmPassword to API
        passcode: passwordData.passcode,
      }),
    });
    const data = await res.json();
    alert(`${data.success ? "✅" : "❌"} ${data.message || "Something went wrong"}`);
    if (data.success) handleCancelPassword();
  } catch (err) {
    console.error(err);
    alert("❌ Something went wrong");
  } finally {
    setLoadingPwd(false);
  }
};





  // ======= Change Password =======
  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelPassword = () => {
    setPasswordData({
      email: "",
      passcode: "",
      password: "",
      confirmPassword: "",
    });
    setMessage("");
  };



  // ======= Helper: move to next input =======
  const handleEnterFocusNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = e.currentTarget
        .closest("form,div")
        ?.querySelectorAll("input");
      const inputs = Array.from(next);
      const index = inputs.indexOf(e.currentTarget);
      if (inputs[index + 1]) inputs[index + 1].focus();
    }
  };

  // ======= UI =======
  return (
    <div className="">
      <h3 className="font-bold text-xl mb-6 text-amber-400 text-center md:text-left">
        Security Settings
      </h3>

      {message && (
        <div className="mb-4 text-sm font-medium text-center md:text-left">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* ===== LEFT: Change Passcode ===== */}
        <div className="w-full">
          <h4 className="text-lg font-semibold mb-4">Change Passcode</h4>
          <div className="space-y-5 w-full">
            {/* Email */}
            <div className="w-full">
              <label className="block text-sm mb-2 text-neutral-400">
                Email
              </label>
              <input
                type="email"
                autoFocus
                value={security.email}
                onChange={(e) => handleSecurityChange("email", e.target.value)}
                onKeyDown={handleEnterFocusNext}
                placeholder="Enter account email"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* New Passcode */}
            <div className="w-full">
              <label className="block text-sm mb-2 text-neutral-400">
                New Passcode
              </label>
              <div className="relative">
                <input
                  type={showNewPasscode ? "text" : "password"}
                  value={security.newPassword}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    handleSecurityChange("newPassword", val);
                  }}
                  onKeyDown={handleEnterFocusNext}
                  placeholder="Enter new passcode"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
                  onClick={() => setShowNewPasscode(!showNewPasscode)}
                >
                  {showNewPasscode ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </span>
              </div>
              {/* <small className="text-neutral-500 text-xs">6 digits only</small> */}
            </div>

            {/* Confirm Passcode */}
            <div className="w-full">
              <label className="block text-sm mb-2 text-neutral-400">
                Confirm Passcode
              </label>
              <div className="relative">
                <input
                  type={showConfirmPasscode ? "text" : "password"}
                  value={security.confirmPassword}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    handleSecurityChange("confirmPassword", val);
                  }}
                  onKeyDown={handleEnterFocusNext}
                  placeholder="Confirm new passcode"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
                  onClick={() => setShowConfirmPasscode(!showConfirmPasscode)}
                >
                  {showConfirmPasscode ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </span>
              </div>
              {/* <small className="text-neutral-500 text-xs">6 digits only</small> */}
            </div>

            {/* Owner Passcode */}
            <div className="w-full">
              <label className="block text-sm mb-2 text-neutral-400">
                Owner Passcode
              </label>
              <div className="relative">
                <input
                  type={showOwnerPasscodeSecurity ? "text" : "password"}
                  value={security.passcode}
                  onChange={(e) =>
                    handleSecurityChange("passcode", e.target.value)
                  }
                  onKeyDown={handleEnterFocusNext}
                  placeholder="Enter owner passcode"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
                  onClick={() =>
                    setShowOwnerPasscodeSecurity(!showOwnerPasscodeSecurity)
                  }
                >
                  {showOwnerPasscodeSecurity ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleCancelSecurity}
                disabled={loading}
                className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePasscode}
                disabled={loading}
                className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm w-full sm:w-auto"
              >
                {loading ? "Updating..." : "Change Passcode"}
              </button>
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Change Password ===== */}
        <div className="w-full">
          <h4 className="text-lg font-semibold mb-4">Change Password</h4>
          <div className="space-y-5 w-full">
            {/* Email */}
            <div className="w-full">
              <label className="block text-sm mb-2 text-neutral-400">
                Email
              </label>
              <input
                type="email"
                value={passwordData.email}
                onChange={(e) => handlePasswordChange("email", e.target.value)}
                onKeyDown={handleEnterFocusNext}
                placeholder="Enter account email"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* New Password */}
            <div className="w-full">
              <label className="block text-sm mb-2 text-neutral-400">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.password}
                  onChange={(e) =>
                    handlePasswordChange("password", e.target.value)
                  }
                  onKeyDown={handleEnterFocusNext}
                  placeholder="Enter new password"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </span>
              </div>
              {/* <small className="text-neutral-500 text-xs">
                Strong password: min 8 chars, uppercase, lowercase, number,
                special
              </small> */}
            </div>

            {/* Confirm Password */}
            <div className="w-full">
              <label className="block text-sm mb-2 text-neutral-400">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  onKeyDown={handleEnterFocusNext}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Owner Passcode */}
            <div className="w-full">
              <label className="block text-sm mb-2 text-neutral-400">
                Owner Passcode
              </label>
              <div className="relative">
                <input
                  type={showOwnerPasscodePassword ? "text" : "password"}
                  value={passwordData.passcode}
                  onChange={(e) =>
                    handlePasswordChange("passcode", e.target.value)
                  }
                  onKeyDown={handleEnterFocusNext}
                  placeholder="Enter owner passcode"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-400"
                  onClick={() =>
                    setShowOwnerPasscodePassword(!showOwnerPasscodePassword)
                  }
                >
                  {showOwnerPasscodePassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleCancelPassword}
                disabled={loadingPwd}
                className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loadingPwd}
                className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm w-full sm:w-auto"
              >
                {loadingPwd ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
