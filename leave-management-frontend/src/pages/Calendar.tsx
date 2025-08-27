import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Define LeaveStatus as a union type of strings
type LeaveStatus = "approved" | "pending" | "rejected";

// Define Leave interface
export interface Leave {
  start: Date;
  end: Date;
  status: LeaveStatus;
}

// Define the props interface for the component
interface AdvancedCalendarProps {
  leaves: Leave[];
  onRangeSelect: (range: DateRange | undefined) => void;
}

const AdvancedCalendar: React.FC<AdvancedCalendarProps> = ({ leaves = [], onRangeSelect }) => {
  // Use DateRange | undefined for state
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

  // Prepare modifiers for styling days
  const modifiers: Record<string, Date[]> = {
    approved: [],
    pending: [],
    rejected: [],
  };

  // Process leaves to create modifiers
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
    console.log("Calendar range selected:", range);
    setSelectedRange(range);
    onRangeSelect(range);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={handleSelect}
        disabled={disabledDays}
        modifiers={modifiers}
        modifiersStyles={{
          approved: { 
            backgroundColor: '#10b981', 
            color: 'white',
            fontWeight: 'bold'
          },
          pending: { 
            backgroundColor: '#f59e0b', 
            color: 'white',
            fontWeight: 'bold'
          },
          rejected: { 
            backgroundColor: '#ef4444', 
            color: 'white',
            fontWeight: 'bold'
          },
        }}
        className="rdp"
      />

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-2">Legend:</div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Approved</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCalendar;