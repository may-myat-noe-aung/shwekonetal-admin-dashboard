import MiniChat from "./MiniChat";
import React, { useState, useEffect, useRef } from "react";

export default function TransactionPopup({
  txn,
  close,
  setPreviewImg,
  actionTaken,
  setActionTaken,
  updateStatus,
  navigate,
}) {
  const [previewImg, setLocalPreviewImg] = useState(null);
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  const [deliveryFee, setDeliveryFee] = useState(txn.deliveryFee || "");
  const [serviceFee, setServiceFee] = useState(txn.serviceFee || "");
  const [showChat, setShowChat] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const isPending = txn.status === "pending";

  const adminId = localStorage.getItem("adminId");

  // --- Fetch admin data (same way as Header) ---
  useEffect(() => {
    if (!adminId) return;
    fetch(`http://38.60.244.74:3000/admin/${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setAdminData(data.data[0]);
        }
      })
      .catch(() => {});
  }, [adminId]);

  const handleConfirm = async () => {
    if (!adminData) return alert("❌ Admin data not loaded yet.");

    try {
      // verify passcode
      const verifyRes = await fetch(
        "http://38.60.244.74:3000/admin/verify-admin-passcode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode }),
        }
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return alert("❌ " + (verifyData.message || "Invalid passcode!"));
      }

      const type = showPasscode.type;
      setActionTaken(type);

      const url =
        type === "approve"
          ? `http://38.60.244.74:3000/sales/approve/${txn.id}`
          : `http://38.60.244.74:3000/sales/reject/${txn.id}`;

      let body = {
        seller: adminData.name,
        manager: passcode,
      };

      // Only include fees for delivery + approve
      if (txn.type === "delivery" && type === "approve") {
        if (!deliveryFee || !serviceFee) {
          return alert("❌ Delivery Fee and Service Fee are required!");
        }
        body = {
          ...body,
          deli_fees: deliveryFee,
          service_fees: serviceFee,
        };
      }

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Request failed");

      updateStatus(txn.id, type === "approve" ? "approved" : "rejected");

      alert(
        type === "approve"
          ? " Transaction approved successfully!"
          : " Transaction rejected successfully!"
      );
    } catch {
      alert("❌ Failed to process transaction");
    } finally {
      setShowPasscode(false);
      setPasscode("");
      setActionTaken("none");
    }
  };

  const deliveryFeeRef = useRef(null);

  useEffect(() => {
    if (txn.type === "delivery" && txn.status === "pending") {
      deliveryFeeRef.current?.focus();
    }
  }, [txn]);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-lg relative">
          <button
            onClick={close}
            className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-200"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold mb-4 text-white">
            {txn.fullname}
          </h2>

          {/* --- BUY TRANSACTION --- */}
          {txn.type === "buy" && (
            <div className="bg-green-900/20 p-4 rounded-xl mb-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
                <p>
                  <span className="text-neutral-400">Full Name -</span>{" "}
                  {txn.fullname || "-"}
                </p>
                <p>
                  <span className="text-neutral-400">User ID -</span>{" "}
                  {txn.userid || "-"}
                </p>
                <p>
                  <span className="text-neutral-400">Type -</span>{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded-full ${
                      txn.type === "buy"
                        ? "text-green-400 bg-green-900/20"
                        : "text-neutral-300 bg-neutral-800/20"
                    }`}
                  >
                    {txn.type || "-"}
                  </span>
                </p>

                <p>
                  <span className="text-neutral-400">ကျပ် ပဲ ရွေး -</span>{" "}
                  {txn.gold}
                </p>
                <p>
                  <span className="text-neutral-400">Amount -</span>{" "}
                  {txn.price?.toLocaleString()} Ks
                </p>
                <p>
                  <span className="text-neutral-400">Payment Method -</span>{" "}
                  {txn.method || "-"}
                </p>

                <p>
                  <span className="text-neutral-400">
                    Date -{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(txn.date || txn.created_at))}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-400">Time -</span>{" "}
                  {txn.date ? new Date(txn.date).toLocaleTimeString() : "-"}
                </p>

                <p>
                  <span className="text-neutral-400">Status -</span>{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded-full ${
                      txn.status === "approved"
                        ? "text-emerald-400 bg-emerald-900/20"
                        : txn.status === "pending"
                        ? "text-yellow-400 bg-yellow-900/20"
                        : "text-rose-400 bg-rose-900/20"
                    }`}
                  >
                    {txn.status || "-"}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-400">Agent -</span>{" "}
                  {txn.agent || "Normal"}
                </p>
              </div>
            </div>
          )}

          {/* --- SELL TRANSACTION --- */}
          {txn.type === "sell" && (
            <div className="bg-red-900/20 p-4 rounded-xl mb-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
                <p>
                  <span className="text-neutral-400">Full Name -</span>{" "}
                  {txn.fullname || "-"}
                </p>
                <p>
                  <span className="text-neutral-400">User ID -</span>{" "}
                  {txn.userid || "-"}
                </p>

                <p>
                  <span className="text-neutral-400">ကျပ် ပဲ ရွေး -</span>{" "}
                  {txn.gold}
                </p>

                <p>
                  <span className="text-neutral-400">Date -</span>{" "}
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(txn.date || txn.created_at))}
                </p>
                <p>
                  <span className="text-neutral-400">Time -</span>{" "}
                  {txn.date ? new Date(txn.date).toLocaleTimeString() : "-"}
                </p>

                <p>
                  <span className="text-neutral-400">Type -</span>{" "}
                  <span className="font-semibold px-2 py-1 rounded-full text-red-400 bg-red-900/20">
                    {txn.type || "-"}
                  </span>
                </p>

                <p>
                  <span className="text-neutral-400">Agent -</span>{" "}
                  {txn.agent || "Normal"}
                </p>

                {/* 💳 PAYMENT GROUP */}
                <div className="col-span-2 bg-red-950/30 border border-red-800/40 rounded-xl p-3 mt-3">
                  <p className="font-medium text-red-300 mb-2">
                    💰 Payment Info
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[16px]">
                    <p>
                      <span className="text-neutral-400 text-md">Name -</span>{" "}
                      {txn.payment_name || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400 text-md">Phone -</span>{" "}
                      {txn.payment_phone || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400 text-md">Method -</span>{" "}
                      {txn.method || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400 text-md">Amount -</span>{" "}
                      {txn.price?.toLocaleString()} Ks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* --- DELIVERY TRANSACTION --- */}
          {txn.type === "delivery" && (
            <div>
              <div className="bg-purple-900/20 p-4 rounded-xl mb-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
                  <div className="col-span-2 rounded-xl p-3">
                    <p className="font-medium text-purple-300 mb-2">
                      🧍 Customer Info
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="text-neutral-400">Full Name -</span>{" "}
                        {txn.fullname || "-"}
                      </p>
                      <p>
                        <span className="text-neutral-400">Phone -</span>{" "}
                        {txn.payment_phone || "-"}
                      </p>
                      <p>
                        <span className="text-neutral-400">Date -</span>{" "}
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(txn.date || txn.created_at))}
                      </p>
                      <p>
                        <span className="text-neutral-400">Time -</span>{" "}
                        {txn.date
                          ? new Date(txn.date).toLocaleTimeString()
                          : "-"}
                      </p>
                      <p className="mt-2">
                        <span className="text-neutral-400">Status -</span>{" "}
                        <span
                          className={`font-semibold px-2 py-1 rounded-full ${
                            txn.status === "approved"
                              ? "text-emerald-400 bg-emerald-900/20"
                              : txn.status === "pending"
                              ? "text-yellow-400 bg-yellow-900/20"
                              : "text-rose-400 bg-rose-900/20"
                          }`}
                        >
                          {txn.status || "-"}
                        </span>
                      </p>
                      <p>
                        <span className="text-neutral-400">Agent -</span>{" "}
                        {txn.agent || "Normal"}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 bg-purple-950/30 border border-purple-800/40 rounded-xl p-3">
                    <p className="font-medium text-purple-300 mb-2">
                      📦 Delivery Info
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[16px]">
                      <p className="col-span-2">
                        <span className="text-neutral-400">
                          Delivery Address -
                        </span>{" "}
                        {txn.address || "-"}
                      </p>
                      <p>
                        <span className="text-neutral-400">
                          Delivery Type -
                        </span>{" "}
                        {txn.deli_type || "-"}
                      </p>
                      <p>
                        <span className="text-neutral-400">Gold -</span>{" "}
                        {txn.gold || "-"}
                      </p>

                      <p>
                        <span className="text-neutral-400">Delivery Fee -</span>{" "}
                        {txn.deli_fees?.toLocaleString() || deliveryFee || "-"}{" "}
                        ကျပ်
                      </p>
                      <p>
                        <span className="text-neutral-400">Service Fee -</span>{" "}
                        {txn.service_fees?.toLocaleString() ||
                          serviceFee ||
                          "-"}{" "}
                        ကျပ်
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {txn.status === "pending" && txn.type === "delivery" && (
                  <div>
                    <div className="flex gap-4 mb-8">
                      <div>
                        <label className="text-sm text-neutral-400">
                          Delivery Fee
                        </label>
                        <input
                          ref={deliveryFeeRef}
                          type="number"
                          value={deliveryFee}
                          onChange={(e) =>
                            setDeliveryFee(Number(e.target.value))
                          }
                          required
                          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-neutral-400">
                          Service Fee
                        </label>
                        <input
                          type="number"
                          value={serviceFee}
                          onChange={(e) =>
                            setServiceFee(Number(e.target.value))
                          }
                          required
                          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
                        />
                      </div>
                    </div>

                    {/* --- Transfer / Reject / Message Buttons --- */}
                    <div className="flex justify-end gap-3">
                      <button
                        type="button" // not submit
                        onClick={() => setShowPasscode({ type: "approve" })}
                        className={`px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-sm ${
                          actionTaken !== "none"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={actionTaken !== "none"}
                      >
                        Transfer
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPasscode({ type: "reject" })}
                        className={`px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-sm ${
                          actionTaken !== "none"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowChat(true)}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm"
                      >
                        💬 Message
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- Photos --- */}
          {txn.type !== "sell" && (
            <div className="flex gap-2 mb-6 overflow-x-auto overflow-y-hidden scrollbar-none">
              {txn.photos?.map((fileName, idx) => (
                <img
                  key={idx}
                  src={`http://38.60.244.74:3000/uploads/${fileName}`}
                  alt={`Photo ${idx + 1}`}
                  onClick={() =>
                    setLocalPreviewImg(
                      `http://38.60.244.74:3000/uploads/${fileName}`
                    )
                  }
                  className="cursor-pointer rounded-lg border border-neutral-700 hover:scale-105 transition w-36 h-48 object-cover flex-shrink-0"
                />
              ))}
            </div>
          )}

          {/* --- Buttons --- */}
          <div className="flex justify-end gap-3">
            {!(txn.type === "delivery" && txn.status === "pending") && (
              <>
                {txn.status !== "approved" &&
                  txn.status !== "rejected" &&
                  txn.type !== "delivery" && (
                    <>
                      <button
                        type="button" // add this
                        onClick={() => setShowPasscode({ type: "approve" })}
                        className={`px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-sm ${
                          actionTaken !== "none"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Transfer
                      </button>

                      <button
                        type="button" // add this
                        onClick={() => setShowPasscode({ type: "reject" })}
                        className={`px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-sm ${
                          actionTaken !== "none"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Reject
                      </button>
                    </>
                  )}
              </>
            )}

            {/* Message button always visible */}
            <div className="flex justify-end gap-3">
              {!(txn.type === "delivery" && txn.status === "pending") && (
                <button
                  type="button" // add this
                  onClick={() => setShowChat(true)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm"
                >
                  💬 Message
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 💬 Small Chat Beside */}
      {showChat && (
        <div className="fixed top-1/2 lg:right-[550px] 2xl:right-[750px] z-[60]">
          <MiniChat user={txn} onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* --- Passcode Modal --- */}
      {showPasscode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-[320px] text-center">
            {/* Title */}
            <h3 className="text-white font-semibold mb-4">
              Enter Passcode to Confirm
            </h3>

            {/* Password Input */}
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
            />

            {/* Action Buttons */}
            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasscode(false);
                  setPasscode("");
                }}
                className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="bg-yellow-500 text-neutral-800 px-3 py-2 rounded-md text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Photo Preview Modal --- */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70]">
          <div className="relative">
            <button
              onClick={() => setLocalPreviewImg(null)}
              className="absolute -top-8 right-0 text-white text-xl"
            >
              ✕
            </button>
            <img
              src={previewImg}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
