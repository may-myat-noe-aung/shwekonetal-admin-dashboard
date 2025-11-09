// NotificationDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell, ShoppingCart, DollarSign, Truck, UserPlus, TrendingUp } from "lucide-react";

export default function NotificationDropdown({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  const [localNoti, setLocalNoti] = useState(notifications || []);
  const notiRef = useRef();

  // Sync local state when props change
  useEffect(() => {
    setLocalNoti(Array.isArray(notifications) ? notifications : []);
  }, [notifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark all notifications as read
  const markAllRead = () => {
    setLocalNoti(localNoti.map((n) => ({ ...n, read: true })));
  };

  // Type-based colors and icons
  const typeConfig = {
    buy: { bg: "bg-green-900", icon: <ShoppingCart size={16} className="text-green-400" /> },
    sell: { bg: "bg-red-900", icon: <DollarSign size={16} className="text-red-400" /> },
    delivery: { bg: "bg-orange-900", icon: <Truck size={16} className="text-orange-400" /> },
    "new-user": { bg: "bg-yellow-900", icon: <UserPlus size={16} className="text-yellow-400" /> },
    "gold-change": { bg: "bg-blue-900", icon: <TrendingUp size={16} className="text-blue-400" /> },
  };

  return (
    <div className="relative" ref={notiRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-2xl bg-neutral-900 border border-neutral-800 p-2 hover:bg-neutral-800"
      >
        <Bell className="h-5 w-5 text-neutral-100" />
        {localNoti.some((n) => !n.read) && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg z-50">
          <div className="p-4 border-b border-neutral-800 font-semibold">Notifications</div>

          {localNoti.length === 0 && (
            <div className="p-4 text-center text-neutral-400">No notifications</div>
          )}

          <ul>
            {localNoti.map((noti) => {
              const config = typeConfig[noti.type] || { bg: "bg-neutral-950/50", icon: <Bell size={16} className="text-neutral-400" /> };
              return (
                <li
                  key={noti.id}
                  className={`px-4 py-3 border-b border-neutral-800 cursor-pointer flex items-center gap-3 rounded-lg hover:bg-neutral-800 ${config.bg} ${noti.read ? "opacity-50" : "opacity-100"}`}
                >
                  <div>{config.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm text-neutral-100">{noti.message}</div>
                    <div className="text-xs text-neutral-400">{noti.time}</div>
                  </div>
                </li>
              );
            })}
          </ul>

          <button
            className="w-full py-2 text-center text-yellow-500 hover:bg-neutral-800 rounded-b-xl"
            onClick={markAllRead}
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}
