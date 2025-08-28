import React, { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";


import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";
// import ApplyLeave from "./pages/ApplyLeave";
import type { LeaveRequestType } from "./Types";
import type { LeaveRequestFormData } from "./Types";





const AppRoutes: React.FC = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  // const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "warning"; } | null>(null);

  const [leaveFormStartDate] = useState<string>("");
  const [leaveFormEndDate] = useState<string>("");

 

  const addLeaveRequest = (data: LeaveRequestFormData) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    let days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    if (data.duration === "half") days = 0.5;

    const newRequest: LeaveRequestType = {
      id: (leaveRequests.length + 1).toString(),
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      type: data.type,
      days: days,
      reason: data.reason,
      employeeName: "",
      startDate: "",
      endDate: ""
      
    };
 
// Removed incorrect BossView usage from here





     setLeaveRequests(prev => [newRequest, ...prev]);
    // setNotification({
    //   title: "Success",
    //   message: "Leave request submitted successfully!",
    //   type: "success",
    // });
    // setActiveView("history");
  };

  // const handleDateRangeSelect = (start: string, end: string) => {
  //   setLeaveFormStartDate(start);
  //   setLeaveFormEndDate(end);
  //   setActiveView("applyleave");
  // };

  // const closeNotification = () => setNotification(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentUser={{ id: "1", name: "John Doe", role: "employee", department: "Engineering" }} // Replace with actual user data as needed
        onLogout={() => {
          // Implement logout logic here
          setActiveView("dashboard");
        }}
      />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onChangeView={setActiveView} userRole="employee" />

        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          {/* {activeView === "dashboard" && <Dashboard setActiveView={setActiveView} />} */}
          {activeView === "apply" && <LeaveRequest onSubmit={addLeaveRequest} setActiveView={setActiveView} />}
          {activeView === "applyleave" && (
            <LeaveRequest
              onSubmit={addLeaveRequest}
              setActiveView={setActiveView}
              initialStartDate={leaveFormStartDate}
               initialEndDate={leaveFormEndDate}
            />
          )}
          {/* {activeView === "calendar" && (
            <Calendar leaveRequests={leaveRequests} onDateRangeSelect={handleDateRangeSelect} />
          )} */}
          {activeView === "history" && <History leaveRequests={leaveRequests} />}
        </main>
      </div>

     
    </div>
  );
};

export default AppRoutes;