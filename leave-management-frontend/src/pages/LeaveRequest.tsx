import React from "react";
import type { LeaveRequestProps } from "../Types";
import EmployeeView from "./EmployeView";

const LeaveRequest: React.FC<LeaveRequestProps> = (props) => {
  // Ye hamesha EmployeeView hi return karega
  return <EmployeeView {...props} />;
};

export default LeaveRequest;
