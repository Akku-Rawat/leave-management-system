import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { User } from "../Types";
import { FaCog, FaBell, FaUserCircle } from "react-icons/fa";


export interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onNavigate?: (path: string) => void; // Optional navigation handler
}

const DropdownPortal: React.FC<{
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ anchorRef, onClose, children }) => {
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

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onNavigate }) => {
  const [settingsLoading, setSettingsLoading] = React.useState<string | null>(null);
const [, setUserList] = useState<User[]>([]);
  // State for combined notifications from 3 endpoints
  const [notifications, setNotifications] = useState<
    { id: number; message: string; time: string }[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const notifRef = React.useRef<HTMLButtonElement | null>(null);
  const settingsRef = React.useRef<HTMLButtonElement | null>(null);
  const profileRef = React.useRef<HTMLButtonElement | null>(null);

  // Fetch combined notifications from three different backend endpoints
  useEffect(() => {
   async function fetchAllNotifications() {
  try {
    const token = localStorage.getItem("token");

    const [res1, res2, res3] = await Promise.all([
      fetch("/api/notifications/type1", {
        credentials: "include",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }),
      fetch("/api/notifications/type2", {
        credentials: "include",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }),
      fetch("/api/notifications/type3", {
        credentials: "include",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }),
    ]);

    if (!res1.ok || !res2.ok || !res3.ok) {
      console.error(
        "Failed to fetch notifications:",
        res1.status,
        res2.status,
        res3.status
      );
      setNotifications([]);
      return;
    }

    const [data1, data2, data3] = await Promise.all([
      res1.json(),
      res2.json(),
      res3.json(),
    ]);

    const combined = [...data1, ...data2, ...data3];
    combined.sort((a, b) => (a.time < b.time ? 1 : -1));

    setNotifications(combined);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    setNotifications([]);
  }
}
fetchAllNotifications();

  }, []);

  // Fetch full user info for profile dropdown
  useEffect(() => {
    async function fetchUserInfo() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/me", {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (res.ok) {
        const data: User = await res.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }
  fetchUserInfo();
  }, []);

const handleSettingsAction = async (action: string) => {
  setShowSettings(false);
  setSettingsLoading(action);

  try {
    switch (action) {
      case "addUser":
        onNavigate?.("/admin/user/add");
        break;

      case "users":
        // Fetch user list from backend API
        const resUsers = await fetch("/api/user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!resUsers.ok) throw new Error("Failed to fetch users");
        const dataUsers: User[] = await resUsers.json();
        setUserList(dataUsers);
        // optionally navigate to user management page if needed
        onNavigate?.("/admin/users");
        break;

      // other cases remain same
      case "policies":
        onNavigate?.("/admin/leave-policies");
        break;
      case "analytics":
        onNavigate?.("/admin/analytics");
        break;
      case "delegation":
        onNavigate?.("/admin/delegation");
        break;
      case "config":
        onNavigate?.("/admin/config");
        break;
      case "changePassword":
        onNavigate?.("/change-password");
        break;
      default:
        console.warn(`Unknown settings action: ${action}`);
        break;
    }
  } catch (error) {
    console.error(`Error handling ${action}:`, error);
  } finally {
    setSettingsLoading(null);
  }
};

  // Mark notification as read by calling backend and updating UI
  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const notificationIconSize = 25;
  const iconSize = 30;

  return (
    <header className="bg-white shadow border-b relative z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center">
            <FaUserCircle
              size={30}
              color="#2563eb"
              className="mr-3 relative left-[-65px]"
              aria-label="ROLAFACE Logo"
            />
            <span className="text-2xl font-bold text-gray-900 select-none relative left-[-70px]">
              ROLAFACE
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center space-x-6 relative right-0">
            {/* Notifications */}
            <button
              ref={notifRef}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600"
              aria-label="Notifications"
            >
              <FaBell size={notificationIconSize} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center select-none">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && notifRef.current && (
              <DropdownPortal anchorRef={notifRef} onClose={() => setShowNotifications(false)}>
                <div className="p-2 border-b">
                  <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-2 border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <p className="text-sm text-gray-800">{notif.message}</p>
                        <p className="text-xs text-gray-500">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </DropdownPortal>
            )}

            {/* Settings for HR and Boss roles */}
            {(currentUser.role === "hr" || currentUser.role === "boss") && (
              <>
                <button
                  ref={settingsRef}
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  aria-label="Settings"
                  disabled={settingsLoading !== null}
                >
                  <FaCog size={iconSize} className={settingsLoading ? "animate-spin" : ""} />
                </button>

                {showSettings && settingsRef.current && (
                  <DropdownPortal anchorRef={settingsRef} onClose={() => setShowSettings(false)}>
                    <div className="py-1">
                     {(currentUser.role === "hr" || currentUser.role === "boss") && (
  <>
    <button
      onClick={() => handleSettingsAction("addUser")}
      disabled={settingsLoading === "addUser"}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
    >
      {settingsLoading === "addUser" ? "Loading..." : "Add User"}
    </button>
    <button
      onClick={() => handleSettingsAction("users")}
      disabled={settingsLoading === "users"}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
    >
      {settingsLoading === "users" ? "Loading..." : "User Management"}
    </button>
    <button
      onClick={() => handleSettingsAction("policies")}
      disabled={settingsLoading === "policies"}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
    >
      {settingsLoading === "policies" ? "Loading..." : "Leave Policies"}
    </button>
    <button
      onClick={() => handleSettingsAction("analytics")}
      disabled={settingsLoading === "analytics"}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
    >
      {settingsLoading === "analytics" ? "Loading..." : "System Analytics"}
    </button>
    <button
      onClick={() => handleSettingsAction("changePassword")}
      disabled={settingsLoading === "changePassword"}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
    >
      {settingsLoading === "changePassword" ? "Loading..." : "Change Password"}
    </button>
  </>
)}
                      {currentUser.role === "boss" && (
                        <>
                          <button
                            onClick={() => handleSettingsAction("delegation")}
                            disabled={settingsLoading === "delegation"}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                          >
                            {settingsLoading === "delegation" ? "Loading..." : "Delegation Settings"}
                          </button>
                          <button
                            onClick={() => handleSettingsAction("config")}
                            disabled={settingsLoading === "config"}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                          >
                            {settingsLoading === "config" ? "Loading..." : "System Configuration"}
                          </button>
                          <button
                            onClick={() => handleSettingsAction("changePassword")}
                            disabled={settingsLoading === "changePassword"}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                          >
                            {settingsLoading === "changePassword" ? "Loading..." : "Change Password"}
                          </button>
                        </>
                      )}
                    </div>
                  </DropdownPortal>
                )}
              </>
            )}

            {/* Profile dropdown */}
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
    <div className="py-1">
      <div className="px-4 py-2 border-b">
        <p className="text-sm font-medium text-gray-800">
          {userInfo ? userInfo.name : "Loading..."}
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {userInfo ? ` ${userInfo.role} • ${userInfo.department} ` : ""}
        </p>
      </div>

      {/* Add User button for HR and Boss roles */}
      {(currentUser.role === "hr" || currentUser.role === "boss") && (
        <button
          onClick={() => {
            setShowProfile(false);
            onNavigate?.("/admin/users/add");
          }}
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          Add User
        </button>
      )}

      <button
        onClick={() => {
          setShowProfile(false);
          onNavigate?.("/profile");
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        View Profile
      </button>
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
      >
        Logout
      </button>
    </div>
  </DropdownPortal>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;