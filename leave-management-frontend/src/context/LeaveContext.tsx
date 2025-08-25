import React, { createContext, useContext, useState, useEffect } from "react";

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

interface LeaveContextType {
  leaveRequests: LeaveRequestType[];
  addLeave: (leave: LeaveRequestType) => void;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestType[]>([]);

  // ✅ load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("leaveRequests");
    if (stored) setLeaveRequests(JSON.parse(stored));
  }, []);

  // ✅ save to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const addLeave = (leave: LeaveRequestType) => {
    setLeaveRequests((prev) => [leave, ...prev]);
  };

  return (
    <LeaveContext.Provider value={{ leaveRequests, addLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const ctx = useContext(LeaveContext);
  if (!ctx) throw new Error("useLeave must be used inside LeaveProvider");
  return ctx;
};
