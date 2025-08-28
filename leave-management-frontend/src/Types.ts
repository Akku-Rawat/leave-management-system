export interface LeaveRequestType {
  userId: any;
  employeeId: string;
  id: string;
  employeeName: string;
  department?: string;
  date: string;
  type: string;
  startDate: string;
  endDate: string;
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

export interface LeaveRequestProps {
  onSubmit?: (data: LeaveRequestFormData) => void;
  setActiveView?: (view: string) => void;
  userRole?: 'employee' | 'hr' | 'boss';
  userName?: string;
  allRequests?: LeaveRequestType[];
  initialStartDate?: string;
  initialEndDate?: string;

}

export interface User {
  role: "employee" | "hr" | "boss";
  name: string;
  id: string;
  department: string;
}

export interface LeaveHistoryRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  appliedDate: string;
  status: "Approved" | "Rejected" | "Pending";
  reason: string;
}

export interface Leave {
  start: Date;
  end: Date;
  status: "approved" | "pending" | "rejected";
}