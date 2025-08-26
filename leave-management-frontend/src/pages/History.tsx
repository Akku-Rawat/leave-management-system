import React, { useState, useMemo } from "react";
import type { LeaveRequestType } from "../Types";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaFileExport,
  FaChartBar,
  FaClipboardList,
  FaEye,
  FaTimes,
  FaCopy,
  FaSearch,
  FaPlus,
  FaFilter,
  FaUser
} from "react-icons/fa";

interface HistoryProps {
  leaveRequests: LeaveRequestType[];
  setActiveView?: (view: string) => void;
  currentUserId?: string;
  userRole?: 'employee' | 'hr' | 'boss';
}

// Enhanced History with unique user filtering
const History: React.FC<HistoryProps> = ({ 
  leaveRequests, 
  setActiveView,
  currentUserId = 'currentUser',
  userRole = 'employee'
}) => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'personal' | 'all'>('personal');

  // Filter requests based on user role and view mode
  const userFilteredRequests = useMemo(() => {
    if (userRole === 'employee') {
      // Employees only see their own requests
      return leaveRequests.filter(req => req.userId === currentUserId || !req.userId);
    } else if (userRole === 'hr' || userRole === 'boss') {
      // HR and Boss can switch between personal and all requests
      if (viewMode === 'personal') {
        return leaveRequests.filter(req => req.userId === currentUserId || !req.userId);
      } else {
        return leaveRequests; // All requests
      }
    }
    return leaveRequests;
  }, [leaveRequests, currentUserId, userRole, viewMode]);

  // Analytics calculation based on filtered requests
  const analytics = useMemo(() => {
    const approved = userFilteredRequests.filter((r) => r.status === "Approved");
    const pending = userFilteredRequests.filter((r) => r.status === "Pending");
    const rejected = userFilteredRequests.filter((r) => r.status === "Rejected");
    const totalApprovedDays = approved.reduce((sum, req) => sum + req.days, 0);

    return {
      totalRequests: userFilteredRequests.length,
      approved: approved.length,
      pending: pending.length,
      rejected: rejected.length,
      totalApprovedDays,
      approvalRate: userFilteredRequests.length > 0 ? Math.round((approved.length / userFilteredRequests.length) * 100) : 0,
    };
  }, [userFilteredRequests]);

  // Filter and search requests
  const filteredRequests = useMemo(() => {
    let filtered = userFilteredRequests;

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.employeeName && req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    filtered = filtered.filter(req => {
      const reqYear = new Date(req.date).getFullYear().toString();
      return reqYear === selectedYear;
    });

    return filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }).slice(0, 5); // Show 5 requests instead of 3
  }, [userFilteredRequests, searchTerm, statusFilter, selectedYear, sortBy]);

  const getStatusConfig = (status: string) => {
    const configs = {
      Approved: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <FaCheckCircle className="w-3 h-3" /> },
      Pending: { bg: "bg-amber-100", text: "text-amber-700", icon: <FaClock className="w-3 h-3" /> },
      Rejected: { bg: "bg-red-100", text: "text-red-700", icon: <FaTimesCircle className="w-3 h-3" /> },
    };
    return configs[status as keyof typeof configs] || configs["Pending"];
  };

  const formatDatePeriod = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "Invalid Date";
    }

    return `${startDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })} → ${endDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })}`;
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";

    const now = new Date();
    const diffDays = Math.floor(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleViewDetails = (r: LeaveRequestType) => {
    setShowNotification(`Viewing ${r.type} details`);
    setTimeout(() => setShowNotification(null), 2000);
  };

  const handleWithdraw = (r: LeaveRequestType) => {
    setShowNotification(`${r.type} withdrawn`);
    setTimeout(() => setShowNotification(null), 2000);
  };

  const handleDuplicate = (r: LeaveRequestType) => {
    setActiveView?.("apply");
    setShowNotification(`Duplicating ${r.type} request`);
    setTimeout(() => setShowNotification(null), 2000);
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Type,Status,Start Date,End Date,Days,Reason,Employee,Date Submitted\n" +
      filteredRequests.map(req => 
        `${req.type},${req.status},${req.startDate},${req.endDate},${req.days},"${req.reason}",${req.employeeName || 'N/A'},${req.date}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leave_history_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowNotification("Data exported successfully!");
    setTimeout(() => setShowNotification(null), 2000);
  };

  return (
    <div className="p-4 bg-gray-50 h-screen overflow-hidden">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {showNotification}
        </div>
      )}

      <div className="h-full flex flex-col space-y-4">

        {/* Enhanced Analytics Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 flex-shrink-0">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-white flex items-center space-x-2">
                  <FaChartBar className="w-4 h-4" />
                  <span>Leave History & Analytics</span>
                </h1>
                <p className="text-blue-100 text-xs mt-1">
                  {viewMode === 'personal' ? 'Your personal leave history' : 'All employee leave history'}
                </p>
              </div>

              {/* View Mode Toggle for HR/Boss */}
              {(userRole === 'hr' || userRole === 'boss') && (
                <div className="flex items-center bg-white bg-opacity-20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('personal')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      viewMode === 'personal' 
                        ? 'bg-white text-blue-700' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    <FaUser className="w-3 h-3 mr-1 inline" />
                    Personal
                  </button>
                  <button
                    onClick={() => setViewMode('all')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      viewMode === 'all' 
                        ? 'bg-white text-blue-700' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    <FaClipboardList className="w-3 h-3 mr-1 inline" />
                    All Employees
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="status">By Status</option>
                  <option value="type">By Type</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3" />
                  <input
                    type="text"
                    placeholder="Search leaves..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-40 bg-white"
                  />
                </div>

                <button
                  onClick={handleExportData}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center"
                >
                  <FaFileExport className="w-3 h-3 mr-1" />
                  Export
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-600 flex items-center justify-between">
              <span>
                Showing {filteredRequests.length} of {userFilteredRequests.length} requests 
                {viewMode === 'all' && userRole !== 'employee' && ` (${viewMode} view)`}
              </span>
              <span className="text-blue-600 font-medium">
                {analytics.totalApprovedDays} days used in {selectedYear}
              </span>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="p-4 grid grid-cols-2 lg:grid-cols-6 gap-3 text-center bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-slate-800">{analytics.totalRequests}</div>
              <div className="text-xs text-slate-600">Total</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-blue-600">{analytics.totalApprovedDays}</div>
              <div className="text-xs text-slate-600">Used Days</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-emerald-600">{analytics.approvalRate}%</div>
              <div className="text-xs text-slate-600">Approval</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-amber-600">{analytics.pending}</div>
              <div className="text-xs text-slate-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-emerald-600">{analytics.approved}</div>
              <div className="text-xs text-slate-600">Approved</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-slate-600">{32 - analytics.totalApprovedDays}</div>
              <div className="text-xs text-slate-600">Remaining</div>
            </div>
          </div>
        </div>

        {/* Enhanced Requests List */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 flex-1 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100">
            <div>
              <h2 className="font-semibold text-slate-800 flex items-center space-x-2">
                <FaClipboardList className="w-4 h-4 text-blue-600" />
                <span>Recent Leave Requests</span>
              </h2>
              <p className="text-xs text-slate-600">
                Latest {filteredRequests.length} requests 
                {viewMode === 'all' && (userRole === 'hr' || userRole === 'boss') && ' (all employees)'}
              </p>
            </div>
            <button
              onClick={() => setActiveView?.("apply")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
            >
              <FaPlus className="w-3 h-3 mr-1" />
              New Request
            </button>
          </div>

          {/* Enhanced Request Cards */}
          <div className="p-4 h-full overflow-auto">
            {filteredRequests.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <FaClipboardList className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-800 mb-2">No Requests Found</h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    {searchTerm || statusFilter !== 'All' 
                      ? 'Try adjusting your search or filters' 
                      : 'Start by creating your first leave request'}
                  </p>
                  <button
                    onClick={() => setActiveView?.("apply")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Request
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((req, index) => {
                  const config = getStatusConfig(req.status);
                  return (
                    <div
                      key={req.id}
                      className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-4 border-l-4 border-l-blue-500 hover:shadow-lg hover:from-blue-50 hover:to-white transition-all duration-200"
                    >
                      {/* Enhanced Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-slate-800 text-sm">{req.type}</h3>
                            {(userRole === 'hr' || userRole === 'boss') && viewMode === 'all' && req.employeeName && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {req.employeeName}
                              </span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                            {config.icon}
                            <span className="ml-1">{req.status}</span>
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {getRelativeTime(req.date)}
                        </div>
                      </div>

                      {/* Enhanced Info Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3 text-xs">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600">{formatDatePeriod(req.startDate, req.endDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaClock className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600">{req.days} days</span>
                        </div>
                        <div className="text-slate-500">
                          Applied: {new Date(req.date).toLocaleDateString("en-GB")}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="mb-3">
                        <p className="text-xs text-slate-600 italic bg-white rounded-lg p-3 border border-slate-200">
                          <strong>Reason:</strong> "{req.reason}"
                        </p>
                      </div>

                      {/* Enhanced Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(req)}
                          className="px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium shadow-sm"
                        >
                          <FaEye className="w-3 h-3 mr-1 inline" />
                          Details
                        </button>
                        {req.status === "Pending" && (
                          <button
                            onClick={() => handleWithdraw(req)}
                            className="px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium shadow-sm"
                          >
                            <FaTimes className="w-3 h-3 mr-1 inline" />
                            Withdraw
                          </button>
                        )}
                        {req.status === "Approved" && (
                          <button
                            onClick={() => handleDuplicate(req)}
                            className="px-3 py-1.5 bg-white text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-xs font-medium shadow-sm"
                          >
                            <FaCopy className="w-3 h-3 mr-1 inline" />
                            Apply Again
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Show more indicator */}
                {userFilteredRequests.length > 5 && (
                  <div className="text-center py-3">
                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      Showing latest 5 of {userFilteredRequests.length} requests
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;