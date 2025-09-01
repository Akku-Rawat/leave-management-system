import React, { useState} from "react";
import { createPortal } from "react-dom";
// import { Dialog } from "@headlessui/react";
import { FaCog, FaBell, FaUserCircle } from "react-icons/fa";

interface User {
  role: "employee" | "hr" | "boss";
  name: string;
  id: string;
  department: string;
}

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const DropdownPortal: React.FC<{
  anchorRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ anchorRef, onClose, children }) =>{
  const [pos, setPos] = React.useState({ top: 0, left: 0, width: 0 });

  React.useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [anchorRef]);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!anchorRef.current) return;
      const dropdown = document.getElementById("dropdown-portal");
      if (
        dropdown &&
        !dropdown.contains(e.target as Node) &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [anchorRef, onClose]);

  return createPortal(
    <div
      id="dropdown-portal"
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        minWidth: pos.width,
        background: "white",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid #ddd",
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const [notifications, setNotifications] = useState<
    { id: number; message: string; time: string }[]
  >([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  const notifRef = React.useRef<HTMLButtonElement>(null);
  const settingsRef = React.useRef<HTMLButtonElement>(null);
  const profileRef = React.useRef<HTMLButtonElement>(null);

  // Fetch notifications from API
  React.useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch("/api/notifications"); // अपनी notification API URL डालें
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }

    fetchNotifications();
  }, []);

  const handleSettingsAction = (action: string) => {
    setShowSettings(false);
    switch (action) {
      case "addUser":
        alert("Opening Add User...");
        break;
      case "users":
        alert("Opening User Management...");
        break;
      case "policies":
        alert("Opening Leave Policies...");
        break;
      case "analytics":
        alert("Opening System Analytics...");
        break;
      case "delegation":
        alert("Opening Delegation Settings...");
        break;
      case "config":
        alert("Opening System Configuration...");
        break;
      default:
        break;
    }
  };

  const iconSize = 24;

  return (
    <header className="bg-white shadow border-b relative z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center">
            <FaUserCircle
              size={28}
              color="#2563eb"
              className="mr-3"
              aria-label="ROLAFACE Logo"
            />
            <span className="text-2xl font-bold text-gray-900 select-none">
              ROLAFACE
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center space-x-6">
            <button
              ref={notifRef}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600"
              aria-label="Notifications"
            >
              <FaBell size={iconSize} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center select-none">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && notifRef.current && (
              <DropdownPortal
                anchorRef={notifRef}
                onClose={() => setShowNotifications(false)}
              >
                <div className="p-2 border-b">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2 border-b hover:bg-gray-50"
                    >
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </DropdownPortal>
            )}

            {(currentUser.role === "hr" || currentUser.role === "boss") && (
              <>
                <button
                  ref={settingsRef}
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  aria-label="Settings"
                >
                  <FaCog size={iconSize} />
                </button>

                {showSettings && settingsRef.current && (
                  <DropdownPortal
                    anchorRef={settingsRef}
                    onClose={() => setShowSettings(false)}
                  >
                    <div className="py-1">
                      {currentUser.role === "hr" && (
                        <>
                          <button
                            onClick={() => handleSettingsAction("addUser")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Add User
                          </button>
                          <button
                            onClick={() => handleSettingsAction("users")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            User Management
                          </button>
                          <button
                            onClick={() => handleSettingsAction("policies")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Leave Policies
                          </button>
                          <button
                            onClick={() => handleSettingsAction("analytics")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            System Analytics
                          </button>
                        </>
                      )}
                      {currentUser.role === "boss" && (
                        <>
                          <button
                            onClick={() => handleSettingsAction("delegation")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Delegation Settings
                          </button>
                          <button
                            onClick={() => handleSettingsAction("config")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            System Configuration
                          </button>
                        </>
                      )}
                    </div>
                  </DropdownPortal>
                )}
              </>
            )}

            <button
              ref={profileRef}
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              aria-label="Profile"
            >
              <FaUserCircle size={iconSize} />
            </button>

            {showProfile && profileRef.current && (
              <DropdownPortal anchorRef={profileRef} onClose={() => setShowProfile(false)}>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Logout
                </button>
              </DropdownPortal>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
