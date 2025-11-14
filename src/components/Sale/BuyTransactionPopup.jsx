import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const BuyTransactionPopup = ({ txn, close, setPreviewImg, updateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAction = async (action) => {
    if (!txn?.id) return;
    setLoading(true);
    setError(null);

    try {
      const url =
        action === "approve"
          ? `http://38.60.244.74:3000/sales/approve/${txn.id}`
          : `http://38.60.244.74:3000/sales/reject/${txn.id}`;

      // ✅ Removed adminData & passcode — only empty body sent
      const body = {};

      const res = await axios.patch(url, body, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        updateStatus(txn.id, action);
        close();
      } else {
        setError(res.data.error || "Failed to update transaction.");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError(
        err.response?.data?.error || "Error occurred while updating transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-96 relative">
        <button
          onClick={close}
          className="absolute top-2 right-2 text-neutral-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Transaction Details
        </h2>

        {/* Transaction Info */}
        <div className="space-y-2 text-sm text-neutral-300">
          <p><strong>User ID:</strong> {txn.userid}</p>
          <p><strong>Name:</strong> {txn.fullname}</p>
          <p><strong>Gold:</strong> {txn.gold}</p>
          <p><strong>Price:</strong> {txn.price.toLocaleString()} ကျပ်</p>
          <p><strong>Payment Method:</strong> {txn.method}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                txn.status === "approved"
                  ? "text-emerald-400"
                  : txn.status === "pending"
                  ? "text-yellow-400"
                  : "text-rose-400"
              }`}
            >
              {txn.status}
            </span>
          </p>
          <p><strong>Date:</strong> {new Date(txn.date).toLocaleDateString("en-GB")}</p>
          <p><strong>Time:</strong> {new Date(txn.date).toLocaleTimeString()}</p>

          {txn.photos && txn.photos.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {txn.photos.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`txn-${i}`}
                  className="h-16 w-16 object-cover rounded cursor-pointer"
                  onClick={() => setPreviewImg(p)}
                />
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-red-400 text-sm font-medium">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-4 justify-end">
          <button
            onClick={() => handleAction("approve")}
            disabled={loading || txn.status === "approved"}
            className="px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium"
          >
            Transfer
          </button>
          <button
            onClick={() => handleAction("reject")}
            disabled={loading || txn.status === "rejected"}
            className="px-3 py-1 rounded-full bg-rose-500 hover:bg-rose-400 text-black font-medium"
          >
            Reject
          </button>
          <button
            onClick={() => alert(`Send message to ${txn.userid}`)}
            className="px-3 py-1 rounded-full bg-yellow-600 hover:bg-yellow-500 text-black font-medium"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyTransactionPopup;
