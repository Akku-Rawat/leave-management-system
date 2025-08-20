// App.tsx
import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Notification from "./components/Notification";
import Dashboard from "./pages/Dashboard";
import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History"
// import Balance from "./pages/Balance";

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

export interface LeaveRequestFormData {
  type: string;
  duration: string;
  startDate: string;
  endDate: string;
  reason: string;
  emergencyContact: string;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const addLeaveRequest = (data: LeaveRequestFormData) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    let days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;

    if (data.duration === "half") {
      days = 0.5;
    }

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

    setLeaveRequests((prev) => [newRequest, ...prev]);
    setNotification({
      title: "Success",
      message: "Leave request submitted successfully!",
      type: "success",
    });
    setActiveView("history");
  };

  const closeNotification = () => setNotification(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onChangeView={setActiveView} />
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          {activeView === "dashboard" && (
            <Dashboard setActiveView={setActiveView} />
          )}
       {activeView === "apply" && (
  <LeaveRequest onSubmit={addLeaveRequest} setActiveView={setActiveView} />
)}

          {activeView === "History" && (
            <History leaveRequests={leaveRequests} />
          )}
          {/* {activeView === "balance" && <Balance />} } */}
        </main>
      </div>
      {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default App;