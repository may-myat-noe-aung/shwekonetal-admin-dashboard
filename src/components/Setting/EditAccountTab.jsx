import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function EditAccountTab() {
  const [accounts, setAccounts] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  const roles = ["owner", "manager", "seller"];

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const genderRefs = { male: useRef(null), female: useRef(null), other: useRef(null) };
  const roleRef = useRef(null);

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://38.60.244.74:3000/admin");
        if (res.data.success) {
          const order = { owner: 1, manager: 2, seller: 3 };
          const sorted = [...res.data.data].sort((a, b) => order[a.role] - order[b.role]);
          setAccounts(sorted);
          const firstOwner = sorted.find((a) => a.role === "owner");
          setSelectedEmail(firstOwner?.email || sorted[0]?.email || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  // Set selected account
  useEffect(() => {
    const acc = accounts.find((a) => a.email === selectedEmail);
    if (acc) {
      if (!["male", "female"].includes(acc.gender?.toLowerCase())) acc.gender = "other";
      setAccount(acc);
      setTimeout(() => nameRef.current?.focus(), 0);
    } else setAccount(null);
  }, [selectedEmail, accounts]);

  // Handle Enter key
  const handleEnter = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  // Open passcode modal
  const handleSaveClick = () => {
    if (!account) return;
    setShowModal(true);
  };

  // Cancel modal
  const cancelModal = () => {
    setShowModal(false);
    setPassword("");
  };

  // Submit passcode & update
  const handlePasswordSubmit = async () => {
    if (!password) {
      alert("Please enter passcode");
      return;
    }

    try {
      // Verify owner passcode
      const verify = await axios.post(
        "http://38.60.244.74:3000/admin/verify-owner-passcode",
        { passcode: password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!verify.data.success) {
        alert("Incorrect passcode!");
        return;
      }

      // If passcode is correct, update account
      setSaving(true);
      const formData = new FormData();
      formData.append("strid", account.id);
      formData.append("name", account.name);
      formData.append("email", account.email);
      formData.append("phone", account.phone);
      formData.append("gender", account.gender);
      formData.append("role", account.role);
      if (account.photo instanceof File) formData.append("photo", account.photo);
      else if (typeof account.photo === "string") formData.append("photo", account.photo);

      const res = await axios.put("http://38.60.244.74:3000/admin", formData);
      if (res.data.success) {
        alert("Account updated successfully ✅");
        setShowModal(false);
        setPassword("");
      } else {
        alert("Failed to update ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying passcode or updating account ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-neutral-400">Loading accounts...</p>;

  return (
    <div>
      <h3 className="font-bold text-2xl mb-6 text-amber-400">Edit Account</h3>

      {/* Email Select */}
      <div className="mb-6">
        <label className="block text-sm text-neutral-400 mb-2">Select Email:</label>
        <select
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-400"
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.email}>{a.email}</option>
          ))}
        </select>
      </div>

      {account && (
        <div>
          {/* Editable Form */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400 block mb-2">Name *</label>
                <input
                  type="text"
                  ref={nameRef}
                  value={account.name || ""}
                  onChange={(e) => setAccount({ ...account, name: e.target.value })}
                  onKeyDown={(e) => handleEnter(e, phoneRef)}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 block mb-2">Phone *</label>
                <input
                  type="text"
                  ref={phoneRef}
                  value={account.phone || ""}
                  onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                  onKeyDown={(e) => handleEnter(e, roleRef)}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400 block mb-2">Gender *</label>
                <div className="flex gap-4">
                  {["male", "female", "other"].map((g) => (
                    <label key={g} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        ref={genderRefs[g]}
                        checked={account.gender?.toLowerCase() === g}
                        onChange={() => setAccount({ ...account, gender: g })}
                        onKeyDown={(e) => handleEnter(e, roleRef)}
                        className="text-amber-400 focus:ring-amber-400"
                        required
                      />
                      <span className="text-neutral-300 text-sm">{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-400 block mb-2">Role *</label>
                <select
                  ref={roleRef}
                  value={account.role || ""}
                  onChange={(e) => setAccount({ ...account, role: e.target.value })}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-400"
                  required
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="col-span-2 flex gap-3 pt-4">
              <button
                onClick={() => setSelectedEmail("")}
                className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                disabled={saving}
                className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Passcode Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button onClick={cancelModal} className="absolute top-2 right-2 text-neutral-400 hover:text-white">
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">Enter Passcode to Update</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
            />
            <div className="flex justify-between">
              <button onClick={cancelModal} className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm">Cancel</button>
              <button onClick={handlePasswordSubmit} className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
