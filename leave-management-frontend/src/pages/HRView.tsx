import React, { useState } from "react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClipboardList } from "react-icons/fa";
import type { LeaveRequestType } from "../Types";

const HRView: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequestType[]>([
    {
      id: "1",
      employeeName: "Rohit Sharma",
      type: "Annual Leave",
      status: "Pending",
      startDate: "2025-08-28",
      endDate: "2025-08-30",
      days: 3,
      reason: "Vacation trip",
    },
    {
      id: "2",
      employeeName: "Sneha Gupta",
      type: "Sick Leave",
      status: "Pending",
      startDate: "2025-08-25",
      endDate: "2025-08-26",
      days: 2,
      reason: "Fever & rest",
    },
  ]);

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)]">

            {/* LEFT PANEL - Stats */}
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-8">
              <div className="text-white space-y-6">
                <h2 className="text-2xl font-bold flex items-center mb-4">
                  <FaUsers className="mr-3" /> HR Dashboard
                </h2>
                <p className="text-blue-100 text-lg">Manage employee leave requests</p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/20 rounded-2xl p-4 shadow-2xl">
                    <div className="text-3xl font-bold text-white">
                      {requests.length}
                    </div>
                    <div className="text-sm text-blue-100">Total Requests</div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4 shadow-2xl">
                    <div className="text-3xl font-bold text-emerald-300">
                      {requests.filter((r) => r.status === "Approved").length}
                    </div>
                    <div className="text-sm text-blue-100">Approved</div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4 shadow-2xl">
                    <div className="text-3xl font-bold text-amber-300">
                      {requests.filter((r) => r.status === "Pending").length}
                    </div>
                    <div className="text-sm text-blue-100">Pending</div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4 shadow-2xl">
                    <div className="text-3xl font-bold text-rose-300">
                      {requests.filter((r) => r.status === "Rejected").length}
                    </div>
                    <div className="text-sm text-blue-100">Rejected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - Requests List */}
            <div className="lg:w-3/5 p-8 bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
              <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FaClipboardList className="mr-3 text-blue-600" /> Leave Requests
              </h3>

              <div className="space-y-6">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {req.Name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {req.type} • {req.start} → {req.end} ({req.days} days)
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{req.reason}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          req.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : req.status === "Rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {req.status === "Pending" && (
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => handleAction(req.id, "Approved")}
                          className="flex items-center px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition"
                        >
                          <FaCheckCircle className="mr-2" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "Rejected")}
                          className="flex items-center px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition"
                        >
                          <FaTimesCircle className="mr-2" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {requests.length === 0 && (
                  <p className="text-gray-500">No leave requests found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRView;
