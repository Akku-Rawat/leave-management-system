import React, { useState } from "react";
import { 
  FaUsers, 
  FaCheckCircle, 
  FaClock, 
  FaCalendarAlt, 
  FaChartBar,
  FaExclamationTriangle,
  FaProjectDiagram
} from "react-icons/fa";
import type { LeaveRequestType } from "../Types";

const BossView: React.FC = () => {
  // This data will come from backend
  const [allRequests, setAllRequests] = useState<LeaveRequestType[]>([]);

  const totalRequests = allRequests.length;
  const pendingRequests = allRequests.filter(r => r.status === "Pending").length;
  const approvedRequests = allRequests.filter(r => r.status === "Approved").length;
  const totalLeaveDays = allRequests
    .filter(r => r.status === "Approved")
    .reduce((sum, r) => sum + r.days, 0);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Executive Dashboard</h1>
          <p className="text-gray-600">Complete leave management overview and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-blue-800">{totalRequests}</p>
              </div>
              <FaUsers className="text-3xl text-blue-600" />
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">{pendingRequests}</p>
              </div>
              <FaClock className="text-3xl text-yellow-600" />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-800">{approvedRequests}</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Leave Days</p>
                <p className="text-2xl font-bold text-purple-800">{totalLeaveDays}</p>
              </div>
              <FaCalendarAlt className="text-3xl text-purple-600" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Leave Requests</h2>
          {allRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
              <p>No leave requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Leave Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Days</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allRequests.slice(0, 10).map(request => (
                    <tr key={request.id} className="border-b border-gray-100 hover:bg-white">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-800">{request.employeeName}</div>
                          <div className="text-sm text-gray-500">{request.reason}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{request.department || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-600">{request.type}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {request.startDate} → {request.endDate}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{request.days}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === "Approved" 
                            ? "bg-green-100 text-green-800"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-800"  
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Alert Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-orange-600 text-xl mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">High Pending Requests</h3>
                <p className="text-orange-700">
                  {pendingRequests} requests are pending approval. Consider reviewing them.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
              <FaProjectDiagram className="text-blue-600 text-xl mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Workforce Planning</h3>
                <p className="text-blue-700">
                  Monitor upcoming leave schedules to plan project resources effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossView;