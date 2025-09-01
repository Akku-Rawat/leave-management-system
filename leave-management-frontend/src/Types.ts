export interface User {
  id: string;
  name: string;
  role: "employee" | "hr" | "boss";
  department: string;
  email?: string;
}

export interface LeaveRequestType {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  status: "Pending" | "Approved" | "Rejected";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  date: string;
  userId: string;
  employeeId: string;
}

export interface LeaveRequestFormData {
  type: string;
  startDate: string;
  endDate: string;
  duration: "full" | "half";
  reason: string;
}

export interface LeaveRequestProps {
  onSubmit: (data: LeaveRequestFormData) => void;
}