import React, { useState } from "react";
import { FaPlusCircle, FaHistory, FaTachometerAlt, FaUsers, FaChartBar, FaBook, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
  userRole: "employee" | "hr" | "boss";
  currentUserName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView, userRole, currentUserName }) => {
  const [isOpen, setIsOpen] = useState(true);

  const getMenuItems = () => {
    const items = [];
    if (userRole === "employee") {
      items.push({ id: "apply", icon: <FaPlusCircle />, label: "Apply Leave" });
      items.push({ id: "history", icon: <FaHistory />, label: "History" });
    } else if (userRole === "hr") {
      items.push({ id: "dashboard", icon: <FaTachometerAlt />, label: "HR Dashboard" });
      items.push({ id: "apply", icon: <FaPlusCircle />, label: "Apply Leave" });
      items.push({ id: "history", icon: <FaHistory />, label: "History" });
    } else if (userRole === "boss") {
      items.push({ id: "boss-dashboard", icon: <FaTachometerAlt />, label: "Boss Dashboard" });
      items.push({ id: "employees", icon: <FaUsers />, label: "Employees" });
      items.push({ id: "reports", icon: <FaChartBar />, label: "Reports" });
      items.push({ id: "history", icon: <FaHistory />, label: "History" });
    }
    items.push({ id: "documentation", icon: <FaBook />, label: "Documentation" });
    return items;
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`bg-white border-r h-screen flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
      <div>
        <div className="flex items-center justify-between p-4 border-b">
          {isOpen && <span className="font-bold text-lg">ROLAFACE</span>}
          <button aria-label="Toggle Sidebar" onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {isOpen ? "←" : "→"}
          </button>
        </div>
        <nav className="p-2 flex flex-col space-y-1 overflow-auto">
          {menuItems.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => onChangeView(id)}
              className={`flex items-center w-full p-3 rounded-md gap-3 text-left ${activeView === id ? "bg-blue-100 font-semibold" : "hover:bg-blue-50"}`}
              title={!isOpen ? label : undefined}
            >
              <div className="text-xl w-6 flex justify-center">{icon}</div>
              {isOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </div>
      {/* User & Logout Section */}
      <div className={`mt-auto flex-shrink-0 p-4 border-t ${isOpen ? "" : "flex justify-center"}`}>
        {isOpen ? (
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-2xl text-gray-600" />
            <span className="flex-1 truncate">{currentUserName}</span>
            <button onClick={() => onChangeView("logout")} className="text-gray-600 hover:text-gray-800">
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onChangeView("logout")}
            className="text-xl text-gray-600 hover:text-gray-800"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
