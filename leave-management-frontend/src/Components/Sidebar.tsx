import React, { useState } from "react";
import {
  FaPlusCircle,
  FaHistory,
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaBook,
  FaBars,         // Hide/Show icon
  FaUserCircle,   // User icon
  FaSignOutAlt,   // Sign out icon
} from "react-icons/fa";
import type { User } from "../Types";

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
  userRole: User["role"];
  currentUserName: string;
  onLogout?: () => void; // Logout handler (optional)
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onChangeView,
  userRole,
  currentUserName,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const resolvedRole = typeof userRole === "string" ? userRole : userRole.role_name;

  const getMenuItems = () => {
    const items = [];
    if (resolvedRole === "employee") {
      items.push({ id: "apply", icon: <FaPlusCircle />, label: "Apply Leave" });
      items.push({ id: "history", icon: <FaHistory />, label: "History" });
    } else if (resolvedRole === "hr") {
      items.push({ id: "dashboard", icon: <FaTachometerAlt />, label: "HR Dashboard" });
      items.push({ id: "apply", icon: <FaPlusCircle />, label: "Apply Leave" });
      items.push({ id: "history", icon: <FaHistory />, label: "History" });
    } else if (resolvedRole === "boss") {
      items.push({ id: "boss-dashboard", icon: <FaTachometerAlt />, label: "Boss Dashboard" });
      items.push({ id: "employees", icon: <FaUsers />, label: "Employees" });
      items.push({ id: "reports", icon: <FaChartBar />, label: "Reports" });
      items.push({ id: "history", icon: <FaHistory />, label: "History" });
      items.push({ id: "documentation", icon: <FaBook />, label: "Documentation" });
    }
    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={`sidebar ${isOpen ? "open" : "closed"}`}
      style={{
        width: isOpen ? 220 : 60,
        background: "#f6f8fa",
        boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.2s",
        borderRight: "1px solid #eee",
        position: "relative"
      }}
    >
      {/* Top Hide/Show Icon */}
      <div
        style={{
          padding: "16px 8px 7px 8px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "flex-end" : "center",
        }}
      >
        <button
          onClick={() => setIsOpen((open) => !open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: 6,
          }}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          title="Toggle Sidebar"
        >
          <FaBars size={20} color="#474d64" />
        </button>
      </div>

      {/* Menu List */}
      <ul
        className="menu-list"
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={activeView === item.id ? "active" : ""}
            onClick={() => {
              onChangeView(item.id);
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 18px",
              background: activeView === item.id ? "#e3ebfc" : "none",
              color: activeView === item.id ? "#2b6cb0" : "#333",
              fontWeight: activeView === item.id ? 600 : 400,
              borderRadius: "8px",
              margin: "6px 8px",
              width: "calc(100% - 16px)",
            }}
          >
            <span className="icon" style={{ fontSize: 20 }}>
              {item.icon}
            </span>
            {isOpen && <span className="label">{item.label}</span>}
          </li>
        ))}
      </ul>

      {/* Bottom User Info + Logout */}
      <div
        style={{
          borderTop: "1px solid #eee",
          padding: "16px 12px",
          display: "flex",
          flexDirection: isOpen ? "row" : "column",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          gap: isOpen ? "12px" : "0",
          background: "#f6f8fa",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaUserCircle size={22} color="#2563eb" />
          {isOpen && (
            <span style={{ fontSize: 15, color: "#474d64" }}>
              {currentUserName}
            </span>
          )}
        </span>
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: "#e9ecef",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: 15,
              marginLeft: isOpen ? "8px" : "0",
            }}
            title="Sign Out"
          >
            <FaSignOutAlt size={16} />
            {isOpen && "Sign out"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
