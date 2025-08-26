import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotificationScreen from "./components/Notification";
import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";
import LoginPage from "./pages/loginpage";
import HRView from "./pages/HRView";
import BossView from "./pages/BossView";
import type { LeaveRequestType, LeaveRequestFormData } from "./Types";

interface User {
  role: "employee" | "hr" | "boss";
  name: string;
  id: string;
  department: string;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState("apply");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const sampleRequests = [
    {
      id: "1",
      employeeName: "Jane Smith",
      type: "Annual Leave",
      status: "Pending",
      startDate: "2025-08-30",
      endDate: "2025-09-02",
      days: 4,
      reason: "Family vacation to Goa",
    },
    {
      id: "2",
      employeeName: "Bob Wilson",
      type: "Sick Leave",
      status: "Pending",
      startDate: "2025-08-26",
      endDate: "2025-08-27",
      days: 2,
      reason: "Medical appointment and recovery",
    },
    {
      id: "3",
      employeeName: "Alice Johnson",
      type: "Emergency Leave",
      status: "Approved",
      startDate: "2025-08-20",
      endDate: "2025-08-22",
      days: 3,
      reason: "Family emergency",
    },
  ];

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === "boss") {
      setActiveView("boss-dashboard"); // Boss landing
    } else if (user.role === "hr") {
      setActiveView("dashboard");
    } else {
      setActiveView("apply");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView("apply");
    setSubmitSuccess(false);
  };

  const handleChangeView = (view: string) => {
    setActiveView(view);
  };

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
      startDate: data.startDate,
      endDate: data.endDate,
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
    if (currentUser?.role === "boss") {
      setActiveView("boss-dashboard");
    } else if (currentUser?.role === "hr") {
      setActiveView("dashboard");
    } else {
      setActiveView("apply");
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onChangeView={handleChangeView}
          userRole={currentUser.role}
        />

        <main className="flex-1 overflow-auto">
          {(activeView === "apply" || activeView === "dashboard" || activeView === "boss-dashboard") && (
            <>
              {submitSuccess ? (
                <NotificationScreen
                  onBack={goBack}
                  onGoToHistory={goToHistory}
                  lastRequest={leaveRequests[0]}
                />
              ) : (
                <>
                  {/* Employee Apply */}
                  {currentUser.role === "employee" && activeView === "apply" && (
                    <LeaveRequest
                      onSubmit={addLeaveRequest}
                      setActiveView={setActiveView}
                      userRole={currentUser.role}
                      userName={currentUser.name}
                      allRequests={[...sampleRequests, ...leaveRequests]}
                    />
                  )}

                  {/* HR View */}
                  {currentUser.role === "hr" && activeView === "dashboard" && (
                    <HRView />
                  )}

                  {/* HR can also Apply */}
                  {currentUser.role === "hr" && activeView === "apply" && (
                    <LeaveRequest
                      onSubmit={addLeaveRequest}
                      setActiveView={setActiveView}
                      userRole={currentUser.role}
                      userName={currentUser.name}
                      allRequests={[...sampleRequests, ...leaveRequests]}
                    />
                  )}

                  {/* Boss View */}
                  {currentUser.role === "boss" && activeView === "boss-dashboard" && (
                    <BossView
                      activeView={activeView}
                      leaveRequests={[...sampleRequests, ...leaveRequests]}
                      setLeaveRequests={setLeaveRequests}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* History (Employee/HR = My History, Boss = All Employees History) */}
          {activeView === "history" && (
            <History
              leaveRequests={[...sampleRequests, ...leaveRequests]}
              setActiveView={setActiveView}
              userRole={currentUser.role}
            />
          )}

          {activeView === "project-example1" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold">Project Example 1</h2>
              <p className="text-gray-600 mt-2">Demo content for Example 1</p>
            </div>
          )}
          {activeView === "project-example2" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold">Project Example 2</h2>
              <p className="text-gray-600 mt-2">Demo content for Example 2</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
