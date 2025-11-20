import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; // close button
import BuyTable from "./BuyTable";
import SellTable from "./SellTable";
import ReportBuySellChart from "./ReportBuySellChart";
import ReportBuySellRatio from "./ReportBuySellRatio";
import ServerToggle from "./ServerToggle";
import DeliveryTable from "./DeliveryTable";
import { useAlert } from "../../AlertProvider";

export default function ReportManagement() {
  const [initialGold, setInitialGold] = useState({
    kyat: 0,
    petha: 0,
    yway: 0,
  });
  const [addGold, setAddGold] = useState({ kyat: 0, petha: 0, yway: 0 });
  const [loading, setLoading] = useState(true);
  const [totalStr, setTotalStr] = useState("");
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [countdown, setCountdown] = useState(10);

  const [buys, setBuys] = useState([]);
  const [sells, setSells] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");

  const { showAlert } = useAlert();

  // Fetch initial gold from API
  useEffect(() => {
    const fetchGold = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/open-stock");
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          const g = data.data[0];
          setInitialGold({
            kyat: Number(g.kyat || 0),
            petha: Number(g.pal || 0),
            yway: Number(g.yway || 0),
          });
          setTotalStr(data.total || "");
        }
      } catch (err) {
        console.error("Error fetching open stock:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGold();
  }, []);

  // 🟡 Step 1: When clicking "Add Gold" → Show passcode modal
  const handleAddGold = () => {
    setPasscodeInput("");
    setPasscodeError("");
    setPasscodeModalOpen(true); // ✅ open modal
  };

  // 🟢 Step 2: When submitting passcode → Verify first, then Add Gold if correct
  const verifyPasscode = async () => {
    // ✅ Close modal immediately when Confirm is clicked
    setPasscodeModalOpen(false);

    if (!passcodeInput) {
      showAlert("Passcode ထည့်ပေးပါ", "warning");
      return;
    }

    try {
      // 🟡 Step 1: Verify passcode
      const verifyRes = await fetch(
        "http://38.60.244.74:3000/admin/verify-owner-passcode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: passcodeInput }),
        }
      );

      const verifyData = await verifyRes.json();
      console.log("🔐 Passcode verify response:", verifyData);

      if (!verifyData.success && verifyData.message !== "verified") {
        showAlert(
          verifyData?.message || verifyData?.error || "Passcode မှားနေပါသည်",
          "error"
        );
        return;
      }

      // 🟢 Step 2: Passcode correct → Add gold
      const payload = {
        kyat: addGold.kyat,
        pal: addGold.petha,
        yway: addGold.yway,
      };

      const res = await fetch("http://38.60.244.74:3000/open-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // This will catch server errors with JSON messages
        throw new Error(data.message || data.error || "Failed to add gold");
      }

      if (data.success || data.message === "updated" || data.status === "ok") {
        setInitialGold({
          kyat: Number(data.kyat || 0),
          petha: Number(data.pal || 0),
          yway: Number(data.yway || 0),
        });
        setTotalStr(data.total || "");
        setAddGold({ kyat: 0, petha: 0, yway: 0 });

        showAlert("Stock အသစ်ကို အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ", "success");
      } else {
        showAlert(data.message || "Failed to add gold", "error");
      }
    } catch (error) {
      const apiMessage = error.message || error.error || "Something went wrong";
      showAlert(apiMessage, "error");
    }
  };

  // Live fetch gold every 1 second
  useEffect(() => {
    let interval;

    const fetchGold = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/open-stock");
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          const g = data.data[0];
          setInitialGold({
            kyat: Number(g.kyat || 0),
            petha: Number(g.pal || 0),
            yway: Number(g.yway || 0),
          });
          setTotalStr(data.total || "");
        }
      } catch (err) {
        console.error("Error fetching open stock:", err);
      }
    };

    // Fetch immediately
    fetchGold();

    interval = setInterval(fetchGold, 500);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  const handleResetAddGold = () => setAddGold({ kyat: 0, petha: 0, yway: 0 });

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex justify-end">
          <ServerToggle />
        </div>

        {/* --- Gold Summary + Add Gold --- */}
        {/* --- Gold Summary + Add Gold --- */}
        <section className="w-full">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
            <h3 className="font-semibold text-lg">Add New Gold</h3>
            <div className="flex items-end justify-between ">
              {/* Initial Gold */}
              <div className="flex gap-2">
                {["kyat", "petha", "yway"].map((k, i) => {
                  const labelMap = ["ကျပ်", "ပဲ", "ရွေး"];
                  return (
                    <div key={k} className="flex flex-col">
                      <label className="text-xs text-neutral-400 mb-2">
                        {labelMap[i]}alert
                      </label>
                      <input
                        type="text"
                        value={initialGold[k]}
                        disabled
                        className="w-20 px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-sm"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-2 p-3 border border-neutral-700 rounded-lg bg-neutral-900 text-yellow-400 font-semibold">
                {loading ? "Loading..." : totalStr || "No data"}
              </div>

              {/* Add Gold Inputs */}
              <div className="flex gap-2">
                {["kyat", "petha", "yway"].map((k, i) => {
                  const labelMap = ["ကျပ်", "ပဲ", "ရွေး"];
                  return (
                    <div key={k} className="flex flex-col">
                      <label className="text-xs text-neutral-400 mb-2">
                        Add ({labelMap[i]})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={addGold[k]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAddGold({
                            ...addGold,
                            [k]: value === "" ? "" : parseFloat(value),
                          });
                        }}
                        className="w-20 px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-sm"
                        placeholder={labelMap[i]}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddGold();
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddGold}
                  className="px-4 py-1 bg-yellow-500 text-white rounded-md font-semibold"
                >
                  Add Gold
                </button>
                <button
                  onClick={handleResetAddGold}
                  className="px-4 py-1 border border-neutral-700 rounded-md"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- Tables --- */}
        <section className="grid grid-cols-1 lg:grid-cols-1 gap-4">
          <BuyTable />
          <SellTable />
          <DeliveryTable />
        </section>

        {/* --- Charts --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 h-full">
            <ReportBuySellChart />
          </div>
          <div className="col-span-1">
            <ReportBuySellRatio />
          </div>
        </section>
      </main>

      {/* -------------------- Passcode Modal -------------------- */}
      {passcodeModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={() => setPasscodeModalOpen(false)}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              Enter Passcode to Add Gold
            </h3>

            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  verifyPasscode();
                }
              }}
              autoFocus
            />

            <div className="flex justify-between">
              <button
                onClick={() => setPasscodeModalOpen(false)}
                className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={verifyPasscode}
                className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
              >
                Confirm
              </button>
            </div>

            {/* Countdown progress (optional) */}
            {countdown < 10 && (
              <div className="mt-4 w-full bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
