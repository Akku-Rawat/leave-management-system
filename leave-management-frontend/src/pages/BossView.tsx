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
  FaFileExport,
  FaBell,
  // FaTrendingUp, // Removed: not exported by react-icons/fa
  // FaTrendingDown,
  FaEye,
  FaDownload,
  FaFilter,
  FaSearch,
  FaChevronRight,
  FaArrowUp,
  FaArrowDown
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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredRequests = leaveRequests.filter(req => {
    const matchesFilter = selectedFilter === "all" || req.status.toLowerCase() === selectedFilter;
    const matchesSearch = searchTerm === "" || 
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">

      {/* Animated Header with Glassmorphism */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-xl">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <FaTachometerAlt className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Executive Dashboard
                </h1>
                <p className="text-gray-600 mt-1 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Complete leave management overview and analytics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaBell className="text-gray-600 text-xl cursor-pointer hover:text-blue-600 transition-colors" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                  {pendingRequests}
                </span>
              </div>
              <button
                onClick={handleExport}
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <FaFileExport className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Critical Alerts with Enhanced Styling */}
        {/* <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.01] transition-all duration-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <FaExclamationTriangle className="text-white" />
              </div>
              Critical Alerts & Notifications
              <div className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full animate-pulse">
                Live
              </div>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {pendingRequests > 2 && (
                <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <FaExclamationTriangle className="text-orange-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-orange-800 mb-2">High Pending Requests</h4>
                      <p className="text-sm text-orange-700 leading-relaxed">
                        {pendingRequests} requests are pending approval. Consider reviewing them urgently.
                      </p>
                      <div className="mt-3 flex items-center text-orange-600">
                        <FaClock className="mr-1 text-xs" />
                        <span className="text-xs font-medium">Requires immediate attention</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <FaUsers className="text-blue-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-800 mb-2">Workforce Planning</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Development team has 2 people on leave next week. Check project impact.
                    </p>
                    <div className="mt-3 flex items-center text-blue-600">
                      <FaChevronRight className="mr-1 text-xs" />
                      <span className="text-xs font-medium">View team schedule</span>
                    </div>
                  </div>
                </div>
              // </div> 

              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-800 mb-2">System Status</h4>
                    <p className="text-sm text-green-700 leading-relaxed">
                      All leave management systems are operational and running smoothly.
                    </p>
                    <div className="mt-3 flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs font-medium">All systems online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Total Requests */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <FaClipboardList className="text-2xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{totalRequests}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">This Month</span>
                <div className="flex items-center text-green-600">
                  <FaArrowUp className="mr-1 text-xs" />
                  <span className="text-xs font-medium">+12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-yellow-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <FaClock className="text-2xl text-white animate-pulse" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-4xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{pendingRequests}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-600 font-medium">Needs Attention</span>
                {pendingRequests > 2 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                )}
              </div>
            </div>
          </div>

          {/* Approved Requests */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <FaCheckCircle className="text-2xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-4xl font-bold text-green-600 group-hover:text-green-700 transition-colors">{approvedRequests}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">
                  {((approvedRequests/totalRequests)*100).toFixed(1)}% Success Rate
                </span>
                <div className="flex items-center text-green-600">
                  <FaArrowUp className="mr-1 text-xs" />
                  <span className="text-xs font-medium">Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Leave Days */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <FaCalendarAlt className="text-2xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Total Leave Days</p>
                  <p className="text-4xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">{totalLeaveDays}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-600 font-medium">Days This Month</span>
                <div className="flex items-center text-blue-600">
                  <FaCalendarAlt className="mr-1 text-xs" />
                  <span className="text-xs font-medium">Tracked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Department Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Department Stats */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <FaUsers className="text-white" />
              </div>
              Department Overview
            </h3>
            <div className="space-y-6">
              {Object.entries(departmentStats).map(([dept, stats], index) => (
                <div key={dept} className="group p-4 bg-gray-50/50 rounded-2xl hover:bg-white/50 transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{dept}</h4>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{stats.total} requests</span>
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-600">{stats.approved}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(stats.approved/stats.total)*100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>✅ Approved: {stats.approved}</span>
                    <span>⏳ Pending: {stats.pending}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <FaChartLine className="text-white" />
              </div>
              Quick Analytics
            </h3>
            <div className="space-y-8">
              {/* Approval Rate */}
              <div>
                <div className="flex justify-between text-sm text-gray-700 mb-3">
                  <span className="font-medium">Overall Approval Rate</span>
                  <span className="font-bold text-green-600">{((approvedRequests/totalRequests)*100).toFixed(1)}%</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(approvedRequests/totalRequests)*100}%` }}
                  ></div>
                </div>
              </div>

              {/* Metrics Cards */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <span className="text-gray-700 font-medium">Average Leave Days</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {(totalLeaveDays/totalRequests).toFixed(1)} days
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                  <span className="text-gray-700 font-medium">Most Common Type</span>
                  <span className="font-bold text-purple-600">Annual Leave</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100">
                  <span className="text-gray-700 font-medium">Est. Cost Impact</span>
                  <span className="font-bold text-red-600 flex items-center">
                    <FaMoneyBillWave className="mr-2" />
                    ₹{(totalLeaveDays * 2500).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Leave Requests Table */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center mb-4 lg:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <FaClipboardList className="text-white" />
              </div>
              Recent Leave Requests
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 w-full sm:w-64"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedFilter === filter
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-white/80 text-gray-600 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <th className="text-left py-4 px-6 font-bold text-gray-900 rounded-tl-2xl">Employee</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900">Department</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900">Leave Type</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900">Duration</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900">Days</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 rounded-tr-2xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, index) => (
                  <tr key={request.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group">
                    <td className="py-6 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{request.employeeName}</p>
                          <p className="text-sm text-gray-500">{request.reason}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {request.department}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-gray-700 font-medium">{request.type}</td>
                    <td className="py-6 px-6 text-gray-600">
                      <div className="text-sm">
                        <div>{request.startDate}</div>
                        <div className="text-gray-400">↓</div>
                        <div>{request.endDate}</div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                        {request.days} days
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center w-fit ${
                        request.status === "Approved" 
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                          : request.status === "Rejected"
                          ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-800"
                          : "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800"
                      }`}>
                        {request.status === "Approved" && <FaCheckCircle className="mr-2" />}
                        {request.status === "Rejected" && <FaTimesCircle className="mr-2" />}
                        {request.status === "Pending" && <FaClock className="mr-2 animate-pulse" />}
                        {request.status}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <button className="group flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                        <FaEye className="mr-2 group-hover:scale-110 transition-transform" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-gray-400 text-xl" />
              </div>
              <p className="text-gray-500 font-medium">No requests found for the selected filter.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BossView;