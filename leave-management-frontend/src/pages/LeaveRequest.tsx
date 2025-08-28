import React from "react";
import type { LeaveRequestProps } from "../Types";
import EmployeeView from "./EmployeView";

const LeaveRequest: React.FC<LeaveRequestProps> = (props) => {
  // Use EmployeeView for all roles - it handles role-based rendering
  return <EmployeeView {...props} />;
};

export default LeaveRequest;