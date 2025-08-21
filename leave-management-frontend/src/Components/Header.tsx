import React from "react";
import { FaCog, FaBell, FaUserCircle } from "react-icons/fa";

const ICON_SIZE = 24;
const USER_ICON_SIZE = 32;  // consistent icon size

const Header: React.FC = () => (
  <header className="bg-white shadow-md border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        {/* Logo + Brand with R circle */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center select-none">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            ROLAFACE
          </h1>
        </div>
        {/* Actions: Settings, Notification, Profile */}
        <div className="flex items-center gap-6">
          {/* Settings */}
          <button
            aria-label="Settings"
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <FaCog size={ICON_SIZE} />
          </button>

          {/* Notification */}
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <FaBell size={ICON_SIZE} />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <button
            aria-label="User Profile"
            className="p-2 rounded-full hover:bg-gray-100 text-blue-700 transition-colors"
          >
            <FaUserCircle size={USER_ICON_SIZE} />
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;