import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaFileExport,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import type { LeaveHistoryRecord } from "../Types";

const EmployeeHistory: React.FC = () => {
  // This will be fetched from backend
  const [allRecords, setAllRecords] = useState<LeaveHistoryRecord[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<keyof LeaveHistoryRecord>("appliedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const departments = Array.from(new Set(allRecords.map(r => r.department)));
  const leaveTypes = Array.from(new Set(allRecords.map(r => r.leaveType)));
  const statuses: LeaveHistoryRecord["status"][] = ["Approved", "Pending", "Rejected"];

  const filtered = allRecords
    .filter(r =>
      (!searchTerm ||
        r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedDepartment || r.department === selectedDepartment) &&
      (!selectedLeaveType || r.leaveType === selectedLeaveType) &&
      (!selectedStatus || r.status === selectedStatus) &&
      (!dateFrom || r.startDate >= dateFrom) &&
      (!dateTo || r.endDate <= dateTo)
    )
    .sort((a, b) => {
      const aVal = ("" + a[sortField]).toLowerCase();
      const bVal = ("" + b[sortField]).toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  const startIdx = (currentPage - 1) * recordsPerPage;
  const pageRecords = filtered.slice(startIdx, startIdx + recordsPerPage);

  const handleSort = (field: keyof LeaveHistoryRecord) => {
    if (sortField === field) {
      setSortDirection(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    // This will be implemented to export data
    alert("Export functionality will be implemented");
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaHistory className="text-2xl text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Employee Leave History</h1>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaFileExport className="mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-6 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded w-full"
          />
        </div>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={selectedLeaveType}
          onChange={(e) => setSelectedLeaveType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Types</option>
          {leaveTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input
          type="date"
          placeholder="From Date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="date"
          placeholder="To Date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {["employeeName", "department", "leaveType", "startDate", "totalDays", "appliedDate", "status"].map((field, i) => (
                <th key={i} className="border p-3 text-left">
                  <button
                    onClick={() => handleSort(field as keyof LeaveHistoryRecord)}
                    className="flex items-center"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (
                      sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                  </button>
                </th>
              ))}
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="border p-8 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : pageRecords.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border p-3">
                  <div>
                    <div className="font-medium">{r.employeeName}</div>
                    <div className="text-sm text-gray-500">{r.employeeId}</div>
                  </div>
                </td>
                <td className="border p-3">{r.department}</td>
                <td className="border p-3">{r.leaveType}</td>
                <td className="border p-3">
                  {r.startDate} → {r.endDate}
                </td>
                <td className="border p-3">{r.totalDays}</td>
                <td className="border p-3">{r.appliedDate}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    r.status === "Approved" 
                      ? "bg-green-100 text-green-800"
                      : r.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {r.status === "Approved" && <FaCheckCircle className="inline mr-1" />}
                    {r.status === "Rejected" && <FaTimesCircle className="inline mr-1" />}
                    {r.status === "Pending" && <FaClock className="inline mr-1" />}
                    {r.status}
                  </span>
                </td>
                <td className="border p-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <FaChevronLeft className="mr-1 inline" />
            Prev
          </button>

          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
            <FaChevronRight className="ml-1 inline" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeHistory;