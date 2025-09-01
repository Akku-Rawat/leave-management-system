import React, { useState, useEffect } from "react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClipboardList } from "react-icons/fa";
import type { LeaveRequestType } from "../Types";

const HRView: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequestType[]>([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/leave-requests"); // API endpoint को अपने backend के अनुसार बदलें
        if (!res.ok) throw new Error("Failed to fetch leave requests");
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    }
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "Approved" | "Rejected") => {
    try {
      const res = await fetch(`/api/leave-requests/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status: action } : req))
      );
    } catch (error) {
      alert("Failed to update status: " + error);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 via-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto ">
        {/* PURE CARD */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* LEFT PANEL */}
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 p-8">
              <div className="text-gray-800 space-y-6">
                <h2 className="text-2xl font-bold flex items-center mb-4 text-blue-700">
                  <FaUsers className="mr-3" /> HR Dashboard
                </h2>

                <p className="text-gray-600 text-lg">Manage employee leave requests</p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
                    <div className="text-3xl font-bold text-blue-700">{requests.length}</div>
                    <div className="text-gray-600">Total Requests</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
                    <div className="text-3xl font-bold text-emerald-600">
                      {requests.filter(r => r.status === "Approved").length}
                    </div>
                    <div className="text-gray-600">Approved</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
                    <div className="text-3xl font-bold text-amber-600">
                      {requests.filter(r => r.status === "Pending").length}
                    </div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
                    <div className="text-3xl font-bold text-rose-600">
                      {requests.filter(r => r.status === "Rejected").length}
                    </div>
                    <div className="text-gray-600">Rejected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="lg:w-3/5 p-8 bg-gradient-to-br from-gray-50 to-white">
              <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FaClipboardList className="mr-3 text-blue-500" /> Leave Requests
              </h3>

              <div className="space-y-6">
                {requests.map(req => (
                  <div key={req.id} className="bg-white p-6 rounded-xl shadow border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{req.employeeName}</h4>
                        <p className="text-gray-700">{req.type} • {req.startDate} → {req.endDate}</p>
                        <p className="mt-2 text-gray-600">{req.reason}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        req.status === "Approved" ? "bg-green-100 text-green-800"
                        : req.status === "Rejected" ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}>{req.status}</span>
                    </div>

                    {req.status === "Pending" && (
                      <div className="mt-4 flex space-x-4">
                        <button
                          onClick={() => handleAction(req.id, "Approved")}
                          className="flex items-center px-5 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition"
                        >
                          <FaCheckCircle className="mr-2" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "Rejected")}
                          className="flex items-center px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                        >
                          <FaTimesCircle className="mr-2" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {requests.length === 0 && (
                  <p className="text-center text-gray-500">No leave requests found.</p>
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
