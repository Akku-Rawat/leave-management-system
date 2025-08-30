import React, { useState, useEffect } from "react";
import {
  FaHistory,
  
  FaFilter,
  FaFileExport,
  FaEye,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface LeaveHistoryRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: string;
  totalDays: number;
  startDate: string;
  endDate: string;
  appliedDate: string;
  approvalDate?: string;
  status: "Approved" | "Rejected" | "Pending";
  reason: string;
  approvedBy?: string;
  rejectionReason?: string;
}

const EmployeeHistory: React.FC = () => {
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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/leaves/history"); // Your backend endpoint
        const data = await res.json();
        setAllRecords(data);
      } catch (error) {
        console.error("Error fetching leave history: ", error);
      }
    }
    fetchData();
  }, []);

  const departments = Array.from(new Set(allRecords.map((r) => r.department)));
  const leaveTypes = Array.from(new Set(allRecords.map((r) => r.leaveType)));
  const statuses = ["Approved", "Rejected", "Pending"];

  const filteredRecords = allRecords.filter((record) => {
    const matchesSearch =
      !searchTerm ||
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || record.department === selectedDepartment;
    const matchesLeaveType = !selectedLeaveType || record.leaveType === selectedLeaveType;
    const matchesStatus = !selectedStatus || record.status === selectedStatus;
    const matchesDateRange = (!dateFrom || record.startDate >= dateFrom) && (!dateTo || record.endDate <= dateTo);
    return matchesSearch && matchesDepartment && matchesLeaveType && matchesStatus && matchesDateRange;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let aVal = a[sortField] ?? "";
    let bVal = b[sortField] ?? "";
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

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
    alert("Exporting filtered data...");
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaHistory className="mr-3 text-blue-600" /> Employee Leave History
          </h1>
          <p className="text-gray-600">Complete leave records and analytics for all employees</p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <FaFileExport className="mr-2" /> Export Data
        </button>
      </div>

      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="flex justify-between Items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <FaFilter className="mr-2" /> Search & Filters
          </h2>
          {(searchTerm || selectedDepartment || selectedLeaveType || selectedStatus || dateFrom || dateTo) && (
            <button onClick={clearFilters} className="flex items-center text-red-600 hover:underline">
              <FaTimes className="mr-1" /> Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by Employee Name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedLeaveType}
            onChange={(e) => setSelectedLeaveType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Leave Types</option>
            {leaveTypes.map((lt) => (
              <option key={lt} value={lt}>
                {lt}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="From Date"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="To Date"
          />
        </div>
      </div>

      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs">
              <th onClick={() => handleSort("employeeName")} className="cursor-pointer px-4 py-3">
                Employee {sortField === "employeeName" && (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("department")} className="cursor-pointer px-4 py-3">
                Department {sortField === "department" && (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("leaveType")} className="cursor-pointer px-4 py-3">
                Leave Type {sortField === "leaveType" && (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("startDate")} className="cursor-pointer px-4 py-3">
                Duration {sortField === "startDate" && (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("totalDays")} className="cursor-pointer px-4 py-3">
                Days {sortField === "totalDays" && (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("appliedDate")} className="cursor-pointer px-4 py-3">
                Applied Date {sortField === "appliedDate" && (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("status")} className="cursor-pointer px-4 py-3">
                Status {sortField === "status" && (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length ? currentRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{record.employeeName}</td>
                <td className="px-4 py-3">{record.department}</td>
                <td className="px-4 py-3">{record.leaveType}</td>
                <td className="px-4 py-3">{record.startDate} to {record.endDate}</td>
                <td className="px-4 py-3">{record.totalDays}</td>
                <td className="px-4 py-3">{record.appliedDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                    {getStatusIcon(record.status)} {record.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                    <FaEye className="mr-1" /> View
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <FaChevronLeft /> Prev
          </button>
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );

  function getStatusColor(status: string) {
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
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "Approved":
        return <FaCheckCircle className="inline-block mr-1 text-green-600" />;
      case "Rejected":
        return <FaTimesCircle className="inline-block mr-1 text-red-600" />;
      case "Pending":
        return <FaClock className="inline-block mr-1 text-yellow-600" />;
      default:
        return null;
    }
  }
};

export default EmployeeHistory;
