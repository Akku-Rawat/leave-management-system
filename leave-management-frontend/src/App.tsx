// App.tsx
import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Notification from "./components/Notification";
import Dashboard from "./pages/Dashboard";
import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";
import ApplyLeave from "./pages/ApplyLeave"; // ✅ ApplyLeave import added

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

  // ✅ New state for showing submit success overlay
  const [submitSuccess, setSubmitSuccess] = useState<LeaveRequestFormData | null>(null);

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

    // ✅ Show submit success message instead of history
    setSubmitSuccess(data);
  };

  const closeNotification = () => setNotification(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onChangeView={setActiveView} />
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
         {activeView === "dashboard" && <Dashboard />}


          {activeView === "apply" && (
            <LeaveRequest
              setActiveView={setActiveView} // ✅ remove onSubmit
            />
          )}

         {activeView === "applyleave" && (
  <>
    {submitSuccess ? (
      <div className="bg-green-100 border border-green-400 text-green-800 p-8 rounded-xl text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Leave Submitted Successfully!</h2>
        <p className="mb-6">Your leave request has been submitted.</p>
        <button
          onClick={() => {
            setSubmitSuccess(null);
            setActiveView("history");
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Leave History
        </button>
      </div>
    ) : (
      <ApplyLeave
        onSubmit={addLeaveRequest}
        setActiveView={setActiveView}
      />
    )}
  </>
)}


          {/* ✅ Only show History when activeView="history" */}
          {activeView === "history" && (
            <History leaveRequests={leaveRequests} />
          )}

       

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
