import React, { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
// import NotificationScreen from "./components/Notification";
import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";
import LoginPage from "./pages/loginpage";
import HRView from "./pages/HRView";
import BossView from "./pages/BossView";
import type { LeaveRequestType, LeaveRequestFormData, User } from "./Types";
import Documentation from "./components/documentation";
import EmployeeManagement from "./pages/EmployeeManagement";
import Reports from "./pages/Reports";

const App: React.FC = () => {
  const [activeView, setActiveView] = useState("apply");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [, setNotification] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    const roleName = typeof user.role === "string" ? user.role : user.role.role_name;

    const normalizedUser = {
      ...user,
      id: String(user.user_id ?? user.id ?? ""), // id will always be string
      role: roleName,
    };

    setCurrentUser(normalizedUser);

    if (roleName === "boss") {
      setActiveView("boss-dashboard");
    } else if (roleName === "hr") {
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
    console.log("Changing activeView to:", view);
    setActiveView(view);
    setSubmitSuccess(false);
  };

  const addLeaveRequest = (data: LeaveRequestFormData) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    let days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;

    if (data.duration === "first" || data.duration === "second") {
      days = 0.5;
    }

    const newRequest: LeaveRequestType = {
      id: (leaveRequests.length + 1).toString(),
      employeeName: currentUser?.name || "User",
      department: currentUser?.department || "",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      reason: data.reason,
      userId: currentUser?.id || "",
      employeeId: currentUser?.id || "",
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);

    setNotification({
      title: "Success",
      message: "Leave request submitted successfully!",
      type: "success",
    });

    setSubmitSuccess(true);
  };

  console.log("CurrentUser role:", currentUser?.role);
  console.log("Active View:", activeView);

  return (
    <>
      {currentUser ? (
        <div className="app-layout" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          {/* Header */}
          <Header currentUser={currentUser} onLogout={handleLogout} />

          {/* Body part: Sidebar and Main Content */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Sidebar */}
     <Sidebar
  activeView={activeView}
  onChangeView={handleChangeView}
  userRole={typeof currentUser.role === "string" ? currentUser.role : currentUser.role.role_name}
  currentUserName={currentUser.name}
  onLogout={handleLogout}
/>


            {/* Main Content */}
            <main className="main-content" style={{ flex: 1, padding: 20, overflowY: "auto" }}>
              {(activeView === "apply" || activeView === "dashboard" || activeView === "boss-dashboard") && (
                <>
                  {submitSuccess ? (
                    <div>Leave request submitted successfully!</div>
                  ) : (
                    <>
                      {currentUser.role === "employee" && activeView === "apply" && (
                        <LeaveRequest
                          onSubmit={addLeaveRequest}
                          userName={currentUser.name}
                          department={currentUser.department}
                          role={currentUser.role}
                          setActiveView={setActiveView}
                          allRequests={leaveRequests}
                        />
                      )}
                      {currentUser.role === "hr" && activeView === "dashboard" && <HRView />}
                      {currentUser.role === "hr" && activeView === "apply" && (
                        <LeaveRequest
                          onSubmit={addLeaveRequest}
                          userName={currentUser.name}
                          department={currentUser.department}
                          role={currentUser.role}
                          setActiveView={setActiveView}
                          allRequests={leaveRequests}
                        />
                      )}
                      {currentUser.role === "boss" && activeView === "boss-dashboard" && <BossView />}
                    </>
                  )}
                </>
              )}
              {activeView === "history" && currentUser && (
                <History
                  leaveRequests={leaveRequests}
                  currentUserId={currentUser.id}
                  userRole={typeof currentUser.role === "string" ? currentUser.role : currentUser.role.role_name}
                />
              )}
              {activeView === "employees" && currentUser.role === "boss" && <EmployeeManagement />}
              {activeView === "reports" && currentUser.role === "boss" && <Reports />}
              {activeView === "documentation" && (
                <Documentation
                  userRole={typeof currentUser.role === "string" ? currentUser.role : currentUser.role.role_name}
                />
              )}
            </main>
          </div>
        </div>
      ) : (
        <LoginPage onLogin={handleLogin} error={null} />
      )}
    </>
  );
};

export default App;
