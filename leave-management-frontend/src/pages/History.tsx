import React from "react";
export interface LeaveRequestType {
  id: number;
  date: string;
  type: string;
  start: string;
  end: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}

interface HistoryProps {
  leaveRequests: LeaveRequestType[];
}

const History: React.FC<HistoryProps> = ({ leaveRequests }) => {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Leave History</h2>
      {leaveRequests.length === 0 ? (
        <p className="text-gray-600">No leave requests submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {request.type} ({request.start} to {request.end})
                </h3>
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    request.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : request.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Days: {request.days}</p>
              <p className="text-gray-700">{request.reason}</p>
              <p className="text-xs text-gray-400 mt-2">
                Requested on: {request.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;