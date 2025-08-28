import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotificationScreen from "./components/Notification";
import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";
import LoginPage from "./pages/loginpage";
import HRView from "./pages/HRView";
import BossView from "./pages/BossView";
import type { LeaveRequestType, LeaveRequestFormData, User } from "./Types";
import Documentation from "./components/documentation";
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

  // Sample requests for HR/Boss testing
  const sampleRequests = [
    {
      id: "1",
      employeeName: "Jane Smith",
      department: "Engineering",
      type: "Annual Leave",
      status: "Pending" as const,
      startDate: "2025-08-30",
      endDate: "2025-09-02",
      days: 4,
      reason: "Family vacation to Goa",
      date: "2025-08-25"
    },
    {
      id: "2", 
      employeeName: "Bob Wilson",
      department: "Finance",
      type: "Sick Leave",
      status: "Pending" as const,
      startDate: "2025-08-26",
      endDate: "2025-08-27",
      days: 2,
      reason: "Medical appointment and recovery",
      date: "2025-08-24"
    },
    {
      id: "3",
      employeeName: "Alice Johnson", 
      department: "Marketing",
      type: "Emergency Leave",
      status: "Approved" as const,
      startDate: "2025-08-20",
      endDate: "2025-08-22",
      days: 3,
      reason: "Family emergency",
      date: "2025-08-19"
    },
  ];

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === "boss") {
      setActiveView("boss-dashboard");
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
      employeeName: currentUser?.name || "User",
      department: currentUser?.department || "",
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
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

  // Show login if no user
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeView={activeView} 
          onChangeView={handleChangeView}
          userRole={currentUser.role}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Apply Leave / Dashboard Views */}
          {(activeView === "apply" || activeView === "dashboard" || activeView === "boss-dashboard") && (
            <>
              {submitSuccess ? (
                <NotificationScreen
                  onGoBack={goBack}
                  onGoToHistory={goToHistory}
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
                    <BossView />
                  )}
                </>
              )}
            </>
          )}

          {/* History View */}
          {activeView === "history" && (
            <History 
              leaveRequests={[...sampleRequests, ...leaveRequests]} 
              setActiveView={setActiveView}
              currentUserId={currentUser.id}
              userRole={currentUser.role}
            />
          )}

          {/* Other Views */}
          {activeView === "employees" && currentUser.role === 'boss' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
              <p className="text-gray-600">Coming soon - Detailed employee management interface</p>
            </div>
          )}

          {activeView === "reports" && currentUser.role === 'boss' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
              <p className="text-gray-600">Coming soon - Comprehensive reporting dashboard</p>
            </div>
          )}
          
{activeView === "documentation" && (
  <Documentation userRole={currentUser.role} />
)}

        </main>
      </div>
    </div>
  );
};

export default App;