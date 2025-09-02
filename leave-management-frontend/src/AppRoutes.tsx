import React, { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";
import type { LeaveRequestType, LeaveRequestFormData, User } from "./Types";

const AppRoutes: React.FC = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [leaveFormStartDate, setLeaveFormStartDate] = useState<string>("");
  const [leaveFormEndDate, setLeaveFormEndDate] = useState<string>("");

  const currentUser: User = {
    id: "1",
    name: "John Doe",
    role: "employee",
    department: "Engineering",
  };

  const addLeaveRequest = (data: LeaveRequestFormData) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    let days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    if (data.duration === "first" || data.duration === "second") days = 0.5;

    const newRequest: LeaveRequestType = {
     id: (leaveRequests.length + 1).toString(),
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      type: data.type,
      days: days,
      reason: data.reason,
      employeeName: currentUser.name,
      startDate: data.startDate,
      endDate: data.endDate,
      employeeId: currentUser.id,
      userId: currentUser.id,
      department: currentUser.department,
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    setActiveView("history");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentUser={currentUser} onLogout={() => setActiveView("dashboard")} />
      <div className="flex flex-1">
        <Sidebar
  activeView={activeView}
  onChangeView={setActiveView}
  userRole={currentUser.role}
  currentUserName={currentUser.name}
/>


        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        {activeView === "apply" && (
  <LeaveRequest
    onSubmit={addLeaveRequest}
    setActiveView={setActiveView}
    userName={currentUser.name}
    department={currentUser.department}
    role={currentUser.role}
    allRequests={leaveRequests}
    initialStartDate={leaveFormStartDate}
    initialEndDate={leaveFormEndDate}
  />
)}


          {activeView === "history" && (
            <History
              leaveRequests={leaveRequests}
              currentUserId={currentUser.id}
              userRole={currentUser.role}
            />
          )}
          {/* Add other views like Dashboard, Calendar etc. if needed */}
        </main>
      </div>
    </div>
  );
};

export default AppRoutes;
