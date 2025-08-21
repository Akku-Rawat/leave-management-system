import React, { useState } from "react";

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView }) => {
  const [isOpen, setIsOpen] = useState(true);

  const buttons = [
    { id: "apply", icon: "fas fa-plus-circle", label: "Apply Leave" },
    { id: "calendar", icon: "fas fa-calendar", label: "Calendar View" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-white shadow-lg min-h-screen transition-all duration-300`}
      >
        {/* Toggle Button */}
       <div className="flex justify-end p-2">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="w-8 h-8 flex items-center justify-center 
               rounded-full bg-blue-600 text-white shadow-md
               hover:bg-blue-700 transition duration-300"
  >
    <i className={`fas ${isOpen ? "fa-angle-left" : "fa-angle-right"}`} />
  </button>
</div>

{/* Sidebar Header */}
<div className="px-4 py-4 border-b">
  {isOpen && (
    <h1 className="text-2xl font-extrabold text-black-600 tracking-wide">
      Leave Portal
    </h1>
  )}
</div>


        <nav className="mt-6">
          <div className="px-2 space-y-2">
            {buttons.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => onChangeView(id)}
                className={`w-full flex items-center px-3 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors ${
                  activeView === id
                    ? "sidebar-active bg-blue-100 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <i className={`fas ${icon} mr-3 text-lg`} />
                {isOpen && <span>{label}</span>}
              </button>
            ))}
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;