import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { User } from "../Types";
import { FaCog, FaBell, FaUserCircle } from "react-icons/fa";
import {
  getUserInfo,
  getUserList,
  getUnreadNotifications,
  markNotificationAsRead,
} from "../services/api";

export interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onNavigate?: (path: string) => void;
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
  const [settingsLoading, setSettingsLoading] = useState<string | null>(null);
  const [, setUserList] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; time: string }[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const notifRef = React.useRef<HTMLButtonElement | null>(null);
  const settingsRef = React.useRef<HTMLButtonElement | null>(null);
  const profileRef = React.useRef<HTMLButtonElement | null>(null);

const refreshNotifications = async () => {
  try {
    const token = localStorage.getItem("token") ?? undefined;
    const data = await getUnreadNotifications(token); // unread endpoint use karo
    data.sort(
  (a: { id: number; message: string; time: string }, b: { id: number; message: string; time: string }) =>
    new Date(b.time).getTime() - new Date(a.time).getTime()
);


    setNotifications(data);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    setNotifications([]);
  }
};
  useEffect(() => {
    refreshNotifications();
  }, []);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const token = localStorage.getItem("token") ?? undefined;
        const data: User = await getUserInfo(token);
        setUserInfo(data);
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
      const token = localStorage.getItem("token") ?? undefined;
      switch (action) {
        case "addUser":
          onNavigate?.("/admin/user/add");
          break;
        case "users":
          const dataUsers: User[] = await getUserList(token);
          setUserList(dataUsers);
          onNavigate?.("/admin/users");
          break;
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

const handleNotificationClick = async (notif: { id: number; leaveId?: number }) => {
  try {
    const token = localStorage.getItem("token") ?? undefined;
    await markNotificationAsRead(notif.id, token);
    setNotifications(prev => prev.filter(n => n.id !== notif.id));  // Turant notification hatao
    if (notif.leaveId) {
      onNavigate?.(`/history/leave/${notif.leaveId}`); // Optional: notification se related leave pe navigation
    }
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
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

          <div className="flex items-center space-x-6 relative right-[-55px]">
            <button
              ref={notifRef}
              onClick={() => {
                setShowNotifications((prev) => !prev);
                refreshNotifications();
              }}
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
                     onClick={() => handleNotificationClick(notif)}
                          >
                     <p className="text-sm text-gray-800">{notif.message}</p>
                   <p className="text-xs text-gray-500">{notif.time}</p>
                </div>
                 ))

                  )}
                </div>
              </DropdownPortal>
            )}

            {(currentUser.role === "hr" || currentUser.role === "boss") && (
              <>
                <button
                  ref={settingsRef}
                  onClick={() => setShowSettings((prev) => !prev)}
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
                        </>
                      )}
                    </div>
                  </DropdownPortal>
                )}
              </>
            )}

            <button
              ref={profileRef}
              onClick={() => setShowProfile((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              aria-label="Profile"
            >
              <FaUserCircle size={iconSize} />
            </button>

            {showProfile && profileRef.current && (
              <DropdownPortal anchorRef={profileRef} onClose={() => setShowProfile(false)}>
                <div className="py-1">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-800">{userInfo ? userInfo.name : "Loading..."}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userInfo
                        ? `${typeof userInfo.role === "string"
                            ? userInfo.role
                            : userInfo.role?.role_name || ""} ${
                            userInfo.department ? ` • ${userInfo.department}` : ""
                          }`
                        : ""}
                    </p>
                  </div>

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
