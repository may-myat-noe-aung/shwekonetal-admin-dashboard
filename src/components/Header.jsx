import React, { useState } from "react";
import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";


const Header = () => {
  const [query, setQuery] = useState("");
  const location = useLocation();

  // Path → Title mapping
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
    <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 bg-neutral-950/80 border-b border-neutral-800 bg-neutral-950 text-neutral-100 ">
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
          <button className="rounded-2xl bg-neutral-900 border border-neutral-800 p-2 hover:bg-neutral-800" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="w-[2px] h-12 "></div>
            <div className="flex items-center justify-center">
              <img
                className="size-10 rounded-full"
                src="https://www.citypng.com/public/uploads/preview/profile-user-round-yellow-icon-symbol-free-png-7017516950335232xusq1qssc.png?v=2025081906"
                alt="Profile"
              />
              <div className="ml-2">
                <p className="text-base font-medium">Kyaw Kyaw</p>
                <p className="text-sm font-light">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
