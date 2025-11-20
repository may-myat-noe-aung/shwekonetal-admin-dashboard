import React, { useState, useEffect } from "react";
import { Download, Shield, User } from "lucide-react";
import OverviewTab from "./OverviewTab";

export default function AdminSetting2() {
  const [activeTab, setActiveTab] = useState("overview");
  const [account, setAccount] = useState(null);

  const adminId = localStorage.getItem("adminId");

  // Fetch Admin Data
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

  return (
    <div className="bg-neutral-950 text-neutral-100 p-6 h-[85.5vh] mx-auto max-w-7xl flex flex-col justify-center items-center">
      <div className="grid grid-cols-4 gap-6 bg-neutral-900 rounded-2xl border border-neutral-800 p-8 shadow-md hover:shadow-lg transition-shadow duration-200">
        {/* Left Column - Profile */}
        <div className="col-span-1 flex flex-col items-center">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center">
            <h3 className="font-bold text-lg mb-4 text-amber-400">Profile</h3>
            {account ? (
              <>
                <div className="flex justify-center mb-6">
                  {account.photo ? (
                    <img
                      src={`http://38.60.244.74:3000/uploads/${
                        account.photo
                      }?t=${Date.now()}`}
                      alt={account.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-yellow-400 text-black font-semibold flex items-center justify-center text-xl border-2 border-yellow-400">
                      {account.name
                        ? account.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "NA"}
                    </div>
                  )}
                </div>

                <p className="font-semibold text-lg">
                  {account.name || "Admin"}
                </p>
                <p className="text-sm text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full mt-1">
                  {account.role || "owner"}
                </p>
              </>
            ) : (
              <p className="text-neutral-400">Loading profile...</p>
            )}
          </div>
        </div>

        {/* Right Column - Tabs */}
        <div className="col-span-3 bg-neutral-900 rounded-2xl border border-neutral-800 p-8 overflow-x-auto shadow-md hover:shadow-lg transition-shadow duration-200">
          {activeTab === "overview" && <OverviewTab account={account} />}
        </div>
      </div>
    </div>
  );
}
