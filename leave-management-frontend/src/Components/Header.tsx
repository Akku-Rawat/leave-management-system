import React, { useState } from "react";
import { FaCog, FaBell, FaUserCircle, FaChevronDown } from "react-icons/fa";

interface User {
  role: 'employee' | 'hr' | 'boss';
  name: string;
  id: string;
  department: string;
}

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Sample notifications
  const notifications = [
    { id: 1, message: "Your leave request has been approved", time: "2 hours ago", type: "success" },
    { id: 2, message: "New leave policy updated", time: "1 day ago", type: "info" },
    { id: 3, message: "Reminder: Submit timesheet", time: "3 days ago", type: "warning" },
  ];

  const handleSettingClick = (setting: string) => {
    setShowSettingsDropdown(false);
    switch (setting) {
      case 'profile':
        setShowProfile(true);
        break;
      case 'users':
        alert('Opening User Management...');
        break;
      case 'delegation':
        alert('Opening Delegation Settings...');
        break;
      case 'policies':
        alert('Opening Leave Policies...');
        break;
      case 'analytics':
        alert('Opening System Analytics...');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <header className="bg-white shadow-md border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">

            {/* Logo + Brand */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center select-none">
                <span className="text-white font-bold text-2xl">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  ROLAFACE
                </h1>
                <div className="text-xs text-gray-600">
                  {currentUser.role === 'employee' && '👤 Employee Portal'}
                  {currentUser.role === 'hr' && '🏢 HR Management'}
                  {currentUser.role === 'boss' && '👔 Executive Dashboard'}
                </div>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">

              {/* User Info */}
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {currentUser.name}
                </div>
                <div className="text-xs text-gray-600">
                  {currentUser.department} • {currentUser.id}
                </div>
              </div>

              {/* Role Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentUser.role === 'employee' ? 'bg-blue-100 text-blue-700' :
                currentUser.role === 'hr' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {currentUser.role.toUpperCase()}
              </span>

              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors flex items-center"
                  aria-label="Settings"
                >
                  <FaCog className="w-5 h-5" />
                  <FaChevronDown className="w-3 h-3 ml-1" />
                </button>

                {showSettingsDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">

                      {/* Common Settings */}
                      <button 
                        onClick={() => handleSettingClick('profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaUserCircle className="w-4 h-4 mr-3 text-gray-400" />
                        Profile Settings
                      </button>

                      {/* HR & Boss Settings */}
                      {(currentUser.role === 'hr' || currentUser.role === 'boss') && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase">
                            Management
                          </div>

                          <button 
                            onClick={() => handleSettingClick('users')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            👥 User Management
                          </button>

                          <button 
                            onClick={() => handleSettingClick('policies')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            📋 Leave Policies
                          </button>

                          <button 
                            onClick={() => handleSettingClick('analytics')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            📊 System Analytics
                          </button>
                        </>
                      )}

                      {/* Boss Only Settings */}
                      {currentUser.role === 'boss' && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase">
                            Executive
                          </div>

                          <button 
                            onClick={() => handleSettingClick('delegation')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            🤝 Delegation Settings
                          </button>

                          <button 
                            onClick={() => handleSettingClick('system')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            ⚙️ System Configuration
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                  aria-label="Notifications"
                >
                  <FaBell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Profile Settings</h3>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    defaultValue={currentUser.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    defaultValue={`${currentUser.id}@rolaface.com`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input 
                    type="text" 
                    defaultValue={currentUser.department}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input 
                    type="text" 
                    defaultValue={currentUser.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => {
                    alert('Profile updated successfully!');
                    setShowProfile(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;