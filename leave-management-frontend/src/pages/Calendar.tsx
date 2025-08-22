import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

type LeaveStatus = "approved" | "pending" | "rejected";

interface Leave {
  start: Date;
  end: Date;
  status: LeaveStatus;
}

interface AdvancedCalendarProps {
  leaves: Leave[];
  onRangeSelect: (range: DateRange | undefined) => void;
}

const AdvancedCalendar: React.FC<AdvancedCalendarProps> = ({ leaves, onRangeSelect }) => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

  const modifiers: Record<string, Date[]> = {
    approved: [],
    pending: [],
    rejected: [],
  };

  leaves.forEach((leave) => {
    let current = new Date(leave.start);
    while (current <= leave.end) {
      modifiers[leave.status].push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  });

  const disabledDays = { before: new Date() };

  const handleSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    onRangeSelect(range);
  };

  return (
    <DayPicker
      mode="range"
      selected={selectedRange}
      onSelect={handleSelect}
      disabled={disabledDays}
      modifiers={modifiers}
      modifiersClassNames={{
        approved: "bg-green-200 text-green-800",
        pending: "bg-yellow-200 text-yellow-800",
        rejected: "bg-red-200 text-red-800",
      }}
     
      
    />
  );
};

export default AdvancedCalendar;
