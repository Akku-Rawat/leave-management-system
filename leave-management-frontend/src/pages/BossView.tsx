import React, { useState } from "react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
}

interface BossViewProps {
  activeView: string;
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
}

const BossView: React.FC<BossViewProps> = ({
  activeView,
  leaveRequests,
  setLeaveRequests,
}) => {
  const [filter, setFilter] = useState("");

  // Approve Handler
  const handleApprove = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((lr) => (lr.id === id ? { ...lr, status: "Approved" } : lr))
    );
  };

  // Reject Handler
  const handleReject = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((lr) => (lr.id === id ? { ...lr, status: "Rejected" } : lr))
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Leave Approvals Overview</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold">Monthly Leave Growth</h3>
          <p className="text-2xl font-bold text-blue-600">+12%</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold">Most Common Leave</h3>
          <p className="text-lg font-medium">Sick Leave</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-semibold">Pending Requests</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {leaveRequests.filter((l) => l.status === "Pending").length}
          </p>
        </div>
      </div>

      <table className="w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Employee</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Dates</th>
            <th className="px-4 py-2 border">Days</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((req, i) => (
            <tr key={req.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="px-4 py-2 border">{req.employeeName}</td>
              <td className="px-4 py-2 border">{req.type}</td>
              <td className="px-4 py-2 border">
                {req.startDate} → {req.endDate}
              </td>
              <td className="px-4 py-2 border">{req.days}</td>
              <td className="px-4 py-2 border">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    req.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : req.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-2 border">
                {req.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BossView;
