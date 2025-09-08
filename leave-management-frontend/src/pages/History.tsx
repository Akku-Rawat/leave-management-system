import React, { useState, useMemo, useEffect } from "react";
import type { LeaveRequestType, User } from "../Types";
import { FaUserGroup } from "react-icons/fa6";
import { getMyLeaves, getAllLeaves, withdrawLeave } from "../services/api";
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
  FaUser
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


interface HistoryProps {
  onGoBack: () => void;
  leaveRequests?: LeaveRequestType[];
  setActiveView?: (view: string) => void;
  currentUserId: string;
  userRole: User["role"];
}


const History: React.FC<HistoryProps> = ({
  currentUserId = "currentUser",
  userRole = "employee"
}: HistoryProps) => {
  const navigate = useNavigate();


  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"personal" | "all">("personal");
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
   async function fetchLeaveRequests() {
     setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || undefined;


      let data;
      if (userRole === "employee") {
        data = await getMyLeaves(token);
      } else if (userRole === "hr") {
        data = viewMode === "personal" ? await getMyLeaves(token) : await getAllLeaves(token);
      } else if (userRole === "boss") {
        data = await getAllLeaves(token);
      }


      const capitalizeFirstLetter = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();


      const mappedData = data.map((item: any) => {
        let appliedDate;
        if (item.created_at && !isNaN(new Date(item.created_at).getTime())) {
          const createdDate = new Date(item.created_at);
          appliedDate = createdDate.toLocaleDateString("en-GB", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          });
        } else {
          appliedDate = new Date().toLocaleDateString("en-GB");
        }


        return {
          id: item.leave_id,
          userId: item.user_id,
          employeeId: item.user_id,
          start_date: item.start_date,
          end_date: item.end_date,
          type: item.type,
          reason: item.reason,
          status: capitalizeFirstLetter(item.status), // To keep uniform case like "Approved"
          employeeName: item.user?.name || "Unknown",
          date: appliedDate,
          created_at: item.created_at,
          days:
            Math.ceil(
              (new Date(item.end_date).getTime() - new Date(item.start_date).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1
        };
      });


      if (userRole === "hr" && viewMode === "all") {
        setLeaveRequests(mappedData); // No filter here
      } else if (userRole === "hr" && viewMode === "personal") {
        // Fix filter to use userId (key in mappedData is userId, not user_id)
        const personalData = mappedData.filter((item: any) => item.userId === currentUserId);
        setLeaveRequests(personalData);
      } else {
        setLeaveRequests(mappedData);
      }



    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setLeaveRequests([]);
    } finally {
      setIsLoading(false);
    }
  }


    fetchLeaveRequests();
  }, [currentUserId, userRole, viewMode]);


  const currentIdStr = String(currentUserId);


  const userFilteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      const empIdStr = String(req.employeeId || "");
      const userIdStr = String(req.userId || "");
      if (userRole === "employee") {
        return empIdStr === currentIdStr || userIdStr === currentIdStr;
      } else if (userRole === "hr") {
        if (viewMode === "personal") {
          return empIdStr === currentIdStr || userIdStr === currentIdStr;
        } else {
          return true;
        }
      } else if (userRole === "boss") {
        return true;
      }
      return false;
    });
  }, [leaveRequests, currentUserId, userRole, viewMode]);


  const analytics = useMemo(() => {
    const approved = userFilteredRequests.filter((r) => r.status.toLowerCase() === "approved");
    const pending = userFilteredRequests.filter((r) => r.status.toLowerCase() === "pending");
    const rejected = userFilteredRequests.filter((r) => r.status.toLowerCase() === "rejected");
    const totalApprovedDays = approved.reduce((sum, req) => sum + req.days, 0);


    return {
      totalRequests: userFilteredRequests.length,
      approved: approved.length,
      pending: pending.length,
      rejected: rejected.length,
      totalApprovedDays,
      approvalRate:
        userFilteredRequests.length > 0
          ? Math.round((approved.length / userFilteredRequests.length) * 100)
          : 0
    };
  }, [userFilteredRequests]);


  const filteredRequests = useMemo(() => {
    let filtered = userFilteredRequests;


    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (req.employeeName && req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }


    if (statusFilter !== "All") {
      filtered = filtered.filter((req) => req.status.toLowerCase() === statusFilter.toLowerCase());
    }


    filtered = filtered.filter((req) => {
      const reqYear = new Date(req.date).getFullYear().toString();
      return reqYear === selectedYear;
    });


    // Sorting logic based on sortBy select value
    if (sortBy === "date-desc") {
      filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "date-asc") {
      filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "status") {
      filtered = filtered.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortBy === "type") {
      filtered = filtered.sort((a, b) => a.type.localeCompare(b.type));
    }


    return showAll ? filtered : filtered.slice(0, 5);
  }, [userFilteredRequests, searchTerm, statusFilter, selectedYear, sortBy, showAll]);


  const getStatusConfig = (status: string) => {
    const configs = {
      Approved: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <FaCheckCircle className="w-3 h-3" /> },
      pending: { bg: "bg-amber-100", text: "text-amber-700", icon: <FaClock className="w-3 h-3" /> },
      Rejected: { bg: "bg-red-100", text: "text-red-700", icon: <FaTimesCircle className="w-3 h-3" /> }
    };
    return configs[status as keyof typeof configs] || configs["pending"];
  };


  const formatDatePeriod = (start: string, end: string) => {
    const start_date = new Date(start);
    const end_date = new Date(end);


    if (isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
      return "Invalid Date";
    }


    return `${start_date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} → ${end_date.toLocaleDateString(
      "en-GB",
      { day: "2-digit", month: "short" }
    )}`;
  };


  const getRelativeTime = (isoDateStr: string) => {
    const date = new Date(isoDateStr);
    if (isNaN(date.getTime())) return null;


    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));


    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };


  const handleViewDetails = (r: LeaveRequestType) => {
    setShowNotification(`Viewing ${r.type} details`);
    setTimeout(() => setShowNotification(null), 2000);
  };


  const handleWithdraw = async (r: LeaveRequestType) => {
    try {
      const token = localStorage.getItem("token") || undefined;
      await withdrawLeave(r.id, token);
      setShowNotification(`${r.type} withdrawn`);
      setTimeout(() => setShowNotification(null), 2000);
      window.location.reload();
    } catch (error) {
      console.error("Withdraw error:", error);
      alert("Failed to withdraw request");
    }
  };


  const handleDuplicate = (r: LeaveRequestType) => {
    setShowNotification(`Duplicating ${r.type} request`);
    setTimeout(() => setShowNotification(null), 2000);
    navigate("/apply");
  };


  const handleExportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Type,Status,Start Date,End Date,Days,Reason,Employee,Date Submitted\n" +
      filteredRequests
        .map(
          (req) =>
            `${req.type},${req.status},${req.start_date},${req.end_date},${req.days},"${req.reason}",${req.employeeName || "N/A"
            },${req.date}`
        )
        .join("\n");


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


  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);


  const handleNewRequestClick = () => {
    navigate("/apply");
  };


  return (
    <div className="bg-gray-50 h-full flex flex-col overflow-hidden">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {showNotification}
        </div>
      )}


      <div className="w-[1200px] flex-1 flex flex-col overflow-hidden items-center">
        {(userRole === "employee" || userRole === "hr") && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-[1100px] mt-6 flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold text-white flex items-center space-x-2">
                    <FaChartBar className="w-4 h-4" />
                    <span>Leave History</span>
                  </h1>
                  <p className="text-blue-100 text-xs mt-1">
                    {viewMode === "personal" ? "Your personal leave history" : "All employee leave history"}
                  </p>
                </div>


                {userRole === "hr" && (
                  <div className="flex items-center bg-white bg-opacity-20 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("personal")}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === "personal"
                        ? "bg-white text-blue-700"
                        : "text-white hover:bg-white hover:bg-opacity-20"
                        }`}
                    >
                      <FaUser className="w-3 h-3 mr-1 inline" />
                      Personal
                    </button>
                    <button
                      onClick={() => setViewMode("all")}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === "all"
                        ? "bg-white text-blue-700"
                        : "text-white hover:bg-white hover:bg-opacity-20"
                        }`}
                    >
                      <FaClipboardList className="w-3 h-3 mr-1 inline" />
                      All Employees
                    </button>
                  </div>
                )}
              </div>
            </div>


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
                    <option value="pending">pending</option>
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


                  {["hr", "boss"].includes(userRole) && (
                    <button
                      onClick={handleExportData}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center"
                    >
                      <FaFileExport className="w-3 h-3 mr-1" />
                      Export
                    </button>
                  )}
                </div>
              </div>


              <div className="mt-3 text-xs text-gray-600 flex items-center justify-between">
                <span>
                  Showing {filteredRequests.length} of {userFilteredRequests.length} requests{" "}
                  {viewMode === "all" && userRole !== "employee" && ` (${viewMode} view)`}
                </span>
                <span className="text-blue-600 font-medium">{analytics.totalApprovedDays} days used in {selectedYear}</span>
              </div>
            </div>
          </div>
        )}


        {((userRole === "hr" && viewMode === "all") || userRole === "boss") && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mt-4 w-[1100px]">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-2xl">
              <h2 className="font-semibold text-slate-800 flex items-center space-x-2">
                <FaUserGroup className="w-4 h-4 text-indigo-600" />
                <span>Employee Leave Overview</span>
              </h2>
              <p className="text-xs text-slate-600">Summary of leave usage by employees</p>
            </div>
            <div className="p-4 overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-2 text-left">Employee</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Approved</th>
                    <th className="p-2">pending</th>
                    <th className="p-2">Rejected</th>
                    <th className="p-2">Days Used</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    userFilteredRequests.reduce(
                      (
                        acc,
                        req
                      ) => {
                        const name = req.employeeName || "Unknown";
                        if (!acc[name]) {
                          acc[name] = { total: 0, approved: 0, pending: 0, rejected: 0, days: 0 };
                        }
                        acc[name].total += 1;
                        // Convert req.status to lowercase to match keys.
                        const statusKey = req.status.toLowerCase();
                        if(statusKey === "approved" || statusKey === "pending" || statusKey === "rejected"){
                          acc[name][statusKey] += 1;
                        }
                        if (statusKey === "approved") {
                          acc[name].days += req.days;
                        }
                        return acc;
                      },
                      {} as Record<
                        string,
                        { total: number; approved: number; pending: number; rejected: number; days: number }
                      >
                    )
                  ).map(([employee, stats]) => (
                    <tr key={employee} className="border-t">
                      <td className="p-2 text-left font-medium">{employee}</td>
                      <td className="p-2 text-center">{stats.total}</td>
                      <td className="p-2 text-center text-emerald-600">{stats.approved}</td>
                      <td className="p-2 text-center text-amber-600">{stats.pending}</td>
                      <td className="p-2 text-center text-red-600">{stats.rejected}</td>
                      <td className="p-2 text-center">{stats.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {(userRole === "employee" || (userRole === "hr" && viewMode === "personal")) && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden w-[1100px] mt-4">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100">
              <div>
                <h2 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <FaClipboardList className="w-4 h-4 text-blue-600" />
                  <span>Recent Leave Requests</span>
                </h2>
                <p className="text-xs text-slate-600">
                  Latest {filteredRequests.length} requests{" "}
                  {viewMode === "all" && userRole === "hr" && " (all employees)"}
                </p>
              </div>
              <button
                onClick={handleNewRequestClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
              >
                <FaPlus className="w-3 h-3 mr-1" />
                New Request
              </button>
            </div>


           <div className="p-4 h-[350px] overflow-auto">
{isLoading ? (
  <div className="space-y-3 h-[700px]">
    {[...Array(5)].map((_, idx) => (
      <Skeleton key={idx} height={96} />
    ))}
  </div>
) : filteredRequests.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <FaClipboardList className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-slate-800 mb-2">No Requests Found</h3>
                    <p className="text-slate-600 mb-4 text-sm">
                      {searchTerm || statusFilter !== "All"
                        ? "Try adjusting your search or filters"
                        : "Start by creating your first leave request"}
                    </p>
                    <button
                      onClick={handleNewRequestClick}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Request
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 h-[700px]">
                  {filteredRequests.map((req) => {
                    const config = getStatusConfig(req.status);
                    return (
                      <div
                        key={req.id}
                        className="bg-gradient-to-r from-slate-50 to-white rounded-lg p-2 border-l-4 border-l-blue-500 hover:shadow-lg hover:from-blue-50 hover:to-white transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-slate-800 text-sm">{req.type}</h3>
                              {userRole === "hr" && viewMode === "all" && req.employeeName && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {req.employeeName}
                                </span>
                              )}
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                            >
                              {config.icon}
                              {req.status.toLowerCase() !== "pending" && (
                                <span className="ml-1">{req.status}</span>
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">{getRelativeTime(req.created_at)}</div>
                        </div>


                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3 text-xs">
                          <div className="flex items-center space-x-2">
                            <FaCalendarAlt className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">
                              {formatDatePeriod(
                                new Date(req.start_date).toLocaleDateString(),
                                new Date(req.end_date).toLocaleDateString()
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaClock className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">{req.days} days</span>
                          </div>
                          <div className="text-slate-500">Applied: {req.date}</div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                req.status.toLowerCase() === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : req.status.toLowerCase() === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                        </div>


                        <div className="mb-3">
                          <p className="text-xs text-slate-600 italic bg-white rounded-lg p-3 border border-slate-200">
                            <strong>Reason:</strong> "{req.reason}"
                          </p>
                        </div>


                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(req)}
                            className="px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium shadow-sm"
                          >
                            <FaEye className="w-3 h-3 mr-1 inline" />
                            Details
                          </button>
                          {req.status.toLowerCase() === "pending" && (
                            <button
                              onClick={() => handleWithdraw(req)}
                              className="px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium shadow-sm"
                            >
                              <FaTimes className="w-3 h-3 mr-1 inline" />
                              Withdraw
                            </button>
                          )}


                          {req.status.toLowerCase() === "approved" && (
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


                  {!showAll && userFilteredRequests.length > 5 && (
                    <div className="text-center py-3">
                      <button
                        onClick={() => setShowAll(true)}
                        className="text-blue-600 underline text-sm"
                      >
                        See More
                      </button>
                    </div>
                  )}
                  {showAll && (
                    <div className="text-center py-3">
                      <button
                        onClick={() => setShowAll(false)}
                        className="text-blue-600 underline text-sm"
                      >
                        Show Less
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default History;
