import { Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Topbar({title}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="w-full h-16 bg-white flex items-center justify-between px-6 shadow-md text-grey-300 z-50">
      {/* Left Section (App Title or Search) */}
      <div className="text-xl font-bold tracking-wide">
        {title}
      </div>

      {/* Right Section (Icons) */}
      <div className="flex items-center gap-6 relative">
        {/* Notification */}
        <button className="relative p-2 rounded hover:bg-black hover:text-white transition">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1 rounded hover:bg-black hover:text-white transition"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-8 h-8 rounded-full object-cover border border-white"
            />
            <ChevronDown size={18} />
          </button>

          {/* Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              <ul className="text-sm">
                <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer">
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer">
                  Settings
                </li>
                <li className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
