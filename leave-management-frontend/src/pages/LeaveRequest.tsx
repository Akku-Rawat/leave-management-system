import React from "react";
import type { LeaveRequestProps } from "../Types";
import EmployeeView from "./EmployeView";

const LeaveRequest: React.FC<LeaveRequestProps> = (props) => {
  // This component always returns EmployeeView with all props passed through
  return <EmployeeView {...props} />;
};

export default LeaveRequest;