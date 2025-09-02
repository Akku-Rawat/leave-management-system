import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import type { Leave, LeaveStatus } from "../Types";

import "react-day-picker/dist/style.css";

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
    Approved: [],
    pending: [],
    Rejected: [],
  };

  leaves.forEach((leave) => {
  if (!leave.start || !leave.end) {
    // Optionally warn, or just skip
    console.warn(`Leave missing start or end date. Skipped:`, leave);
    return;
  }

  let current = new Date(leave.start);
  const end = new Date(leave.end);

  const statusKey = (leave.status as string).toLowerCase() as LeaveStatus;

  if (!modifiers[statusKey]) {
    console.warn(`Unknown leave status: ${leave.status}`);
    return;
  }

  while (current <= end) {
    modifiers[statusKey].push(new Date(current));
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
