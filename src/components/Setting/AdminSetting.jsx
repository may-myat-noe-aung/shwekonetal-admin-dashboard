

  import React, { useState, useEffect } from "react";
import { X, Bell, ShieldCheck, User, SunMoon, Download, Shield } from "lucide-react";
import CreateAccount from "./CreateAccount"; 
import SecurityTab from "./SecurityTab";
import OverviewTab from "./OverviewTab";
import EditAccountTab from "./EditAccountTab";
import ManagerSellerList from "./ManagerSellerList";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("overview");
  const [account, setAccount] = useState(null);

  const [quickActions] = useState([
    { icon: <Shield className="h-4 w-4" />, label: "Security", action:"security" },
    { icon: <User className="h-4 w-4" />, label: "Register New Account", action: "create" },
  ]);

  const adminId = localStorage.getItem("adminId");

useEffect(() => {
  if (!adminId) return;

  // Fetch function
  const fetchAdmin = () => {
    fetch(`http://38.60.244.74:3000/admin/${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setAccount(data.data[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch admin data:", err));
  };

  // First fetch immediately
  fetchAdmin();

  // Live update every 500ms
  const interval = setInterval(fetchAdmin, 500);

  // Cleanup when component unmount
  return () => clearInterval(interval);

}, [adminId]);


  return (
    <div className="bg-neutral-950 text-neutral-100 p-4  md:h-[100vh]  mx-auto max-w-7xl overflow-hidden">
      
      {/* Horizontal Tabs */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 mb-6">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { key: "overview", label: "Overview", icon: <User className="h-4 w-4" /> },
            { key: "edit", label: "Edit Account", icon: <User className="h-4 w-4" /> },
            { key: "security", label: "Security", icon: <ShieldCheck className="h-4 w-4" /> },
            { key: "create", label: "Register Account", icon: <User className="h-4 w-4" /> },
            { key: "managerSellerList", label: "Manager & Seller List", icon: <User className="h-4 w-4" /> },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 rounded-xl text-sm md:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === item.key
                  ? "bg-amber-400 text-black"
                  : "text-neutral-300 hover:bg-amber-500/20 hover:text-amber-300"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
            <h3 className="font-bold text-lg mb-4 text-center text-amber-400">Profile</h3>
            <div className="flex flex-col items-center text-center">
              {account ? (
                <>
                  <img
                    src={
                      account.photo
                        ? `http://38.60.244.74:3000/uploads/${account.photo}`
                        : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
                    }
                    alt="Profile"
                    className="rounded-full w-20 h-20 object-cover mb-3 border-2 border-amber-400"
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

          {/* Quick Actions */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
            <h3 className="font-bold text-lg mb-4 text-amber-400">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => action.action && setActiveTab(action.action)}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-amber-500/20 hover:text-amber-300 transition-colors text-neutral-300 text-sm"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 md:col-span-3 bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
          {activeTab === "overview" && <OverviewTab account={account} />}
          {activeTab === "edit" && <EditAccountTab account={account} setAccount={setAccount} />}
          
          {/* ✅ Clean — No Props Passed */}
          {activeTab === "security" && <SecurityTab />}

          {activeTab === "create" && <CreateAccount />}
          {activeTab === "managerSellerList" && <ManagerSellerList />}
        </div>
      </div>
    </div>
  );
}
