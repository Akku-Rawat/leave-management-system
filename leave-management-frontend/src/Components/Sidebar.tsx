import React from "react";
import { 
  FaHome, 
  FaCalendarPlus, 
  FaHistory, 
  FaChartBar,
  FaUsers,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
  userRole: "employee" | "hr" | "boss";
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView, userRole, onLogout }) => {
  const getMenuItems = () => {
    const commonItems = [
      { id: "history", label: "History", icon: <FaHistory /> }
    ];

    switch (userRole) {
      case "employee":
        return [
          { id: "apply", label: "Apply Leave", icon: <FaCalendarPlus /> },
          ...commonItems
        ];

      case "hr":
        return [
          { id: "dashboard", label: "HR Dashboard", icon: <FaHome /> },
          { id: "apply", label: "Apply Leave", icon: <FaCalendarPlus /> },
          ...commonItems
        ];

      case "boss":
        return [
          { id: "boss-dashboard", label: "Executive Dashboard", icon: <FaChartBar /> },
          { id: "apply", label: "Apply Leave", icon: <FaCalendarPlus /> },
          ...commonItems
        ];

      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white shadow-sm w-64 min-h-screen border-r border-gray-200">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeView === item.id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Logout Button */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <span className="mr-3"><FaSignOutAlt /></span>
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;