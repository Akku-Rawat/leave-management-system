import React from "react";
import { FaUsers, FaCalendarAlt, FaClock, FaCheckCircle } from "react-icons/fa";

interface DashboardProps {
  userRole?: "employee" | "hr" | "boss";
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = "employee" }) => {
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Leave Management System</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl text-center">
          <FaCalendarAlt className="mx-auto text-3xl text-blue-600 mb-3" />
          <div className="text-2xl font-bold text-blue-800">0</div>
          <div className="text-sm text-blue-600">Total Leaves</div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl text-center">
          <FaCheckCircle className="mx-auto text-3xl text-green-600 mb-3" />
          <div className="text-2xl font-bold text-green-800">0</div>
          <div className="text-sm text-green-600">Approved</div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl text-center">
          <FaClock className="mx-auto text-3xl text-yellow-600 mb-3" />
          <div className="text-2xl font-bold text-yellow-800">0</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl text-center">
          <FaUsers className="mx-auto text-3xl text-purple-600 mb-3" />
          <div className="text-2xl font-bold text-purple-800">0</div>
          <div className="text-sm text-purple-600">Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;