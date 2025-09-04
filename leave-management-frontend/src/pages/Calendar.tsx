import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import type { LeaveStatus } from "../Types";

import "react-day-picker/dist/style.css";

// 3. Define the props interface for the component
// before: leaves: Leave[]
// after:
interface AdvancedCalendarProps {
  leaves: { start: Date; end: Date; status: LeaveStatus }[];
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
  if (!leave.start || !leave.end) return;

  let current = new Date(leave.start.valueOf()); // clone to not mutate original
  const end = leave.end;

  while (current <= end) {
    modifiers[leave.status].push(new Date(current)); // add cloned date
    current.setDate(current.getDate() + 1);
  }
});

const today = new Date();
today.setHours(0, 0, 0, 0);
const disabledDays = { before: today }
  

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
