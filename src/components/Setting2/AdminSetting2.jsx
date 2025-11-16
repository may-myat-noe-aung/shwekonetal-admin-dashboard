import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  ShieldCheck,
  User,
  SunMoon,
  Download,
  Shield,
} from "lucide-react";
import OverviewTab from "./OverviewTab";
import CreateAccount from "../Setting/CreateAccount";
import SecurityTab from "../Setting/SecurityTab";
import EditAccountTab from "../Setting/EditAccountTab";
import ManagerSellerList from "../Setting/ManagerSellerList";

export default function AdminSetting2() {
  const [activeTab, setActiveTab] = useState("overview");
  const [account, setAccount] = useState(null); // fetched admin data
  const [security, setSecurity] = useState({
    email: "",
    passcode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [quickActions] = useState([
    { icon: <Download className="h-4 w-4" />, label: "Export Data" },
    { icon: <Shield className="h-4 w-4" />, label: "Change Passcode" },
    {
      icon: <User className="h-4 w-4" />,
      label: "Register New Account",
      action: "create",
    },
  ]);

  const adminId = localStorage.getItem("adminId");

  // ---------------- Fetch Admin Data ----------------
  useEffect(() => {
    if (!adminId) return;

    fetch(`http://38.60.244.74:3000/admin/${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setAccount(data.data[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch admin data:", err));
  }, [adminId]);

  const handleSecurityChange = (field, value) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerifyPasscode = () => {
    if (security.passcode === "123456") {
      setSecurity((prev) => ({ ...prev, isVerified: true }));
    } else {
      alert("Invalid passcode ❌");
    }
  };

  const handleCancelSecurity = () => {
    setSecurity({
      email: "",
      currentPassword: "",
      passcode: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleChangePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Passcode changed successfully ✅");
  };

  // ---------------- Main Return ----------------
  return (
<div className="bg-neutral-950 text-neutral-100 p-6 h-[85.5vh] mx-auto max-w-7xl  flex flex-col justify-center item-center">
  {/* Main Content */}
  <div className="grid grid-cols-4 gap-6 bg-neutral-900 rounded-2xl border border-neutral-800 p-8 shadow-md hover:shadow-lg transition-shadow duration-200">
    {/* Left Column - Profile + Quick Actions */}
    <div className="col-span-1 space-y-6">
      {/* Profile Card */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
        <h3 className="font-bold text-lg mb-4 text-center text-amber-400">
          Profile
        </h3>
        <div className="flex flex-col items-center text-center">
          {account ? (
            <>
              <img
                src={
                  account.photo
                    ? `http://38.60.244.74:3000/uploads/${account.photo}`
                    : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFByb2ZpbGV8ZW58MHx8MH"
                }
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover mb-3 border-2 border-amber-400 shadow-sm"
              />
              <p className="font-semibold text-lg">{account.name || "Admin"}</p>
              <p className="text-sm text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full mt-1">
                {account.role || "owner"}
              </p>
            </>
          ) : (
            <p className="text-neutral-400">Loading profile...</p>
          )}
        </div>
      </div>
    </div>

    {/* Right Column - Tabs */}
    <div className="col-span-3 bg-neutral-900 rounded-2xl border border-neutral-800 p-8 overflow-x-auto shadow-md hover:shadow-lg transition-shadow duration-200">
      {activeTab === "overview" && <OverviewTab account={account} />}
      {activeTab === "edit" && (
        <EditAccountTab account={account} setAccount={setAccount} />
      )}
      {activeTab === "security" && (
        <SecurityTab
          security={security}
          handleSecurityChange={handleSecurityChange}
          handleVerifyPasscode={handleVerifyPasscode}
          handleCancelSecurity={handleCancelSecurity}
          handleChangePassword={handleChangePassword}
        />
      )}
      {activeTab === "create" && <CreateAccount />}
      {activeTab === "managerSellerList" && <ManagerSellerList />}
    </div>
  </div>
</div>

  );
}
