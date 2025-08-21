import React, { useState } from "react";

interface LeaveRequest {
  id: number;
  start: string;
  end: string;
  status: "Approved" | "Pending" | "Rejected";
}

interface CalendarProps {
  leaveRequests: LeaveRequest[];
  onDateRangeSelect?: (start: string, end: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ leaveRequests, onDateRangeSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date().toISOString().split('T')[0];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDates([]);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDates([]);
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const isPastDate = (dateStr: string) => dateStr < today;

  const hasExistingLeave = (dateStr: string) => {
    return leaveRequests.some(req => dateStr >= req.start && dateStr <= req.end);
  };

  // Simple single click logic - toggle date selection
  const handleDateClick = (dateStr: string) => {
    if (isPastDate(dateStr) || hasExistingLeave(dateStr)) return;

    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        // Remove if already selected
        return prev.filter(d => d !== dateStr);
      } else {
        // Add to selection
        return [...prev, dateStr].sort();
      }
    });
  };

  // Double click to apply selection
  const handleDoubleClick = (dateStr: string) => {
    if (isPastDate(dateStr) || hasExistingLeave(dateStr)) return;

    let finalSelection = [...selectedDates];
    if (!finalSelection.includes(dateStr)) {
      finalSelection.push(dateStr);
    }
    finalSelection.sort();

    if (finalSelection.length > 0 && onDateRangeSelect) {
      onDateRangeSelect(finalSelection[0], finalSelection[finalSelection.length - 1]);
    }
    setSelectedDates([]);
  };

  const isDateSelected = (dateStr: string) => selectedDates.includes(dateStr);

  const isDateInRange = (dateStr: string) => {
    if (selectedDates.length < 2) return false;
    const sorted = [...selectedDates].sort();
    return dateStr >= sorted[0] && dateStr <= sorted[sorted.length - 1];
  };

  const getLeaveStatusColor = (dateStr: string) => {
    for (const req of leaveRequests) {
      if (dateStr >= req.start && dateStr <= req.end) {
        switch (req.status) {
          case "Approved": return "bg-green-200 border-green-400 text-green-800";
          case "Pending": return "bg-yellow-200 border-yellow-400 text-yellow-800";
          case "Rejected": return "bg-red-200 border-red-400 text-red-800";
        }
      }
    }
    return "";
  };

  const calculateLeaveDays = () => {
    if (selectedDates.length === 0) return 0;
    if (selectedDates.length === 1) return 1;
    
    const sorted = [...selectedDates].sort();
    const start = new Date(sorted[0]);
    const end = new Date(sorted[sorted.length - 1]);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="leave-calendar-wrapper max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header Section */}
      <div className="calendar-header-section bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="month-title text-2xl font-bold mb-1">
              {monthNames[month]} {year}
            </h2>
            <p className="text-blue-100 text-sm">Select dates for your leave request</p>
          </div>
          <div className="navigation-controls flex space-x-3">
            <button
              onClick={previousMonth}
              className="nav-btn bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-all duration-200"
              type="button"
            >
              <span className="text-lg font-bold">‹</span>
            </button>
            <button
              onClick={nextMonth}
              className="nav-btn bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-all duration-200"
              type="button"
            >
              <span className="text-lg font-bold">›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="calendar-body p-6">
        {/* Weekday Headers */}
        <div className="weekday-row grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="weekday-cell text-center text-sm font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid grid grid-cols-7 gap-2">
          {/* Empty cells */}
          {[...Array(firstDayOfMonth)].map((_, idx) => (
            <div key={`empty-${idx}`} className="empty-cell h-12" />
          ))}

          {/* Date cells */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
            const dateStr = formatDate(new Date(year, month, dayNum));
            const isPast = isPastDate(dateStr);
            const hasLeave = hasExistingLeave(dateStr);
            const isSelected = isDateSelected(dateStr);
            const isInRange = isDateInRange(dateStr);
            const leaveStatus = getLeaveStatusColor(dateStr);

            let cellClasses = "date-cell h-12 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 border-2 ";

            if (isPast) {
              cellClasses += "past-date bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed";
            } else if (hasLeave) {
              cellClasses += `existing-leave ${leaveStatus} cursor-not-allowed`;
            } else if (isSelected) {
              cellClasses += "selected-date bg-blue-500 border-blue-600 text-white shadow-md transform scale-105";
            } else if (isInRange && selectedDates.length > 1) {
              cellClasses += "range-date bg-blue-100 border-blue-300 text-blue-700";
            } else {
              cellClasses += "available-date bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer";
            }

            return (
              <div
                key={dateStr}
                className={cellClasses}
                onClick={() => handleDateClick(dateStr)}
                onDoubleClick={() => handleDoubleClick(dateStr)}
                title={
                  isPast ? "Past date" :
                  hasLeave ? "Leave already exists" :
                  isSelected ? "Selected - Click to deselect" :
                  "Click to select, Double-click to apply"
                }
              >
                <span>{dayNum}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedDates.length > 0 && (
        <div className="selection-summary bg-gray-50 border-t p-6">
          <div className="flex items-center justify-between">
            <div className="selection-info flex items-center space-x-4">
              <div className="info-card bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Selected Dates</div>
                <div className="font-semibold text-gray-800">{selectedDates.length}</div>
              </div>
              <div className="info-card bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Leave Period</div>
                <div className="font-semibold text-gray-800">
                  {selectedDates.length === 1 ? 
                    formatDate(new Date(selectedDates[0])) :
                    `${formatDate(new Date(selectedDates[0]))} - ${formatDate(new Date(selectedDates[selectedDates.length - 1]))}`
                  }
                </div>
              </div>
              <div className="info-card bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Total Days</div>
                <div className="font-semibold text-gray-800">{calculateLeaveDays()}</div>
              </div>
            </div>
            <div className="action-buttons flex space-x-3">
              <button
                onClick={() => {
                  const sorted = [...selectedDates].sort();
                  if (onDateRangeSelect) {
                    onDateRangeSelect(sorted[0], sorted[sorted.length - 1]);
                  }
                  setSelectedDates([]);
                }}
                className="apply-btn bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                Apply Leave Request
              </button>
              <button
                onClick={() => setSelectedDates([])}
                className="clear-btn bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="calendar-legend bg-white border-t p-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="legend-item flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 border-2 border-green-400 rounded"></div>
            <span className="text-gray-600">Approved Leave</span>
          </div>
          <div className="legend-item flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-400 rounded"></div>
            <span className="text-gray-600">Pending Leave</span>
          </div>
          <div className="legend-item flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-200 border-2 border-red-400 rounded"></div>
            <span className="text-gray-600">Rejected Leave</span>
          </div>
          <div className="legend-item flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Selected Dates</span>
          </div>
          <div className="legend-item flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded"></div>
            <span className="text-gray-600">Past Dates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;