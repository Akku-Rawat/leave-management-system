import React, { useState } from "react";



import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";

import type { LeaveRequestType, LeaveRequestFormData } from "./Types";

const AppRoutes: React.FC = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);

  const addLeaveRequest = (data: LeaveRequestFormData) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    let days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    if (data.duration === "half") days = 0.5;

    const newRequest: LeaveRequestType = {
      id: (leaveRequests.length + 1).toString(),
      employeeName: "Current User", // This should come from authentication
      department: "Engineering", // This should come from user profile
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days: days,
      reason: data.reason,
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {activeView === "apply" && (
        <LeaveRequest onSubmit={addLeaveRequest} />
      )}

      {activeView === "applyleave" && (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Apply for Leave</h1>
          <LeaveRequest onSubmit={addLeaveRequest} />
        </div>
      )}

      {activeView === "history" && (
        <History 
          userRole="employee" 
          allRequests={leaveRequests}
        />
      )}

      {/* Note: BossView import was referenced but not used in the original */}
    </div>
  );
};

export default AppRoutes;