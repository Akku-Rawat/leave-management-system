import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const LeaveCalendar: React.FC = () => {
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});

  return (

<DayPicker
  mode="range"
  className="mx-auto"
  styles={{
    caption: { fontSize: "14px", marginBottom: "6px", fontWeight: "600" },
    head_cell: { fontSize: "12px", padding: "2px 4px", fontWeight: "500" },
    cell: { width: "32px", height: "32px" },
    button: {
      fontSize: "12px",
      width: "32px",
      height: "32px",
      margin: "0px",
      borderRadius: "6px",
    },
  }}
/>
  );
};

export default LeaveCalendar;
