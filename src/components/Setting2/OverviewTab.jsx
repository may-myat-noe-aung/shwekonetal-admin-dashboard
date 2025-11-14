import React, { useEffect, useState } from "react";

export default function OverviewTab() {
  const [account, setAccount] = useState(null);
  const adminId = localStorage.getItem("adminId");

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

  if (!account) {
    return <p className="text-neutral-400">Loading personal information...</p>;
  }

  return (
    <div className="">
      <h3 className="font-bold text-xl mb-6 text-amber-400">Personal Information</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 block mb-2">Name</label>
            <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
              <p className="font-medium text-sm">{account.name}</p>
            </div>
          </div>
          <div>
            <label className="text-sm text-neutral-400 block mb-2">Email Address</label>
            <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
              <p className="font-medium text-sm">{account.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 block mb-2">Mobile Number</label>
            <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
              <p className="font-medium text-sm">{account.phone}</p>
            </div>
          </div>
          <div>
            <label className="text-sm text-neutral-400 block mb-2">Gender</label>
            <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
              <p className="font-medium text-sm">{account.gender}</p>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
}
