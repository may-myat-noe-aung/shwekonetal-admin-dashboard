import React, { useEffect, useState, useRef } from "react";
import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

const Header = () => {
  const [query, setQuery] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New user registered", time: "2 min ago", read: false },
    { id: 2, message: "Gold updated in stock", time: "10 min ago", read: true },
    {
      id: 3,
      message: "System maintenance at 5 PM",
      time: "1 hr ago",
      read: false,
    },
  ]);
  const [openNoti, setOpenNoti] = useState(false);
  const location = useLocation();
  const notiRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setOpenNoti(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const routeTitles = {
    "/": "Dashboard",
    "/sale": "Sales",
    "/gold-management": "Gold Management",
    "/user-management": "User Management",
    "/report": "Report",
    "/chat": "Chat",
    "/setting": "Setting",
  };

  const title = routeTitles[location.pathname] || "Dashboard";
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    if (!adminId) return;

    fetch(`http://38.60.244.74:3000/admin/${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setAdminData(data.data[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch admin data:", err));
  }, [adminId]);

  return (
    <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 bg-neutral-950/80 border-b border-neutral-800 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-3">
        <h1 className="text-lg font-semibold">{title}</h1>

        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="All Search..."
              className="w-64 rounded-2xl bg-neutral-900 border border-neutral-800 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              type="search"
            />
          </div>

          {/* Notification */}
          <NotificationDropdown notifications={notifications} />

          {/* Profile */}
          <div className="flex items-center gap-4 ml-4">
            {adminData?.photo ? (
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-neutral-700 hover:scale-105 transition-all duration-300"
                src={`http://38.60.244.74:3000/uploads/${adminData.photo}`}
                alt="Profile"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center text-sm font-semibold shadow-md">
                {adminData?.name ? adminData.name.charAt(0).toUpperCase() : "A"}
              </div>
            )}

            <div>
              <p className="text-base font-medium">
                {adminData?.name || "Admin"}
              </p>
              <p className="text-sm font-light capitalize">
                {adminData?.role || "owner"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
