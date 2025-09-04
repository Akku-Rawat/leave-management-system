import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";

import type { LeaveRequestType, LeaveRequestFormData, User } from "./Types";

interface AppRoutesProps {
  currentUser: User | null;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [leaveFormStartDate] = useState<string>("");
  const [leaveFormEndDate] = useState<string>("");

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

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
      leave_id: "", 
      reason: data.reason,
      created_at: new Date().toISOString(), 
      
      employeeName: currentUser.name,
      start_date: data.startDate,
      end_date: data.endDate,
      employeeId: currentUser.id,
      userId: currentUser.id,
      department: currentUser.department,
      user: {
        user_id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email || "",
      },
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    navigate("/history");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentUser={currentUser} onLogout={onLogout} onNavigate={navigate} />
      <div className="flex flex-1">
        <Sidebar
          activeView={window.location.pathname.replace("/", "") || "apply"}
          onChangeView={(view) => navigate(`/${view}`)}
          userRole={currentUser.role}
          currentUserName={currentUser.name}
          onLogout={onLogout}
        />
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          <Routes>
            <Route
              path="/apply"
              element={
                <LeaveRequest
                  onSubmit={addLeaveRequest}
                  setActiveView={(view) => navigate(`/${view}`)}
                  userName={currentUser.name}
                  department={currentUser.department}
                  role={currentUser.role}
                  allRequests={leaveRequests}
                  initialStartDate={leaveFormStartDate}
                  initialEndDate={leaveFormEndDate}
                  currentUser={currentUser} 
                  
                          
    
      
               
                />
              }
            />
            <Route
              path="/history"
              element={
                <History
                   onGoBack={() => {}}
                  leaveRequests={leaveRequests}
                  currentUserId={currentUser.id}
                  userRole={typeof currentUser.role === "string" ? currentUser.role : currentUser.role.role_name}
                />
              }
            />
            <Route path="/" element={<Navigate to="/apply" replace />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
    
  );
};

export default AppRoutes;