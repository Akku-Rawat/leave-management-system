import React, { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
// import Notification from "./components/Notification";

// import Dashboard from "./pages/Dashboard";
import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";
// import ApplyLeave from "./pages/ApplyLeave";

import AppRoutes from "./AppRoutes";

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
  start: string;
  end: string;
  reason: string;
  emergencyContact: string;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  // New state to track if form was just successfully submitted
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Store previous view to go back properly
  const [lastView, setLastView] = useState("LeaveRequestData");

  // Update activeView with lastView tracking
  const handleChangeView = (view: string) => {
    setLastView(activeView);
    setActiveView(view);
  };

  // Submit handler for leave request
  const addLeaveRequest = (data: LeaveRequestFormData) => {
    const start = new Date(data.start);
    const end = new Date(data.end);
    let days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;

    if (data.duration === "half") days = 0.5;

    const newRequest: LeaveRequestType = {
      id: leaveRequests.length + 1,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      type: data.type,
      start: data.start,
      end: data.end,
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
    // Do NOT change view immediately, show success message instead
  };

  // Handler for "Go to History"
  const goToHistory = () => {
    setSubmitSuccess(false);
    setActiveView("history");
  };

  // Handler for "Back" button in success screen
  const goBack = () => {
    setSubmitSuccess(false);
    setActiveView(lastView);
  };

  const closeNotification = () => setNotification(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onChangeView={handleChangeView} />

        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {/* {activeView === "dashboard" && <Dashboard setActiveView={handleChangeView} />} */}

          {activeView === "apply" && (
            <>
              {submitSuccess ? (
                <div className="max-w-xl mx-auto bg-green-100 border border-green-400 text-green-800 p-8 rounded-lg text-center">
                  <h2 className="text-2xl font-bold mb-4">Leave Submitted Successfully!</h2>
                  <p className="mb-6">Your leave request has been submitted.</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={goBack}
                      className="px-6 py-2 rounded border border-gray-600 hover:bg-gray-200 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={goToHistory}
                      className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Go to History
                    </button>
                  </div>
                </div>
              ) : (
                <LeaveRequest onSubmit={addLeaveRequest} setActiveView={handleChangeView} />
              )}
            </>
          )}

          {activeView === "history" && <History leaveRequests={leaveRequests} />}

          {/* Add other views if needed */}
        </main>
      </div>

   
    </div>
  );
};

export default App;
