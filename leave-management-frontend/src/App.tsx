import React, { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotificationScreen from "./components/Notification";
import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";

import type { LeaveRequestType, LeaveRequestFormData } from "./Types";

const App: React.FC = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lastView, setLastView] = useState("apply");

  const handleChangeView = (view: string) => {
    setLastView(activeView);
    setActiveView(view);
  };

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
      startDate: data.startDate,   // ✅ fix
      endDate: data.endDate,       // ✅ fix
      days,
      reason: data.reason,
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    setNotification({
      title: "Success",
      message: "Leave request submitted successfully!",
      type: "success",
    });
    setSubmitSuccess(true);
  };

  const goToHistory = () => {
    setSubmitSuccess(false);
    setActiveView("history");
  };

  const goBack = () => {
    setSubmitSuccess(false);
    setActiveView("apply");
  };

 const closeNotification = () => setNotification(null);

return (
  <div className="min-h-screen flex flex-col">
  <Header />
  <div className="flex flex-1">
    <Sidebar activeView={activeView} onChangeView={handleChangeView} />

    <main className="flex-1 p-6 bg-gray-50 overflow-auto">
      {activeView === "apply" && (
        <>
          {submitSuccess ? (
            <NotificationScreen
              onBack={goBack}
              onGoToHistory={goToHistory}
              lastRequest={leaveRequests[0]}   // ✅ latest request bhej rahe hain
            />
          ) : (
            <LeaveRequest
              onSubmit={addLeaveRequest}
              setActiveView={handleChangeView}
            />
          )}
        </>
      )}

      {activeView === "history" && (
        <History leaveRequests={leaveRequests} />
      )}
    </main>
  </div>
</div>
);
};

export default App;
