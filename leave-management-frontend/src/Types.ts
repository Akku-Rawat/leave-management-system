export interface LeaveRequestType {
  id: number;
 
  Name: string;
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
export interface LeaveRequestData {
  id: string;
  employeeName: string;
  type: string;
  days: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface LeaveRequestProps {
  onSubmit?: (data: any) => void;
  setActiveView?: (view: string) => void;
  userRole?: 'employee' | 'hr' | 'boss';
  userName?: string;
  allRequests?: LeaveRequestData[];
}
