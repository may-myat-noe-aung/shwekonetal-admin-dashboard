import React, { useState } from "react";
import MiniChat from "./MiniChat";

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

  const isPending = txn.status === "pending";

  // const handleConfirm = async () => {
  //   if (passcode !== "1234") return alert("❌ Wrong passcode!");
  //   try {
  //     const type = showPasscode.type;
  //     setActionTaken(type);
  //     const url =
  //       type === "approve"
  //         ? `http://38.60.244.74:3000/sales/approve/${txn.id}`
  //         : `http://38.60.244.74:3000/sales/reject/${txn.id}`;

  //     const res = await fetch(url, { method: "PATCH" });
  //     if (!res.ok) throw new Error("Request failed");

  //     updateStatus(txn.id, type === "approve" ? "approved" : "rejected");
  //     alert(
  //       type === "approve"
  //         ? "✅ Transaction approved successfully!"
  //         : "🚫 Transaction rejected successfully!"
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Failed to process transaction");
  //   } finally {
  //     setShowPasscode(false);
  //     setPasscode("");
  //     setActionTaken("none");
  //   }
  // };

  const handleConfirm = async () => {
    if (passcode !== "1234") return alert("❌ Wrong passcode!");

    // If delivery transaction, check required fees
    if (txn.type === "delivery" && txn.status === "pending") {
      if (!deliveryFee || !serviceFee) {
        return alert("❌ Delivery Fee and Service Fee are required!");
      }
    }

    try {
      const type = showPasscode.type;
      setActionTaken(type);
      const url =
        type === "approve"
          ? `http://38.60.244.74:3000/sales/approve/${txn.id}`
          : `http://38.60.244.74:3000/sales/reject/${txn.id}`;

      // Include fees in PATCH body if delivery

      const body =
        txn.type === "delivery" && type === "approve"
          ? JSON.stringify({ deli_fees: deliveryFee, service_fees: serviceFee })
          : null;

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      if (!res.ok) throw new Error("Request failed");

      updateStatus(txn.id, type === "approve" ? "approved" : "rejected");
      alert(
        type === "approve"
          ? "✅ Transaction approved successfully!"
          : "🚫 Transaction rejected successfully!"
      );
    } catch (err) {
      console.error(err);
      alert("❌ Failed to process transaction");
    } finally {
      setShowPasscode(false);
      setPasscode("");
      setActionTaken("none");
    }
  };

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

          <h2 className="text-lg font-semibold mb-4 text-blue-400">
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
                  <span className="text-neutral-400">Date -</span>{" "}
                  {txn.date ? new Date(txn.date).toLocaleDateString() : "-"}
                </p>
                <p>
                  <span className="text-neutral-400">Time -</span>{" "}
                  {txn.date ? new Date(txn.date).toLocaleTimeString() : "-"}
                </p>
              </div>
            </div>
          )}

          {/* --- SELL TRANSACTION --- */}
          {txn.type === "sell" && (
            <div className="bg-blue-900/20 p-4 rounded-xl mb-4">
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
                  <span className="font-semibold px-2 py-1 rounded-full text-blue-400 bg-blue-900/20">
                    {txn.type || "-"}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-400">ကျပ် ပဲ ရွေး -</span>{" "}
                  {txn.gold}
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
                  <span className="text-neutral-400">Date -</span>{" "}
                  {txn.date ? new Date(txn.date).toLocaleDateString() : "-"}
                </p>
                <p>
                  <span className="text-neutral-400">Time -</span>{" "}
                  {txn.date ? new Date(txn.date).toLocaleTimeString() : "-"}
                </p>

                {/* 💳 PAYMENT GROUP */}
                <div className="col-span-2 bg-blue-950/30 border border-blue-800/40 rounded-xl p-3 mt-3">
                  <p className="font-medium text-blue-300 mb-2">
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
          {/* {txn.type === "delivery" && (
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
                      <span className="text-neutral-400">Delivery Type -</span>{" "}
                      {txn.deli_type || "-"}
                    </p>
                    <p>
                      <span className="text-neutral-400">Gold -</span>{" "}
                      {txn.gold || "-"}
                    </p>
                    <p className="">
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
                    <div className=" flex gap-4">
                      <div>
                        <label className="text-sm text-neutral-400">
                          Delivery Fee
                        </label>
                        <input
                          type="text"
                          value={deliveryFee}
                          onChange={(e) => setDeliveryFee(e.target.value)}
                          disabled={!isPending}
                          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-neutral-400">
                          Service Fee
                        </label>
                        <input
                          type="text"
                          value={serviceFee}
                          onChange={(e) => setServiceFee(e.target.value)}
                          disabled={!isPending}
                          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
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

                      {/* --- Fees Inputs: ONLY show when pending --- */}
                      {/* {txn.status === "pending" && txn.type === "delivery" && (
                      <form
                        id="myForm"
                        onSubmit={(e) => {
                          e.preventDefault(); // prevent default form submission
                          setShowPasscode({ type: "approve" });
                        }}
                        className="flex gap-4 col-span-2 mt-2"
                      >
                        <div>
                          <label className="text-sm text-neutral-400">
                            Delivery Fee
                          </label>
                          <input
                            type="text"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(e.target.value)}
                            required
                            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-neutral-400">
                            Service Fee
                          </label>
                          <input
                            type="text"
                            value={serviceFee}
                            onChange={(e) => setServiceFee(e.target.value)}
                            required
                            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
                          />
                        </div>
                      </form>
                    )} */}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {txn.status === "pending" && txn.type === "delivery" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // prevent page reload
                      setShowPasscode({ type: "approve" });
                    }}
                  >
                    <div className="flex gap-4 mb-8">
                      <div>
                        <label className="text-sm text-neutral-400">
                          Delivery Fee
                        </label>
                        <input
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

                    {/* --- Transfer Button inside form --- */}
                    <div className="flex justify-end gap-3 ">
                      <button
                        type="submit"
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
                        onClick={() => setShowChat(true)}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm"
                      >
                        💬 Message
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* --- Photos --- */}
          {txn.type !== "sell" && (
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
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
            <h3 className="text-yellow-400 font-semibold mb-4">
              Enter Passcode
            </h3>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••"
              className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-center tracking-widest text-lg mb-4"
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowPasscode(false);
                  setPasscode("");
                }}
                className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700"
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
