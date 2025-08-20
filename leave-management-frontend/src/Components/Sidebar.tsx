import React from "react";

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView }) => {
  const buttons = [
    { id: "dashboard", icon: "fas fa-tachometer-alt", label: "APPLY LEAVE" },
    // { id: "apply", icon: "fas fa-plus-circle", label: "Apply Leave" },
    // { id: "history", icon: "fas fa-history", label: "Leave History" },
    // { id: "calendar", icon: "fas fa-calendar", label: "Calendar View" },
    // { id: "balance", icon: "fas fa-chart-pie", label: "Leave Balance" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {buttons.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => onChangeView(id)}
              className={`w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors ${
                activeView === id ? "sidebar-active bg-blue-100 border-l-4 border-blue-500" : ""
              }`}
            >
              <i className={`${icon} mr-3`}></i>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
