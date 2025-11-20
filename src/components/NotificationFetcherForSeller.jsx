import React, { useEffect, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationFetcherForSeller() {
  const [notifications, setNotifications] = useState([]);

  const playSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.volume = 1;
    audio.play().catch(() => {});
  };

  // Load saved notifications on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(saved);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { url: "http://38.60.244.74:3000/sales", type: "sales" },

          // ✅ Newly added notification sources
          { url: "http://38.60.244.74:3000/buyTable", type: "buy-table", message: "New buy record has been approved!" },
          { url: "http://38.60.244.74:3000/sellTable", type: "sell-table", message: "New sell record has been approved!" },
          { url: "http://38.60.244.74:3000/deliTable", type: "delivery-table", message: "New delivery record has been approved!" },
        ];

        const responses = await Promise.all(endpoints.map((e) => fetch(e.url).then((r) => r.json())));
        const newNotis = [];

        endpoints.forEach((e, i) => {
          const data = responses[i];
          const key = `prevCount_${e.type}`;
          const prevCount = parseInt(localStorage.getItem(key) || "0");

          let currentCount = 0;

          // Handle /sales separately
          if (e.type === "sales") {
            const salesData = Array.isArray(data?.data) ? data.data : [];
            currentCount = salesData.length;

            if (currentCount > prevCount && salesData.length > 0) {
              const newRow = salesData[0];
              const rowType = newRow?.type?.toLowerCase?.();
              if (!rowType) return;

              const messageMap = {
                sell: "New sell record has been reached!",
                buy: "New buy record has been reached!",
                delivery: "New delivery record has been reached!",
              };

              if (messageMap[rowType]) {
                newNotis.push({
                  type: rowType,
                  message: messageMap[rowType],
                  time: new Date().toLocaleTimeString(),
                  read: false,
                });
              }
            }
          } else {
            // ✅ For other APIs, including new ones
            const dataArr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
            currentCount = dataArr.length;

            if (currentCount > prevCount) {
              newNotis.push({
                type: e.type,
                message: e.message,
                time: new Date().toLocaleTimeString(),
                read: false,
              });
            }
          }

          localStorage.setItem(key, currentCount.toString());
        });

        if (newNotis.length > 0) {
          const updated = [...newNotis, ...(JSON.parse(localStorage.getItem("notifications")) || [])];
          setNotifications(updated);
          localStorage.setItem("notifications", JSON.stringify(updated));
          playSound();
        }
      } catch (err) {
        console.error("Notification fetch failed:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return <NotificationDropdown notifications={notifications} />;
}
