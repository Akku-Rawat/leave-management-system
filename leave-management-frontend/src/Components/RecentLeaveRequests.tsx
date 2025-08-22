import React from "react";
import Card from "./Card";

type Row = { type: string; date: string; duration: string; status: "Approved" | "Pending" };

const badge = (status: Row["status"]) =>
  status === "Approved"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-yellow-100 text-yellow-700";

const RecentLeaveRequests: React.FC<{ rows: Row[]; className?: string }> = ({ rows, className }) => (
  <Card className={className}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-800">Recent Leave Requests</h3>
      <button className="text-sm text-blue-600 hover:underline">View All</button>
    </div>

    <div className="divide-y divide-gray-100">
      {rows.map((r, i) => (
        <div key={i} className="py-3 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 grid place-items-center">🛎️</div>
            <div>
              <div className="font-medium text-gray-900">{r.type}</div>
              <div className="text-xs text-gray-500">{r.date}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">{r.duration}</div>
            <span className={`mt-1 inline-block text-xs px-2 py-1 rounded-full ${badge(r.status)}`}>
              {r.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default RecentLeaveRequests;
