import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";

import "react-day-picker/dist/style.css";

// 1. Define LeaveStatus as a union type of strings
type LeaveStatus = "approved" | "pending" | "rejected";

// 2. Define Leave interface
interface Leave {
  start: Date;
  end: Date;
  status: LeaveStatus;
}

// 3. Define the props interface for the component
interface AdvancedCalendarProps {
  leaves: Leave[];
  onRangeSelect: (range: DateRange | undefined) => void;
}

const AdvancedCalendar: React.FC<AdvancedCalendarProps> = ({ leaves, onRangeSelect }) => {
  // Use DateRange | undefined for state
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

  // Prepare modifiers for styling days
  const modifiers: Record<LeaveStatus, Date[]> = {
    approved: [],
    pending: [],
    rejected: [],
  };

  leaves.forEach((leave) => {
    let current = new Date(leave.start);
    // Push all dates in the range to the relevant modifier/color
    while (current <= leave.end) {
      modifiers[leave.status].push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  });

  // Disable days before today
  const disabledDays = { before: new Date() };

  // Handle range selection
  const handleSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    onRangeSelect(range);
  };

  return (
   <DayPicker
  mode="range"
  fixedWeeks={true}
  selected={selectedRange}
  onSelect={handleSelect}
  modifiers={modifiers}
  disabled={disabledDays}
/>

  );
};

export default AdvancedCalendar;
