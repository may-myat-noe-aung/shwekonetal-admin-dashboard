import React, { useState, useEffect } from "react";

export default function SecurityTab() {
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
  };

  const handleChangePasscode = async () => {
    if (!security.email || !security.passcode || !security.newPassword || !security.confirmPassword) {
      alert("Please fill all fields ❌");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      alert("Passcodes do not match ❌");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://38.60.244.74:3000/admin/passcode", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: security.email,
          newpasscode: security.newPassword,
          passcode: security.passcode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Passcode changed successfully!");
        handleCancelSecurity();
      } else {
        alert(`❌ Failed: ${data.message || "Invalid passcode"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
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
  };

  const handleChangePassword = async () => {
    if (!passwordData.email || !passwordData.password || !passwordData.confirmPassword || !passwordData.passcode) {
      alert("Please fill all fields ❌");
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    setLoadingPwd(true);
    try {
      const res = await fetch("http://38.60.244.74:3000/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: passwordData.email,
          password: passwordData.password,
          passcode: passwordData.passcode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Password changed successfully!");
        handleCancelPassword();
      } else {
        alert(`❌ Failed: ${data.message || "Invalid passcode"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    } finally {
      setLoadingPwd(false);
    }
  };

  // ======= UI =======
  return (
    <div>
      <h3 className="font-bold text-2xl mb-6 text-amber-400">Security Settings</h3>

      <div className="grid md:grid-cols-2 gap-10">
        {/* ===== LEFT: Change Passcode ===== */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Change Passcode</h4>

          <div className="max-w-md space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-neutral-400">Email</label>
              <input
                type="email"
                value={security.email}
                onChange={(e) => handleSecurityChange("email", e.target.value)}
                placeholder="Enter your account email"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* New Passcode */}
            <div>
              <label className="block text-sm mb-2 text-neutral-400">New Passcode</label>
              <input
                type="text"
                value={security.newPassword}
                onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                placeholder="Enter new passcode"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Confirm Passcode */}
            <div>
              <label className="block text-sm mb-2 text-neutral-400">Confirm Passcode</label>
              <input
                type="text"
                value={security.confirmPassword}
                onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                placeholder="Confirm new passcode"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Current Passcode */}
            <div>
              <label className="block text-sm mb-2 text-neutral-400">Current Passcode</label>
              <input
                type="text"
                value={security.passcode}
                onChange={(e) => handleSecurityChange("passcode", e.target.value)}
                placeholder="Enter current passcode"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancelSecurity}
                disabled={loading}
                className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePasscode}
                disabled={loading}
                className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm"
              >
                {loading ? "Updating..." : "Change Passcode"}
              </button>
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Change Password ===== */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Change Password</h4>

          <div className="max-w-md space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-neutral-400">Email</label>
              <input
                type="email"
                value={passwordData.email}
                onChange={(e) => handlePasswordChange("email", e.target.value)}
                placeholder="Enter your account email"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm mb-2 text-neutral-400">New Password</label>
              <input
                type="password"
                value={passwordData.password}
                onChange={(e) => handlePasswordChange("password", e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-2 text-neutral-400">Confirm Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Passcode */}
            <div>
              <label className="block text-sm mb-2 text-neutral-400">Verification Passcode</label>
              <input
                type="text"
                value={passwordData.passcode}
                onChange={(e) => handlePasswordChange("passcode", e.target.value)}
                placeholder="Enter your 6-digit passcode"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancelPassword}
                disabled={loadingPwd}
                className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loadingPwd}
                className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm"
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
