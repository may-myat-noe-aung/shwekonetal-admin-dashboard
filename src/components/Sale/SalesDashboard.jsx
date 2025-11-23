

import React, { useState, useEffect } from "react";
import SummaryCards from "./SummaryCards";
import SalesTrendChart from "./SalesTrendChart";
import TransactionStatusChart from "./TransactionStatusChart";
import RecentTransactions from "./RecentTransactions";
import BuyTransactions from "./BuyTransactions";
import SellTransactions from "./SellTransactions";
import DeliveryTransactions from "./DeliveryTransactions.jsx";

const API_URL = "http://38.60.244.74:3000/sales";

const SalesDashboard = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchSales = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((item, i) => ({
            id: item.id || `TXN_${i}`,
            userid: item.userid || "-",
            fullname: item.fullname || "-",
            payment_name: item.payment_name || "-",
            payment_phone: item.payment_phone || "-",
            method: item.method || "-",
            type: item.type || "sell",
            gold: item.gold || 0,
            yway: item.yway || 0,
            price: parseInt(item.price || 0),
            status: item.status || "pending",
            photos: item.photos || [],
            date: item.created_at ? new Date(item.created_at) : new Date(),
          }));

          setSales(mapped);
          setError(null);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load sales data");
      }
    };

    fetchSales();

    intervalId = setInterval(fetchSales, 500);

    return () => clearInterval(intervalId);
  }, []);

  // --- Update Transaction Status ---
const updateStatus = (id, newStatus) => {
  setSales((prev) =>
    prev.map((s) =>
      s.id === id ? { ...s, status: newStatus } : s
    )
  );
};


  // --- Error UI ---
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        {error}
      </div>
    );

  // --- Main UI ---
  return (
    <div className="bg-neutral-950 text-neutral-100 ">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SalesTrendChart /> 
          <TransactionStatusChart sales={sales} />
        </div>

        {/* Transaction Tables */}
        <div className="space-y-6">
          {/* Buy Transactions */}
          <div className="overflow-x-hidden">
            <BuyTransactions sales={sales} updateStatus={updateStatus} />
          </div>

          {/* Sell Transactions */}
          <div className="overflow-x-hidden">
            <SellTransactions sales={sales} updateStatus={updateStatus} />
          </div>

          {/* Delivery Transactions */}
          <div className="overflow-x-hidden">
            <DeliveryTransactions sales={sales} updateStatus={updateStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
