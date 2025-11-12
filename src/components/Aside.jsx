
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Coins,
  Users,
  Settings,
  LogOut,
  Home,
  ShoppingCart,
  MessageCircleMore,
} from "lucide-react";
import { GoReport } from "react-icons/go";
import Setting2Page from "../pages/SettingPage2";
import SettingPage from "../pages/SettingPage";

export default function Aside() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // useNavigate hook

  const role = localStorage.getItem("adminRole"); // "owner", "manager", "seller"

  const navItems = [
    { label: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/", roles: ["owner"] },
    { label: "Sales", icon: <ShoppingCart className="h-5 w-5" />, path: "/sale", roles: ["owner", "manager", "seller"] },
    { label: "Gold Management", icon: <Coins className="h-5 w-5" />, path: "/gold-management", roles: ["owner", "manager"] },
    { label: "User Management", icon: <Users className="h-5 w-5" />, path: "/user-management", roles: ["owner", "manager"] },
    { label: "Report", icon: <GoReport className="h-5 w-5" />, path: "/report", roles: ["owner"] },
    { label: "Chat", icon: <MessageCircleMore className="h-5 w-5" />, path: "/chat", roles: ["owner", "manager", "seller"] },
    { label: "Setting", icon: <Settings className="h-5 w-5" />, path: "/setting", roles: ["owner"] },
    { label: "Setting", icon: <Settings className="h-5 w-5" />, path: "/setting2", roles: ["manager", "seller"] }
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (!confirmLogout) return; // stop if user clicks Cancel

  localStorage.clear(); // remove all stored data
  navigate("/login"); // redirect using react-router
};


  return (
    <div className="flex min-h-screen bg-neutral-950 text-natural-100 h-screen sticky top-0">
      <aside className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} border-r border-neutral-800 bg-neutral-900 flex flex-col`}>
        <div className="flex items-center justify-start gap-4 h-16 px-4 border-b border-neutral-800">
          <Coins className="size-8 text-yellow-400" />
          {sidebarOpen && <span className="font-bold text-lg text-white">Gold Exchange</span>}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {filteredNavItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 rounded-md ${
                  isActive ? "text-yellow-400 font-semibold" : "hover:bg-neutral-800 text-gray-100"
                }`
              }
            >
              {item.icon}
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="h-16 border-t border-neutral-800 flex items-center justify-center">
          <button
            onClick={handleLogout} // updated logout
            className="flex items-center justify-center gap-2 w-full px-3 rounded-md hover:bg-neutral-800 text-red-500"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>
    </div>
  );
}
