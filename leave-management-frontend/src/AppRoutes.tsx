import React, { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotificationScreen from "./components/Notification";


import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";
// import ApplyLeave from "./pages/ApplyLeave";
import Calendar from "./pages/Calendar";
import type { LeaveRequestType } from "./Types";
import type { LeaveRequestFormData } from "./Types";





const AppRoutes: React.FC = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  // const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "warning"; } | null>(null);

 

  const addLeaveRequest = (data: LeaveRequestFormData) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    let days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    if (data.duration === "half") days = 0.5;

    const newRequest: LeaveRequestType = {
      id: leaveRequests.length + 1,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      type: data.type,
      start: data.startDate,
      end: data.endDate,
      days: days,
      reason: data.reason,
    };

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
      <Header />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onChangeView={setActiveView} />

        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          {/* {activeView === "dashboard" && <Dashboard setActiveView={setActiveView} />} */}
          {activeView === "apply" && <LeaveRequest onSubmit={addLeaveRequest} setActiveView={setActiveView} />}
          {activeView === "applyleave" && (
            <LeaveRequest
              onSubmit={addLeaveRequest}
              setActiveView={setActiveView}
              // initialStartDate={leaveFormStartDate}
              // initialEndDate={leaveFormEndDate}
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
