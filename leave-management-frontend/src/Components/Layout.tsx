// src/components/Layout.tsx
import React from "react";
import Sidebar from "./Sidebar";

type Props = { children: React.ReactNode };

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex">
          {/* Sidebar (sticky, takes vertical space only) */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Page content wrapper (padding & max width to keep your current alignment) */}
            <div className="px-6 py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
