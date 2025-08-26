import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUserTie,
  FaClock,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import type { LeaveRequestType } from "../Types";

interface BossViewProps {
  activeView: string;
  leaveRequests: LeaveRequestType[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequestType[]>>;
}

const BossView: React.FC<BossViewProps> = ({
  leaveRequests,
  setLeaveRequests,
}) => {
  // Hardcoded demo request
  const hardcodedRequest: LeaveRequestType = {
    id: "999",
    employeeName: "Demo Employee",
    type: "Annual Leave",
    status: "Pending",
    startDate: "2025-09-01",
    endDate: "2025-09-03",
    days: 3,
    reason: "Demo vacation leave",
    date: new Date().toISOString().split("T")[0],
  };

  const requests = [hardcodedRequest, ...leaveRequests];

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: action } : req
      )
    );
  };

  // Stats
  const total = requests.length;
  const approved = requests.filter((r) => r.status === "Approved").length;
  const rejected = requests.filter((r) => r.status === "Rejected").length;
  const pending = requests.filter((r) => r.status === "Pending").length;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Boss Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <FaUserTie className="text-blue-500 text-2xl" />
          <div>
            <p className="text-gray-600 text-sm">Total Requests</p>
            <p className="text-xl font-bold">{total}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <FaClock className="text-yellow-500 text-2xl" />
          <div>
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-xl font-bold">{pending}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <FaThumbsUp className="text-green-500 text-2xl" />
          <div>
            <p className="text-gray-600 text-sm">Approved</p>
            <p className="text-xl font-bold">{approved}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <FaThumbsDown className="text-red-500 text-2xl" />
          <div>
            <p className="text-gray-600 text-sm">Rejected</p>
            <p className="text-xl font-bold">{rejected}</p>
          </div>
        </div>
      </div>

      {/* Pending Requests List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pending Requests</h3>
        {requests
          .filter((req) => req.status === "Pending")
          .map((req) => (
            <div
              key={req.id}
              className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{req.employeeName}</p>
                <p className="text-sm text-gray-600">
                  {req.type} ({req.startDate} → {req.endDate})
                </p>
                <p className="text-sm text-gray-500">{req.reason}</p>
              </div>
              <div className="flex gap-3 mt-3 md:mt-0">
                <button
                  onClick={() => handleAction(req.id, "Approved")}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <FaCheckCircle /> Approve
                </button>
                <button
                  onClick={() => handleAction(req.id, "Rejected")}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <FaTimesCircle /> Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BossView;
