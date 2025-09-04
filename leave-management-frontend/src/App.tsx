import React, { useState, useEffect, type JSX } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import LoginPage from "./pages/loginpage";
import LeaveRequest from "./pages/LeaveRequest";
import History from "./pages/History";
import HRView from "./pages/HRView";
import BossView from "./pages/BossView";
import EmployeeManagement from "./pages/EmployeeManagement";
import Documentation from "./components/documentation";
import Reports from "./pages/Reports";
import Profile from "./components/profile";

import type { User, LeaveRequestType, LeaveRequestFormData } from "./Types";

const App: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);
  const [, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setActiveView] = React.useState<string>(""); 

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogin = (user: User) => {
    const roleName =
      typeof user.role === "string" ? user.role : user.role.role_name;

    const normalizedUser = {
      ...user,
      id: String(user.user_id ?? user.id ?? ""),
      role: { role_name: roleName },
    };

    setCurrentUser(normalizedUser);
    localStorage.setItem("currentUser", JSON.stringify(normalizedUser));

    if (roleName === "boss") navigate("/boss-dashboard");
    else if (roleName === "hr") navigate("/dashboard");
    else navigate("/apply");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSubmitSuccess(false);
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const addLeaveRequest = (data: LeaveRequestFormData) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    let days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    if (data.duration === "first" || data.duration === "second") days = 0.5;

    const newRequest: LeaveRequestType = {
      id: (leaveRequests.length + 1).toString(),
      employeeName: currentUser?.name || "",
      department: currentUser?.department || "",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      leave_id: "",
      type: data.type,
      start_date: data.startDate,
      end_date: data.endDate,
      days,
      created_at: new Date().toISOString(),
      reason: data.reason,
      userId: currentUser?.id || "",
      employeeId: currentUser?.id || "",
      user: {
        user_id: currentUser?.id || "",
        name: currentUser?.name || "",
        email: currentUser?.email || "",
      },
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    setSubmitSuccess(true);
    navigate("/apply");
  };

  const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    return children;
  };

  const roleName =
    currentUser &&
    (typeof currentUser.role === "string"
      ? currentUser.role
      : currentUser.role.role_name);

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  return (
    <>
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={navigate}
      />
      <div className="flex">
        <Sidebar
          activeView={window.location.pathname.replace("/", "") || "apply"}
          onChangeView={(view) => navigate(`/${view}`)}
          userRole={currentUser.role}
          currentUserName={currentUser.name}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-4 bg-gray-50 overflow-auto">
          
         <Routes>
            <Route
              path="/apply"
              element={<LeaveRequest onSubmit={addLeaveRequest}
               currentUser={currentUser}  
               userName={currentUser.name}        // add karo
               department={currentUser.department} // add karo
               role={currentUser.role}            // add karo
               setActiveView={setActiveView}     // add karo, jo aapke component me ho
               allRequests={leaveRequests}  />}
            />
            <Route
              path="/history"
              element={
                <History
                
                  leaveRequests={leaveRequests}
                  currentUserId={currentUser.id}
                 userRole={roleName || "employee"}
                 onGoBack={() => {}}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  {roleName === "hr" ? <HRView /> : <Navigate to="/apply" replace />}
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile currentUser={currentUser} />
                </RequireAuth>
              }
            />
            <Route
              path="/boss-dashboard"
              element={
                <RequireAuth>
                  {roleName === "boss" ? <BossView /> : <Navigate to="/apply" replace />}
                </RequireAuth>
              }
            />
            <Route
              path="/employees"
              element={
                <RequireAuth>
                  {roleName === "boss" ? <EmployeeManagement /> : <Navigate to="/apply" replace />}
                </RequireAuth>
              }
            />
            <Route
              path="/reports"
              element={
                <RequireAuth>
                  {roleName === "boss" ? <Reports /> : <Navigate to="/apply" replace />}
                </RequireAuth>
              }
            />
            <Route
              path="/documentation"
              element={
                <RequireAuth>
                  {(roleName === "boss" || roleName === "hr"||roleName==="employee") ? (
                    <Documentation userRole={roleName} />
                  ) : (
                    <Navigate to="/apply" replace />
                  )}
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/apply" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;
