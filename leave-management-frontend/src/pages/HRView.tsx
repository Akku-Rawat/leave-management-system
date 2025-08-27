import React, { useState } from "react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClipboardList, FaClock } from "react-icons/fa";
import type { LeaveRequestType } from "../Types";

const HRView: React.FC = () => {
  // This will be fetched from backend
  const [requests, setRequests] = useState<LeaveRequestType[]>([]);

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  const totalRequests = requests.length;
  const approvedRequests = requests.filter((r) => r.status === "Approved").length;
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const rejectedRequests = requests.filter((r) => r.status === "Rejected").length;

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
      <div className="grid lg:grid-cols-5 gap-8 p-8">
        {/* LEFT PANEL - Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">HR Dashboard</h1>
            <p className="text-gray-600">Manage employee leave requests</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <FaClipboardList className="mx-auto text-3xl text-blue-600 mb-3" />
              <div className="text-2xl font-bold text-blue-800">{totalRequests}</div>
              <div className="text-sm text-blue-600">Total Requests</div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl text-center">
              <FaCheckCircle className="mx-auto text-3xl text-green-600 mb-3" />
              <div className="text-2xl font-bold text-green-800">{approvedRequests}</div>
              <div className="text-sm text-green-600">Approved</div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl text-center">
              <FaClock className="mx-auto text-3xl text-yellow-600 mb-3" />
              <div className="text-2xl font-bold text-yellow-800">{pendingRequests}</div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>

            <div className="bg-red-50 p-6 rounded-xl text-center">
              <FaTimesCircle className="mx-auto text-3xl text-red-600 mb-3" />
              <div className="text-2xl font-bold text-red-800">{rejectedRequests}</div>
              <div className="text-sm text-red-600">Rejected</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Requests List */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Leave Requests</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {requests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaClipboardList className="mx-auto text-4xl text-gray-300 mb-4" />
                <p>No leave requests found.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-gray-50 p-6 rounded-lg border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{req.employeeName}</h3>
                      <p className="text-sm text-gray-600">
                        {req.type} • {req.startDate} → {req.endDate} ({req.days} days)
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{req.reason}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : req.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  {req.status === "Pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(req.id, "Approved")}
                        className="flex items-center px-5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg shadow-sm transition"
                      >
                        <FaCheckCircle className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "Rejected")}
                        className="flex items-center px-5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg shadow-sm transition"
                      >
                        <FaTimesCircle className="mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRView;