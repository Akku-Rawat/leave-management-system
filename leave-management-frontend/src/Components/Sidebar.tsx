import { useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Calendar, FileText, BarChart2, Settings,
  PlusCircle, Bell, ChevronLeft, ChevronRight
} from "lucide-react";
import clsx from "clsx";

type Item = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  end?: boolean; // for exact match on '/'
  section?: "Manage" | "Calendar" | "Preferences";
};

const ITEMS: Item[] = [
  { label: "Dashboard",       to: "/",              icon: Home,      end: true, section: "Manage" },
  { label: "Apply Leave",     to: "/apply-leave",   icon: PlusCircle,          section: "Manage" },
  { label: "Leave History",   to: "/leave-history", icon: FileText,  badge: 2, section: "Manage" },
  { label: "Leave Balance",   to: "/leave-balance", icon: BarChart2,           section: "Manage" },

  { label: "Holiday Calendar", to: "/holidays",     icon: Calendar,            section: "Calendar" },

  { label: "Settings",         to: "/settings",     icon: Settings,            section: "Preferences" },
];

const SectionLabel = ({ collapsed, children }: { collapsed: boolean; children: React.ReactNode }) => (
  <div className={clsx(
    "px-3 text-[11px] uppercase tracking-wider text-gray-400 mt-4 mb-2",
    collapsed && "sr-only"
  )}>
    {children}
  </div>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const grouped = useMemo(() => {
    return {
      Manage: ITEMS.filter(i => i.section === "Manage"),
      Calendar: ITEMS.filter(i => i.section === "Calendar"),
      Preferences: ITEMS.filter(i => i.section === "Preferences"),
    };
  }, []);

  return (
    <aside
      className={clsx(
        "sticky top-0 h-screen border-r bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        "shadow-sm flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand + collapse */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 grid place-items-center text-white font-bold">
            LF
          </div>
          {!collapsed && <span className="font-semibold text-lg">LeaveFlow</span>}
        </div>
        <button
          onClick={() => setCollapsed(v => !v)}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Quick CTA */}
      {!collapsed && (
        <NavLink
          to="/apply-leave"
          className="mx-4 mb-3 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-white text-sm font-medium hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4" />
          Apply Leave
        </NavLink>
      )}

      <nav className="flex-1 overflow-y-auto pb-4">
        {/* Manage */}
        <SectionLabel collapsed={collapsed}>Leave Management</SectionLabel>
        <ul className="px-2">
          {grouped.Manage.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    "group relative flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                    "hover:bg-blue-50 text-gray-700",
                    isActive && "bg-blue-100 text-blue-700"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500")} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && item.badge && (
                      <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">{item.badge}</span>
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-blue-600" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Calendar */}
        <SectionLabel collapsed={collapsed}>Calendar</SectionLabel>
        <ul className="px-2">
          {grouped.Calendar.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    "group relative flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                    "hover:bg-blue-50 text-gray-700",
                    isActive && "bg-blue-100 text-blue-700"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500")} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-blue-600" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Preferences */}
        <SectionLabel collapsed={collapsed}>Preferences</SectionLabel>
        <ul className="px-2">
          {grouped.Preferences.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    "group relative flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                    "hover:bg-blue-50 text-gray-700",
                    isActive && "bg-blue-100 text-blue-700"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500")} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-blue-600" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User strip */}
      <div className="border-t px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40?img=5"
            alt="avatar"
            className="h-9 w-9 rounded-full"
          />
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-medium">Shivangi Sharma</div>
              <div className="text-xs text-gray-500">UI/UX Designer</div>
            </div>
          )}
        </div>
        <button className="p-2 rounded-md hover:bg-gray-100" aria-label="Notifications">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </aside>
  );
}
