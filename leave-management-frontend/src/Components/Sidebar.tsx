import React, { useState } from "react";
import { FaPlusCircle, FaHistory, FaChartLine, FaSignOutAlt } from "react-icons/fa";

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
  userRole: "employee" | "hr" | "boss";
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView, userRole }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-white shadow-lg min-h-screen transition-all duration-300 flex flex-col border-r border-gray-200`}
    >
      {/* Toggle */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200">
        {isOpen && (
          <>
            <h1 className="text-xl font-bold">Leave Portal</h1>
            <p className="text-sm text-gray-600 mt-1">
              {userRole === "employee"
                ? "Employee Dashboard"
                : userRole === "hr"
                ? "HR Management"
                : "Executive Center"}
            </p>
          </>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-6 flex-1 overflow-y-auto">
        <div className="px-2 space-y-2">
          {(userRole === "employee" || userRole === "hr") && (
            <button
              onClick={() => onChangeView("apply")}
              className={`flex items-center w-full px-3 py-2 rounded ${
                activeView === "apply"
                  ? "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <FaPlusCircle className="mr-3 text-lg" />
              {isOpen && "Apply Leave"}
            </button>
          )}

          {userRole === "boss" && (
            <button
              onClick={() => onChangeView("boss-dashboard")}
              className={`flex items-center w-full px-3 py-2 rounded ${
                activeView === "boss-dashboard"
                  ? "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <FaChartLine className="mr-3 text-lg" />
              {isOpen && "Dashboard"}
            </button>
          )}

          {/* boss-employees button removed as per your request */}

          {userRole !== "boss" && (
            <button
              onClick={() => onChangeView("history")}
              className={`flex items-center w-full px-3 py-2 rounded ${
                activeView === "history"
                  ? "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <FaHistory className="mr-3 text-lg" />
              {isOpen && "My History"}
            </button>
          )}
        </div>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => alert("Use header logout")}
          className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded"
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          {isOpen && "Sign Out"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
