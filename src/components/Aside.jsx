import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Coins,
  Users,
  Settings,
  LogOut,
  Home,
  ShoppingCart,
  ChartArea,
  MessageCircleMore,
} from "lucide-react";
import { GoReport } from "react-icons/go";

export default function Aside() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    {
      label: "Sales",
      icon: <ShoppingCart className="h-5 w-5" />,
      path: "/sale",
    },
    {
      label: "Gold Management",
      icon: <Coins className="h-5 w-5" />,
      path: "/gold-management",
    },
    {
      label: "User Management",
      icon: <Users className="h-5 w-5" />,
      path: "/user-management",
    },
    {
      label: "Report",
      icon: <GoReport className="h-5 w-5" />,
      path: "/report",
    },
    {
      label: "Chat",
      icon: <MessageCircleMore className="h-5 w-5" />,
      path: "/chat",
    },
    {
      label: "Setting",
      icon: <Settings className="h-5 w-5" />,
      path: "/setting",
    },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-950 text-natural-100   h-screen sticky top-0">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } border-r border-neutral-800 bg-neutral-900 flex flex-col`}
      >
        <div className="flex items-center justify-start gap-4 h-16 px-4 border-b border-neutral-800  ">
          <Coins className="size-8 text-yellow-400" />
          {sidebarOpen && (
            <span className="font-bold text-lg text-white">Gold Exchange</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive
                  ? " text-yellow-400 font-semibold"
                  : " hover:bg-neutral-800 text-gray-100"
              }`
            }
          >
            <Home className="h-5 w-5" />
            {sidebarOpen && <span className="text-sm ">Dashboard</span>}
          </NavLink>

          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 rounded-md ${
                  isActive
                    ? " text-yellow-400 font-semibold"
                    : "hover:bg-neutral-800 text-gray-100"
                }`
              }
            >
              {item.icon}
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="h-16 border-t border-neutral-800 flex items-center justify-center">
          <button className="flex items-center justify-center gap-2 w-full px-3 rounded-md hover:bg-neutral-800 text-red-500 ">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>
    </div>
  );
}
