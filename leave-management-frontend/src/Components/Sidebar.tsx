// src/components/Sidebar.tsx (add Documentation link)
import React, { useState } from "react";

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
  userRole: 'employee' | 'hr' | 'boss';
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView, userRole }) => {
  const [isOpen, setIsOpen] = useState(true);

  const getMenuItems = () => {
    const items: { id: string; icon: string; label: string }[] = [];

    if (userRole === 'employee') {
      items.push({ id: "apply",    icon: "fas fa-plus-circle",    label: "Apply Leave" });
      items.push({ id: "history",  icon: "fas fa-history",        label: "History"     });
    }
    else if (userRole === 'hr') {
      items.push({ id: "dashboard", icon: "fas fa-tachometer-alt", label: "HR Dashboard" });
      items.push({ id: "apply",     icon: "fas fa-plus-circle",     label: "Apply Leave"   });
      items.push({ id: "history",   icon: "fas fa-history",         label: "History"       });
    }
    else if (userRole === 'boss') {
      items.push({ id: "boss-dashboard", icon: "fas fa-tachometer-alt", label: "Boss Dashboard" });
      items.push({ id: "employees",      icon: "fas fa-users",         label: "Employees"      });
      items.push({ id: "reports",        icon: "fas fa-chart-bar",     label: "Reports"        });
      items.push({ id: "history",        icon: "fas fa-history",       label: "History"        });
    }

    // Documentation link for all roles
    items.push({ id: "documentation", icon: "fas fa-book", label: "Documentation" });

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-16'} bg-white border-r h-screen transition-all`}>
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && <span className="font-bold">ROLAFACE</span>}
        <button onClick={() => setIsOpen(!isOpen)}>
          <i className={`fas ${isOpen ? 'fa-angle-left' : 'fa-angle-right'}`} />
        </button>
      </div>
      <nav className="p-2 flex-1 overflow-y-auto">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex items-center w-full px-3 py-2 mb-1 rounded hover:bg-blue-50 ${
              activeView === item.id ? 'bg-blue-100 font-semibold' : ''
            }`}
          >
            <i className={`${item.icon} w-6`} />
            {isOpen && <span className="ml-2">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
