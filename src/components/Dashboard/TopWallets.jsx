import React, { useState, useEffect } from "react";
import { Wallet } from "lucide-react";

export default function TopWallets() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    async function fetchWallets() {
      try {
        const res = await fetch("http://38.60.244.74:3000/topWallet");
        const json = await res.json();
        setWallets(json.TOP_WALLETS || []);
      } catch (error) {
        console.error("Failed to fetch top wallets:", error);
      }
    }

    fetchWallets();
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Top Wallets</h3>
        <Wallet className="h-4 w-4 text-neutral-400" />
      </div>

      <div className="space-y-3">
        {wallets.length > 0 ? (
          wallets.map((w, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-neutral-800 pb-2 last:border-none"
            >
              <div>
                <div className="font-medium">{w.user}</div>
                <div className="text-xs text-neutral-500">{w.state}၊ {w.city}</div>
              </div>
              <div className="text-sm text-yellow-400 font-semibold">
                {w.gold} ရွေး
              </div>
            </div>
          ))
        ) : (
          <div className="text-neutral-500 text-sm">No wallets data.</div>
        )}
      </div>
    </div>
  );
}
