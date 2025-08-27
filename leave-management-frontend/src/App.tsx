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

  const handleLogin = (user: User) => {
    console.log("Login successful:", user);
    setCurrentUser(user);

    // Set appropriate landing view based on role
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
    setLeaveRequests([]);
  };

  const handleChangeView = (view: string) => {
    console.log("Changing view to:", view);
    setActiveView(view);
    setSubmitSuccess(false);
  };

  const addLeaveRequest = (data: LeaveRequestFormData) => {
    console.log("Adding leave request:", data);

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    let days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    if (data.duration === "half" || data.duration === "first-half" || data.duration === "second-half") {
      days = 0.5;
    }

    const newRequest: LeaveRequestType = {
      id: (leaveRequests.length + 1).toString(),
      employeeName: currentUser?.name || "Unknown",
      department: currentUser?.department || "Unknown",
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

  // Show login page if no user
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  console.log("Current user:", currentUser);
  console.log("Active view:", activeView);
  console.log("Submit success:", submitSuccess);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        userRole={currentUser.role} 
        userName={currentUser.name}
        onLogout={handleLogout}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeView={activeView} 
          onChangeView={handleChangeView} 
          userRole={currentUser.role}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {submitSuccess ? (
            <NotificationScreen 
              onGoToHistory={goToHistory}
              onGoBack={goBack}
            />
          ) : (
            <>
              {/* Employee Apply View */}
              {currentUser.role === "employee" && activeView === "apply" && (
                <LeaveRequest 
                  onSubmit={addLeaveRequest}
                  userName={currentUser.name}
                  userRole={currentUser.role}
                  allRequests={leaveRequests}
                />
              )}

              {/* HR Dashboard */}
              {currentUser.role === "hr" && activeView === "dashboard" && (
                <HRView />
              )}

              {/* HR Apply Leave */}
              {currentUser.role === "hr" && activeView === "apply" && (
                <LeaveRequest 
                  onSubmit={addLeaveRequest}
                  userName={currentUser.name}
                  userRole={currentUser.role}
                  allRequests={leaveRequests}
                />
              )}

              {/* Boss Dashboard */}
              {currentUser.role === "boss" && activeView === "boss-dashboard" && (
                <BossView />
              )}

              {/* Boss Apply Leave */}
              {currentUser.role === "boss" && activeView === "apply" && (
                <LeaveRequest 
                  onSubmit={addLeaveRequest}
                  userName={currentUser.name}
                  userRole={currentUser.role}
                  allRequests={leaveRequests}
                />
              )}

              {/* History for all roles */}
              {activeView === "history" && (
                <History 
                  userRole={currentUser.role}
                  allRequests={leaveRequests}
                  currentUserId={currentUser.id}
                />
              )}

              {/* Fallback for any other views */}
              {!["apply", "dashboard", "boss-dashboard", "history"].includes(activeView) && (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-800">View not found</h2>
                  <p className="text-gray-600 mt-2">The requested view "{activeView}" is not available.</p>
                  <button 
                    onClick={goBack}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Go Back to Dashboard
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{notification.title}</div>
                <div className="text-sm mt-1">{notification.message}</div>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="ml-4 text-lg font-semibold hover:opacity-75"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;