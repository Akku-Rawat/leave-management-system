import React, { useState, useMemo } from "react";
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaUser,
  FaUsers
} from "react-icons/fa";
import type { LeaveRequestType } from "../Types";

interface HistoryProps {
  userRole: "employee" | "hr" | "boss";
  allRequests?: LeaveRequestType[];
  currentUserId?: string;
}

const History: React.FC<HistoryProps> = ({ 
  userRole, 
  allRequests = [], 
  currentUserId 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"personal" | "all">(
    userRole === "employee" ? "personal" : "all"
  );

  // Filter requests based on view mode and user role
  const filteredRequests = useMemo(() => {
    let requests = allRequests;

    // Filter by view mode
    if (viewMode === "personal" && currentUserId) {
      requests = requests.filter(req => req.employeeName === currentUserId);
    }

    // Filter by search term
    if (searchTerm) {
      requests = requests.filter(req =>
        req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      requests = requests.filter(req => req.status === statusFilter);
    }

    return requests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allRequests, viewMode, currentUserId, searchTerm, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const employees = new Map<string, {
      total: number;
      Approved: number;
      Pending: number;
      Rejected: number;
      days: number;
    }>();

    filteredRequests.forEach(req => {
      if (!employees.has(req.employeeName)) {
        employees.set(req.employeeName, {
          total: 0,
          Approved: 0,
          Pending: 0,
          Rejected: 0,
          days: 0
        });
      }

      const employeeStats = employees.get(req.employeeName)!;
      employeeStats.total++;
      employeeStats[req.status]++;
      if (req.status === "Approved") {
        employeeStats.days += req.days;
      }
    });

    return employees;
  }, [filteredRequests]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle className="text-green-600" />;
      case "Rejected":
        return <FaTimesCircle className="text-red-600" />;
      case "Pending":
        return <FaClock className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Leave History</h1>
        <p className="text-gray-600">
          {viewMode === 'personal' ? 'Your personal leave history' : 'All employee leave history'}
        </p>
      </div>

      {/* View Mode Toggle (for HR and Boss) */}
      {(userRole === "hr" || userRole === "boss") && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">View Mode:</span>
          <button
            onClick={() => setViewMode("personal")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              viewMode === "personal" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaUser />
            Personal
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              viewMode === "all" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaUsers />
            All Employees
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee, type, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded w-full"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="All">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaFilter />
          <span>Showing {filteredRequests.length} results</span>
        </div>
      </div>

      {/* Summary Stats (for all view mode) */}
      {viewMode === "all" && stats.size > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Summary of leave usage by employees
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-gray-50 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Employee</th>
                  <th className="border p-3 text-left">Total</th>
                  <th className="border p-3 text-left">Approved</th>
                  <th className="border p-3 text-left">Pending</th>
                  <th className="border p-3 text-left">Rejected</th>
                  <th className="border p-3 text-left">Days Used</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(stats.entries()).map(([employee, employeeStats]) => (
                  <tr key={employee} className="hover:bg-white">
                    <td className="border p-3 font-medium">{employee}</td>
                    <td className="border p-3">{employeeStats.total}</td>
                    <td className="border p-3">{employeeStats.Approved}</td>
                    <td className="border p-3">{employeeStats.Pending}</td>
                    <td className="border p-3">{employeeStats.Rejected}</td>
                    <td className="border p-3">{employeeStats.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Requests List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Latest {filteredRequests.length} requests{' '}
          {viewMode === 'all' && userRole === 'hr' && ' (all employees)'}
        </h2>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No leave requests found</p>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'Start by creating your first leave request'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div key={req.id} className="bg-gray-50 p-6 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{req.employeeName}</h3>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{req.type}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {req.startDate} to {req.endDate} ({req.days} days)
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Reason:</strong> "{req.reason}"
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)}
                      {req.status}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Applied on: {req.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;