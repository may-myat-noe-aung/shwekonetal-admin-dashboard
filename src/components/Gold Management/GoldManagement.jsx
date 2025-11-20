import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import BuyingPricesChart from "./BuyingPricesChart";
import SellingPricesChart from "./SellingPricesChart";
import GoldConversion from "./GoldConversion";
import { useAlert } from "../../AlertProvider";

export default function GoldManagementPage() {
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [buyInput, setBuyInput] = useState(0);
  const [sellInput, setSellInput] = useState(0);
  const [chartBuyData, setChartBuyData] = useState([]);
  const [chartSellData, setChartSellData] = useState([]);
  const { showAlert } = useAlert();

  const [pePerKyat, setPePerKyat] = useState(16);
  const [ywayPerKyat, setYwayPerKyat] = useState(128);

  const [kyat, setKyat] = useState(1);
  const [pe, setPe] = useState(pePerKyat);
  const [yway, setYway] = useState(ywayPerKyat);
  const [goldList, setGoldList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "buy" or "sell"
  const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [timer, setTimer] = useState(null);

  const [inputFocused, setInputFocused] = useState(false); // ✅ new state to pause fetch

  const API_BASE = "http://38.60.244.74:3000";

  // Initial fetch after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPriceHistory();
      fetchLatestBuyPrice();
      fetchLatestSellPrice();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Live fetch every 5 seconds, but pause when inputFocused
  useEffect(() => {
    if (inputFocused) return; // stop fetch while editing

    const interval = setInterval(() => {
      fetchPriceHistory();
      fetchLatestBuyPrice();
      fetchLatestSellPrice();
    }, 5000);

    return () => clearInterval(interval);
  }, [inputFocused]);

  const fetchPriceHistory = async () => {
    try {
      const [buyRes, sellRes] = await Promise.all([
        axios.get(`${API_BASE}/buying-prices`),
        axios.get(`${API_BASE}/selling-prices`),
      ]);

      const todayBuyDate = Object.keys(buyRes.data)[0];
      const todaySellDate = Object.keys(sellRes.data)[0];

      const buyData = Object.entries(buyRes.data[todayBuyDate])
        .filter(([_, price]) => price !== null)
        .map(([time, buy]) => ({ time, buy }));

      const sellData = Object.entries(sellRes.data[todaySellDate])
        .filter(([_, price]) => price !== null)
        .map(([time, sell]) => ({ time, sell }));

      setChartBuyData(buyData);
      setChartSellData(sellData);
    } catch (err) {
      console.error("Failed to fetch price history", err);
    }
  };

  const fetchLatestBuyPrice = async () => {
    try {
      const res = await axios.get(`${API_BASE}/buying-prices/latest`);
      const latest = res.data.price;
      setBuyPrice(latest);
      setBuyInput(latest);
    } catch (err) {
      console.error("Failed to fetch latest buy price", err);
    }
  };

  const fetchLatestSellPrice = async () => {
    try {
      const res = await axios.get(`${API_BASE}/selling-prices/latest`);
      const latest = res.data.price;
      setSellPrice(latest);
      setSellInput(latest);
    } catch (err) {
      console.error("Failed to fetch latest sell price", err);
    }
  };

  const handleAddGold = () => {
    setGoldList((prev) => [...prev, { kyat, pe, yway }]);
    setTimeout(() => {
      setKyat(1);
      setPe(pePerKyat);
      setYway(ywayPerKyat);
    }, 0);
  };

  const handleUpdateClick = (type) => {
    setModalType(type);
    setPassword("");
    setCountdown(10);
    setShowModal(true);
  };

  const startCountdown = (type) => {
    let timeLeft = 10;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        applyUpdate(type);
      }
    }, 1000);
    setTimer(interval);
  };

  const applyUpdate = async (type) => {
    try {
      if (type === "buy") {
        await axios.post(`${API_BASE}/buying-prices`, { price: buyInput });
        fetchPriceHistory();
        fetchLatestBuyPrice();
      } else if (type === "sell") {
        await axios.post(`${API_BASE}/selling-prices`, { price: sellInput });
        fetchPriceHistory();
        fetchLatestSellPrice();
      }
    } catch (err) {
      showAlert("Prices Update လုပ်ရန် အခက်အခဲ တစ်ချို့ရှိနေသည်" + err.message, "error");
    } finally {
      setShowModal(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      showAlert("Passcode ထည့်ပေးပါ", "warning");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/admin/verify-admin-passcode`,
        { passcode: password }
      );

      if (response.data.success) {
        startCountdown(modalType);
      } else {
        showAlert(verifyResponse?.message || verifyResponse?.error || "Passcode မှားနေပါသည်", "error");
      }
    } catch (error) {
      const apiMessage =
        error.response?.data?.message || error.response?.data?.error || "Something went wrong";
        showAlert(apiMessage, "error");
    }
  };

  const cancelUpdate = () => {
    clearInterval(timer);
    setShowModal(false);
    setCountdown(10);
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 space-y-6 overflow-x-hidden ">
      <div className="mx-auto max-w-7xl  px-4 py-6 space-y-6">
        {/* Gold Conversion */}
        <GoldConversion />

        {/* Buy + Sell Charts */}
        <section className="">
          {/* Buy */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
            <div className="col-span-1 md:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 2xl:py-6 w-full overflow-hidden">
              <h3 className="mb-6 font-semibold text-sm md:text-base">
                Latest Buy Price
              </h3>
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <SummaryCard
                    title="Buy Price"
                    value={`${buyPrice} ကျပ်`}
                    sub="Updated"
                    icon={<ArrowUpRight className="h-5 w-5" />}
                    accent="from-green-500/20 to-transparent"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 w-full">
                  <input
                    type="number"
                    value={buyInput}
                    onChange={(e) =>
                      setBuyInput(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateClick("buy");
                    }}
                    className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm flex-1 w-full"
                    placeholder="Buy Price"
                  />
                  <button
                    onClick={() => handleUpdateClick("buy")}
                    className="bg-green-500 text-white px-3 py-2 rounded-md text-sm w-full sm:w-auto"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 overflow-x-auto">
              <h3 className="font-semibold mb-3">Buy Price & Chart</h3>
              <div className="h-48 w-full overflow-x-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartBuyData}>
                    <defs>
                      <linearGradient id="buy" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" width={100} />
                    <Tooltip
                      formatter={(value) => [`${value} ကျပ်`, " Price"]}
                      contentStyle={{
                        background: "#0a0a0a",
                        border: "1px solid #262626",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="buy"
                      stroke="#22c55e"
                      fill="url(#buy)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sell */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center mt-6 ">
            <div className="col-span-1 md:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 2xl:py-6 w-full  overflow-hidden">
              <h3 className="mb-6 font-semibold text-sm md:text-base">
                Latest Sell Price
              </h3>
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <SummaryCard
                    title="Sell Price"
                    value={`${sellPrice} ကျပ်`}
                    sub="Updated"
                    icon={<ArrowDownRight className="h-5 w-5" />}
                    accent="from-red-600/20 to-transparent"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
                  <input
                    type="number"
                    value={sellInput}
                    onChange={(e) =>
                      setSellInput(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleUpdateClick("sell");
                      }
                    }}
                    className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm flex-1 w-full"
                    placeholder="Sell Price"
                  />
                  <button
                    onClick={() => handleUpdateClick("sell")}
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm w-full sm:w-auto"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <h3 className="font-semibold mb-3">Sell Price & Chart</h3>
              <div className="h-48 w-full overflow-x-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartSellData}>
                    <defs>
                      <linearGradient id="sell" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#9C0003"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#9C0003"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" width={100} />
                    <Tooltip
                      formatter={(value) => [`${value} ကျပ်`, "Sell Price"]}
                      contentStyle={{
                        background: "#0a0a0a",
                        border: "1px solid #262626",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sell"
                      stroke="#9C0003"
                      fill="url(#sell)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Today and Yesterday Buying Chart */}
        <BuyingPricesChart />
        <SellingPricesChart />
      </div>

      {/* Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={cancelUpdate}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              {countdown === 10
                ? `Enter Password to Update ${
                    modalType === "buy" ? "Buy" : "Sell"
                  } Price`
                : `Updating in ${countdown}s...`}
            </h3>

            {countdown === 10 ? (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordSubmit();
                    }
                  }}
                  autoFocus
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={cancelUpdate}
                    className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full bg-neutral-800 rounded-full h-2 mb-3">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(countdown / 10) * 100}%` }}
                  ></div>
                </div>
                <button
                  onClick={cancelUpdate}
                  className="bg-red-500 text-black px-3 py-2 rounded-md text-sm"
                >
                  Cancel Update
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, sub, icon, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div
        className={
          "pointer-events-none absolute inset-0 bg-gradient-to-br " +
          (accent || "from-yellow-500/10 to-transparent")
        }
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-400 mb-1">{title}</p>
          <p className="text-xl font-semibold text-yellow-300">{value}</p>
          {sub && <p className="mt-1 text-xs text-neutral-400">{sub}</p>}
        </div>
        <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-yellow-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
