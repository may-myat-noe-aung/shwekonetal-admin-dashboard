import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Truck,
  UserPlus,
  TrendingUp,
  CheckCircle,
  ShoppingCart,
  DollarSign,
  ClipboardCheck,
  XCircle,
} from "lucide-react";

export default function NotificationDropdown({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  const [localNoti, setLocalNoti] = useState([]);
  const notiRef = useRef();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notifications")) || notifications;
    setLocalNoti(saved);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(localNoti));
  }, [localNoti]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setLocalNoti([]);
    localStorage.removeItem("notifications");
  };

  const typeConfig = {
    buy: {
      icon: <ShoppingCart size={18} className="text-green-500" />,
      textColor: "text-green-400",
      gradient: "from-green-500/20 to-transparent",
    },
    sell: {
      icon: <DollarSign size={18} className="text-red-500" />,
      textColor: "text-red-400",
      gradient: "from-red-500/20 to-transparent",
    },
    delivery: {
      icon: <Truck size={18} className="text-purple-500" />,
      textColor: "text-purple-400",
      gradient: "from-purple-500/20 to-transparent",
    },
    "new-user": {
      icon: <UserPlus size={18} className="text-yellow-500" />,
      textColor: "text-yellow-400",
      gradient: "from-yellow-500/20 to-transparent",
    },
    buying: {
      icon: <TrendingUp size={18} className="text-green-600" />,
      textColor: "text-green-500",
      gradient: "from-green-400/20 to-transparent",
    },
    selling: {
      icon: <TrendingUp size={18} className="text-red-600" />,
      textColor: "text-red-500",
      gradient: "from-red-400/20 to-transparent",
    },
    formula: {
      icon: <ClipboardCheck size={18} className="text-teal-500" />,
      textColor: "text-teal-400",
      gradient: "from-teal-400/20 to-transparent",
    },
    "buy-table": {
      icon: <CheckCircle size={18} className="text-green-600" />,
      textColor: "text-green-500",
      gradient: "from-green-500/20 to-transparent",
    },
    "sell-table": {
      icon: <CheckCircle size={18} className="text-red-600" />,
      textColor: "text-red-500",
      gradient: "from-red-500/20 to-transparent",
    },
    "delivery-table": {
      icon: <CheckCircle size={18} className="text-purple-600" />,
      textColor: "text-purple-500",
      gradient: "from-purple-500/20 to-transparent",
    },
    // reject notifications
    "reject-buy": {
      icon: <XCircle size={18} className="text-green-600" />,
      textColor: "text-green-400",
      gradient: "from-green-500/20 to-transparent",
    },
    "reject-sell": {
      icon: <XCircle size={18} className="text-red-600" />,
      textColor: "text-red-400",
      gradient: "from-red-500/20 to-transparent",
    },
    "reject-delivery": {
      icon: <XCircle size={18} className="text-purple-600" />,
      textColor: "text-purple-400",
      gradient: "from-purple-500/20 to-transparent",
    },
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
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg z-50">
          <div className="p-4 border-b border-neutral-800 font-semibold flex justify-between items-center">
            <span>Notifications</span>
            {localNoti.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-yellow-400 text-sm hover:text-yellow-300"
              >
                Clear all
              </button>
            )}
          </div>

          {localNoti.length === 0 && (
            <div className="p-4 text-center text-neutral-400">No notifications</div>
          )}

          <div
            className="overflow-y-auto max-h-72"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#171717 #171717" }}
          >
            <ul>
              {localNoti.map((noti, i) => {
                const config = typeConfig[noti.type] || {
                  icon: <Bell size={16} className="text-neutral-400" />,
                  textColor: "text-neutral-400",
                  gradient: "from-yellow-500/10 to-transparent",
                };

                return (
                  <li
                    key={i}
                    className="relative px-4 py-3 border-b border-neutral-800 flex items-center gap-3"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 rounded-md bg-gradient-to-br ${
                        config.gradient
                      }`}
                    />

                    <div className="relative flex items-center gap-3 w-full">
                      <div>{config.icon}</div>
                      <div className={`flex-1 text-sm ${config.textColor}`}>
                        {noti.message}
                        <div className="text-xs text-neutral-400">{noti.time}</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
