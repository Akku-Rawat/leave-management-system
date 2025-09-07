// ---------------- USER ----------------
export interface User {
  id: string;
  name: string;
  role: "employee" | "hr" | "boss" | { role_name: "employee" | "hr" | "boss" };
   user_id?: string | number; // add this!
  department: string;
  email?: string;
}


// ---------------- LEAVE STATUS ----------------
export type LeaveStatus = "pending" | "approved" | "rejected";

// ---------------- LEAVE ----------------
export interface Leave {
  start: string|null; // string (ISO date) better for frontend
  end: string|null;
  status: LeaveStatus;
}

// ---------------- LEAVE REQUEST ----------------
export interface LeaveRequestType {
  id: string;
  leave_id: string;


  employeeId: string; // same as userId but consistent
  userId: string; // keep if needed for mapping
  employeeName: string;
  department: string;
  type: string; // Sick, Casual, etc.
  status: LeaveStatus; // reused type
  start_date: string;
  end_date: string;
  days: number;
   created_at: string;    
  reason: string;
  date: string; // request created date
  user: {
    user_id: string;
    name: string;
    email: string;
  };
  
}

// ---------------- LEAVE REQUEST FORM ----------------
export type Duration = "full" | "first" | "second";

export interface LeaveRequestFormData {
  type: string;
  duration: Duration;
  startDate: string;
  endDate: string;
  reason: string;
  emergencyContact: string;
}

// ---------------- LEAVE REQUEST PROPS ----------------
export interface LeaveRequestProps {
  onSubmit: (data: LeaveRequestFormData) => void;
  userName: string;
  department: string;
  role: User["role"];
  setActiveView: (view: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
  allRequests: LeaveRequestType[];
  currentUser: User;
}

export interface HistoryProps {
  leaveRequests: LeaveRequestType[];
  currentUserId: string;
  userRole: "employee" | "hr" | "boss";
}



export interface LoginPageProps {
  onLogin: (user: User) => void;
  error?: string | null;
}

