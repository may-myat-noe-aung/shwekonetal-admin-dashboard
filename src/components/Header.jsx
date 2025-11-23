import React, { useEffect, useState, useRef } from "react";
import { Bell, MessageCircleMore, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import NotificationFetcher from "./NotificationFetcher"; // ✅ import
import NotificationFetcherForSeller from "./NotificationFetcherForSeller";
import MessageFetcher from "./MessageFetcher";

const Header = () => {
  const [query, setQuery] = useState("");
  const [adminData, setAdminData] = useState(null);
  const location = useLocation();
  const adminId = localStorage.getItem("adminId");
  const adminRole = localStorage.getItem("adminRole");

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

  return (
    <div className="sticky top-0 z-10 backdrop-blur bg-neutral-950/80 border-b border-neutral-800 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-3">
        <h1 className="text-lg font-semibold">{title}</h1>

        <div className="ml-auto flex items-center gap-2">
          {/* ✅ Notification */}
          {adminRole === "seller" ? (
            <NotificationFetcherForSeller />
          ) : (
            <NotificationFetcher />
          )}

          <MessageFetcher />

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