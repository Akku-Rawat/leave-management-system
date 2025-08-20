import React from "react";

const Header: React.FC = () => (
  <header className="bg-white shadow-lg border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-calendar-alt text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Leave Management Portal</h1>
            <p className="text-sm text-gray-700">ROLAFACE</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">Dixant</p>
              <p className="text-xs text-gray-600">webdeveloper</p>
            </div>
            <img
              className="w-10 h-10 rounded-full ring-2 ring-blue-500"
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
