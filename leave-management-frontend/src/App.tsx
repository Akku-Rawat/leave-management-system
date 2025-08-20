import React, { useState } from "react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Notification from "./Components/Notification";
import Dashboard from "./pages/Dashboard";
import LeaveRequest from "./pages/LeaveRequest";

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

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "warning" } | null>(null);

  const addLeaveRequest = (data: Omit<LeaveRequestType, "id" | "date" | "status" | "days"> & { days: number }) => {
    const newRequest: LeaveRequestType = {
      id: leaveRequests.length + 1,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      ...data,
    };
    setLeaveRequests([newRequest, ...leaveRequests]);
    setNotification({ title: "Success", message: "Leave request submitted successfully!", type: "success" });
    setActiveView("history");
  };

  const closeNotification = () => setNotification(null);

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar activeView={activeView} onChangeView={setActiveView} />
        <main className="flex-1 p-8">
          {activeView === "dashboard" && <Dashboard />}
         {/* {activeView === "apply" && <LeaveRequest onSubmit={addLeaveRequest} />} */}

          {/* More pages as needed */}
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
<div className="bg-red-500 text-white p-10">Test Tailwind</div>

export default App;
