import React, { useState } from "react";
import { 
  FaHistory, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaUsers, 
  FaFileExport,
  FaEye,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

interface LeaveHistoryRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  appliedDate: string;
  approvalDate?: string;
  status: "Approved" | "Rejected" | "Pending";
  reason: string;
  approvedBy?: string;
  rejectionReason?: string;
}

const EmployeeHistory: React.FC = () => {
  // Sample data - you can replace this with API call
  const [allRecords] = useState<LeaveHistoryRecord[]>([
    {
      id: "1",
      employeeName: "Rohit Sharma",
      employeeId: "EMP001",
      department: "Development",
      leaveType: "Annual Leave",
      startDate: "2025-08-15",
      endDate: "2025-08-17",
      totalDays: 3,
      appliedDate: "2025-08-10",
      approvalDate: "2025-08-12",
      status: "Approved",
      reason: "Family vacation",
      approvedBy: "Manager A"
    },
    {
      id: "2",
      employeeName: "Priya Singh",
      employeeId: "EMP002",
      department: "HR",
      leaveType: "Sick Leave",
      startDate: "2025-08-20",
      endDate: "2025-08-22",
      totalDays: 3,
      appliedDate: "2025-08-19",
      approvalDate: "2025-08-20",
      status: "Approved",
      reason: "Medical checkup",
      approvedBy: "HR Head"
    },
    {
      id: "3",
      employeeName: "Amit Kumar",
      employeeId: "EMP003",
      department: "Marketing",
      leaveType: "Emergency Leave",
      startDate: "2025-08-25",
      endDate: "2025-08-26",
      totalDays: 2,
      appliedDate: "2025-08-24",
      status: "Pending",
      reason: "Family emergency"
    },
    {
      id: "4",
      employeeName: "Sneha Patel",
      employeeId: "EMP004",
      department: "Development",
      leaveType: "Annual Leave",
      startDate: "2025-07-10",
      endDate: "2025-07-15",
      totalDays: 6,
      appliedDate: "2025-07-01",
      approvalDate: "2025-07-03",
      status: "Rejected",
      reason: "Personal work",
      rejectionReason: "Project deadline conflict"
    },
    {
      id: "5",
      employeeName: "Vikash Gupta",
      employeeId: "EMP005",
      department: "Sales",
      leaveType: "Sick Leave",
      startDate: "2025-08-01",
      endDate: "2025-08-03",
      totalDays: 3,
      appliedDate: "2025-07-30",
      approvalDate: "2025-08-01",
      status: "Approved",
      reason: "Fever and rest",
      approvedBy: "Sales Manager"
    },
    {
      id: "6",
      employeeName: "Anjali Rao",
      employeeId: "EMP006",
      department: "Finance",
      leaveType: "Annual Leave",
      startDate: "2025-09-01",
      endDate: "2025-09-05",
      totalDays: 5,
      appliedDate: "2025-08-15",
      status: "Pending",
      reason: "Wedding ceremony"
    }
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<keyof LeaveHistoryRecord>("appliedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  // Get unique values for filter dropdowns
  const departments = Array.from(new Set(allRecords.map(r => r.department)));
  const leaveTypes = Array.from(new Set(allRecords.map(r => r.leaveType)));
  const statuses = ["Approved", "Pending", "Rejected"];

  // Apply filters
  const filteredRecords = allRecords.filter(record => {
    const matchesSearch = !searchTerm || 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = !selectedDepartment || record.department === selectedDepartment;
    const matchesLeaveType = !selectedLeaveType || record.leaveType === selectedLeaveType;
    const matchesStatus = !selectedStatus || record.status === selectedStatus;

    const matchesDateRange = (!dateFrom || record.startDate >= dateFrom) && 
                            (!dateTo || record.endDate <= dateTo);

    return matchesSearch && matchesDepartment && matchesLeaveType && matchesStatus && matchesDateRange;
  });

  // Apply sorting
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let aVal = a[sortField] ?? "";
    let bVal = b[sortField] ?? "";

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = sortedRecords.slice(startIndex, startIndex + recordsPerPage);

  const handleSort = (field: keyof LeaveHistoryRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedLeaveType("");
    setSelectedStatus("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleExport = () => {
    alert("Exporting filtered employee history data...");
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Pending": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Approved": return <FaCheckCircle className="text-green-600" />;
      case "Rejected": return <FaTimesCircle className="text-red-600" />;
      case "Pending": return <FaClock className="text-orange-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaHistory className="mr-3 text-blue-600" />
              Employee Leave History
            </h1>
            <p className="text-gray-600 mt-2">Complete leave records and analytics for all employees</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition"
          >
            <FaFileExport className="mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaFilter className="mr-3 text-indigo-600" />
            Search & Filters
          </h2>
          {(searchTerm || selectedDepartment || selectedLeaveType || selectedStatus || dateFrom || dateTo) && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <FaTimes className="mr-2" />
              Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Employee
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Name or Employee ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Leave Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type
            </label>
            <select
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {leaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {currentRecords.length} of {filteredRecords.length} records
            {filteredRecords.length !== allRecords.length && ` (filtered from ${allRecords.length} total)`}
          </div>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("employeeName")}
                    className="flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600"
                  >
                    Employee
                    {sortField === "employeeName" && (
                      sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("department")}
                    className="flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600"
                  >
                    Department
                    {sortField === "department" && (
                      sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("leaveType")}
                    className="flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600"
                  >
                    Leave Type
                    {sortField === "leaveType" && (
                      sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("startDate")}
                    className="flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600"
                  >
                    Duration
                    {sortField === "startDate" && (
                      sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("totalDays")}
                    className="flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600"
                  >
                    Days
                    {sortField === "totalDays" && (
                      sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("appliedDate")}
                    className="flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600"
                  >
                    Applied Date
                    {sortField === "appliedDate" && (
                      sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600"
                  >
                    Status
                    {sortField === "status" && (
                      sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{record.employeeName}</div>
                      <div className="text-sm text-gray-500">{record.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.leaveType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div>{record.startDate}</div>
                      <div className="text-gray-500">to {record.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.totalDays}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.appliedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(record.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <FaEye className="mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentRecords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No records found</div>
            <div className="text-gray-400 text-sm">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredRecords.length)} of {filteredRecords.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="mr-1" />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FaChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHistory;