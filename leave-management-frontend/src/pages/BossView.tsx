import React, { useState } from "react";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine, 
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMoneyBillWave,
  FaFileExport
} from "react-icons/fa";

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  status: "Pending" | "Approved" | "Rejected";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  managerApproval?: string;
}

const BossView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Sample data for boss dashboard
  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "Rohit Sharma",
      department: "Development",
      type: "Annual Leave",
      status: "Pending",
      startDate: "2025-09-01",
      endDate: "2025-09-03",
      days: 3,
      reason: "Family vacation",
      managerApproval: "Pending"
    },
    {
      id: "2",
      employeeName: "Priya Singh",
      department: "HR",
      type: "Sick Leave",
      status: "Approved",
      startDate: "2025-08-28",
      endDate: "2025-08-29",
      days: 2,
      reason: "Medical checkup"
    },
    {
      id: "3",
      employeeName: "Amit Kumar",
      department: "Marketing",
      type: "Emergency Leave",
      status: "Pending",
      startDate: "2025-09-05",
      endDate: "2025-09-06",
      days: 2,
      reason: "Family emergency"
    },
    {
      id: "4",
      employeeName: "Sneha Patel",
      department: "Development",
      type: "Annual Leave",
      status: "Rejected",
      startDate: "2025-08-30",
      endDate: "2025-09-01",
      days: 3,
      reason: "Personal work"
    },
    {
      id: "5",
      employeeName: "Vikash Gupta",
      department: "Sales",
      type: "Sick Leave",
      status: "Approved",
      startDate: "2025-08-26",
      endDate: "2025-08-27",
      days: 2,
      reason: "Fever and rest"
    }
  ]);

  // Calculate KPIs
  const totalRequests = leaveRequests.length;
  const pendingRequests = leaveRequests.filter(req => req.status === "Pending").length;
  const approvedRequests = leaveRequests.filter(req => req.status === "Approved").length;
  const rejectedRequests = leaveRequests.filter(req => req.status === "Rejected").length;
  const totalLeaveDays = leaveRequests.reduce((sum, req) => sum + req.days, 0);

  // Department wise breakdown
  const departmentStats = leaveRequests.reduce((acc, req) => {
    if (!acc[req.department]) {
      acc[req.department] = { total: 0, pending: 0, approved: 0 };
    }
    acc[req.department].total += 1;
    if (req.status === "Pending") acc[req.department].pending += 1;
    if (req.status === "Approved") acc[req.department].approved += 1;
    return acc;
  }, {} as Record<string, { total: number; pending: number; approved: number }>);

  const handleExport = () => {
    alert("Exporting dashboard data to Excel...");
  };

  const filteredRequests = selectedFilter === "all" 
    ? leaveRequests 
    : leaveRequests.filter(req => req.status.toLowerCase() === selectedFilter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaTachometerAlt className="mr-3 text-blue-600" />
              Executive Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Complete leave management overview and analytics</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition"
          >
            <FaFileExport className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Requests */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{totalRequests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaClipboardList className="text-xl text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">This Month</span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{pendingRequests}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FaClock className="text-xl text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-orange-600">Needs Attention</span>
          </div>
        </div>

        {/* Approved Requests */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{approvedRequests}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-xl text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">
              {((approvedRequests/totalRequests)*100).toFixed(1)}% Success Rate
            </span>
          </div>
        </div>

        {/* Total Leave Days */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leave Days</p>
              <p className="text-3xl font-bold text-purple-600">{totalLeaveDays}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaCalendarAlt className="text-xl text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600">Days This Month</span>
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Department Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FaUsers className="mr-3 text-indigo-600" />
            Department Overview
          </h3>
          <div className="space-y-4">
            {Object.entries(departmentStats).map(([dept, stats]) => (
              <div key={dept} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{dept}</h4>
                  <span className="text-sm text-gray-500">{stats.total} requests</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(stats.approved/stats.total)*100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Approved: {stats.approved}</span>
                  <span>Pending: {stats.pending}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FaChartLine className="mr-3 text-green-600" />
            Quick Analytics
          </h3>
          <div className="space-y-6">
            {/* Approval Rate */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Approval Rate</span>
                <span>{((approvedRequests/totalRequests)*100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full" 
                  style={{ width: `${(approvedRequests/totalRequests)*100}%` }}
                ></div>
              </div>
            </div>

            {/* Average Days */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Average Leave Days</span>
              <span className="font-semibold text-gray-900">
                {(totalLeaveDays/totalRequests).toFixed(1)} days
              </span>
            </div>

            {/* Most Common Leave Type */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Most Common Type</span>
              <span className="font-semibold text-gray-900">Annual Leave</span>
            </div>

            {/* Cost Impact */}
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Est. Cost Impact</span>
              <span className="font-semibold text-red-600 flex items-center">
                <FaMoneyBillWave className="mr-1" />
                ₹{(totalLeaveDays * 2500).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leave Requests */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaClipboardList className="mr-3 text-blue-600" />
            Recent Leave Requests
          </h3>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {["all", "pending", "approved", "rejected"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Employee</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Leave Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Duration</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Days</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{request.employeeName}</p>
                      <p className="text-sm text-gray-500">{request.reason}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{request.department}</td>
                  <td className="py-4 px-4 text-gray-600">{request.type}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {request.startDate} → {request.endDate}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{request.days}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === "Approved" 
                        ? "bg-green-100 text-green-800"
                        : request.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-orange-100 text-orange-800"
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No requests found for the selected filter.
          </div>
        )}
      </div>

      {/* Critical Alerts */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <FaExclamationTriangle className="mr-3 text-red-600" />
          Critical Alerts & Notifications
        </h3>

        <div className="space-y-4">
          {pendingRequests > 5 && (
            <div className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <FaExclamationTriangle className="text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-orange-800">High Pending Requests</p>
                <p className="text-sm text-orange-600">
                  {pendingRequests} requests are pending approval. Consider reviewing them.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <FaUsers className="text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-800">Workforce Planning</p>
              <p className="text-sm text-blue-600">
                Development team has 2 people on leave next week. Check project impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossView;