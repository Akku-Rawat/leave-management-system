import React from "react";
import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";

interface HeaderProps {
  userRole: "employee" | "hr" | "boss";
  userName: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, userName, onLogout }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "employee": return "bg-blue-100 text-blue-800";
      case "hr": return "bg-green-100 text-green-800";
      case "boss": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "employee": return "Employee";
      case "hr": return "HR Manager";
      case "boss": return "Executive";
      default: return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              ROLAFACE Leave Management
            </h1>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-400" />
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{userName}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getRoleColor(userRole)}`}>
                    {getRoleTitle(userRole)}
                  </div>
                </div>
              </div>

              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FaBell className="w-5 h-5" />
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;