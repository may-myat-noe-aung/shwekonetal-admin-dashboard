
import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAlert } from "../../AlertProvider";



export default function ChangePasswordForm({ email }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOwnerPasscodePassword, setShowOwnerPasscodePassword] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    email: email || "",
    passcode: "",
    password: "",
    confirmPassword: "",
  });

  const [loadingPwd, setLoadingPwd] = useState(false);
  const [emails, setEmails] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(); // container reference

  const { showAlert } = useAlert(); 

  // Fetch emails
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/admin");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const sorted = json.data
            .filter((item) => item.email && item.role)
            .sort((a, b) => {
              const order = { owner: 0, manager: 1, seller: 2 };
              return (
                (order[a.role.toLowerCase()] ?? 99) -
                (order[b.role.toLowerCase()] ?? 99)
              );
            });
          setEmails(sorted);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    if (email) setPasswordData((prev) => ({ ...prev, email }));
  }, [email]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleEnterFocusNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = e.currentTarget
        .closest("form,div")
        ?.querySelectorAll("input, select");
      const inputs = Array.from(next);
      const index = inputs.indexOf(e.currentTarget);

      if (inputs[index + 1]) {
        // Move to next input if exists
        inputs[index + 1].focus();
      } else {
        // Last input → trigger Change Password button
        handleChangePassword();
      }
    }
  };

  const handleChangePassword = async () => {
    const { email, password, confirmPassword, passcode } = passwordData;

    // Front-end validation: password match
    if (password !== confirmPassword) {
      return showAlert("New password နှင့် confirm password သည် ကိုက်ညီမှု မရှိပါ");
    }

    // Front-end validation: strong password
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return showAlert(
        "Password သည် အနည်းဆုံး 8 လုံးရှိရမည်၊ Uppercase, Lowercase, Number, Special Character ပါဝင်ရမည်"
      );
    }

    setLoadingPwd(true);

    try {
      const res = await fetch("http://38.60.244.74:3000/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, passcode }),
      });

      // SAFE JSON PARSE
      const data = await res.json().catch(() => ({}));

         // ❗ ALWAYS show API message first
      const apiMsg = data.message || data.error;

      // ❗ Show API error message (wrong passcode, missing fields, etc.)
      if (!res.ok) {
        showAlert(apiMsg || "Something went wrong", "error");
        setLoadingPwd(false);
        return;
      }

         // SUCCESS message
      if (apiMsg) showAlert(apiMsg, "success");

      if (data.success) handleCancelPassword();

      // SUCCESS
      // showAlert(data.message || "Password updated ✔");
      // handleCancelPassword();
    } catch (err) {
      console.error(err);
      showAlert("Network error (Server unreachable)", "error");
    } finally {
      setLoadingPwd(false);
    }
  };

  // Handle keyboard navigation for email dropdown

  return (
    <div className="w-full">
      <h4 className="text-lg font-semibold mb-4">Change Password</h4>
      <div className="space-y-5 w-full">
        {/* Custom Email Dropdown */}
        <div className="w-full relative" ref={dropdownRef}>
          <label className="block text-sm mb-2 text-neutral-400">Email</label>
          <div
            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm cursor-pointer focus:outline-none focus:border-yellow-400"
            onClick={() => setDropdownOpen((prev) => !prev)}
            tabIndex={0}
          >
            {passwordData.email || "Select account email"}
          </div>
          {dropdownOpen && (
            <ul className="absolute z-50 w-full max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-lg mt-1 scrollbar-none text-white">
              {emails.map((admin, index) => (
                <li
                  key={admin.id}
                  className="px-3 py-2 cursor-pointer hover:bg-amber-400 hover:text-black"
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                  onClick={() => {
                    handlePasswordChange("email", admin.email);
                    setDropdownOpen(false);
                    setHighlightedIndex(-1);
                  }}
                >
                  {admin.email}
                </li>
              ))}
            </ul>
          )}
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
              onChange={(e) => handlePasswordChange("password", e.target.value)}
              onKeyDown={handleEnterFocusNext}
              placeholder="Enter new password"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
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
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
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
              onChange={(e) => handlePasswordChange("passcode", e.target.value)}
              onKeyDown={handleEnterFocusNext}
              placeholder="Enter owner passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
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
            className="rounded-lg bg-yellow-400 text-black px-5 py-2 hover:bg-yellow-500 transition-colors font-medium text-sm w-full sm:w-auto"
          >
            {loadingPwd ? "Updating..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
