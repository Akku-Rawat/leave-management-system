import React, { useState } from "react";
import AdvancedCalendar from './Calendar';

interface LeaveRequestData {
  type: string;
  duration: string;
  startDate: string;
  endDate: string;
  reason: string;
  emergencyContact: string;
}

interface LeaveRequestProps {
  onSubmit?: (data: LeaveRequestData) => void;
  setActiveView?: (view: string) => void;
}

const LeaveRequest: React.FC<LeaveRequestProps> = ({ onSubmit, setActiveView }) => {
  const [formData, setFormData] = useState<LeaveRequestData>({
    type: "",
    duration: "full",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
  });
const dummyLeaves = [
  { start: new Date("2025-08-10"), end: new Date("2025-08-12"), status: "approved" as const },
  { start: new Date("2025-08-15"), end: new Date("2025-08-16"), status: "pending" as const },
];
// Calendar se selected range form me dalna
const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
  if (!range) return;
  if (range.from && range.to) {
    const start = range.from < range.to ? range.from : range.to;
    const end = range.to > range.from ? range.to : range.from;
    setFormData((prev) => ({
      ...prev,
      startDate: formatDate(start),
      endDate: formatDate(end),
    }));
  } else if (range.from) {
  setFormData((prev) => ({
    ...prev,
    startDate: formatDate(range.from!), // Bas '!' laga do yahan
    endDate: "",
  }));
} else {
    setFormData((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
    }));
  }
};


<div style={{ height: '400px', overflow: 'hidden' }}>
  <AdvancedCalendar leaves={dummyLeaves} onRangeSelect={handleRangeSelect} />
</div>

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-1 flex justify-center items-start">
      {/* Main Card (no overflow now) */}
      <div className="bg-white rounded-2xl shadow-xl flex w-11/12 max-w-6xl h-[690px] mx-auto">

        
        {/* LEFT SIDE (40%) */}
        <div className="w-2/5 p-6  flex flex-col justify-start mt-6">
          {/* Stats */}
          <div className="w-30 h-40 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-md rounded-xl p-6 w-[180px] h-32 flex flex-col justify-center border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Total Leave Balance</p>
              <p className="text-xl font-bold text-gray-900">30 Days</p>
            </div>
            <div className="bg-white shadow-md rounded-xl  p-6 w-[180px] h-32 flex flex-col justify-center border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Used This Year</p>
              <p className="text-xl font-bold text-gray-900">10 Days</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 w-[180px] h-32 flex flex-col justify-center border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
              <p className="text-xl font-bold text-gray-900">8</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 w-[180px] h-32 flex flex-col justify-center border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-xl font-bold text-gray-900">20</p>
            </div>

    <div className="p-4 bg-white rounded-xl shadow-md h-[340px] w-[390px] flex items-center justify-center">
      <AdvancedCalendar leaves={dummyLeaves} onRangeSelect={handleRangeSelect} />
    </div>

          </div>
          

        </div>
        

        {/* RIGHT SIDE (60%) -> Form */}
        <div className="w-3/5 p-6">
          <div className="mb-8 bg-white p-6 rounded-xl shadow-md h-[650px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for Leave</h2>
            <p className="text-gray-600 mb-6">
              Submit a new leave request for approval.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
              {/* Leave Type */}
              <div className="flex-1 min-w-[200px] bg-gray-50 p-4 rounded-xl shadow">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Maternity/Paternity">Maternity/Paternity</option>
                </select>
              </div>

              {/* Duration */}
              <div className="flex-1 min-w-[200px] bg-gray-50 p-4 rounded-xl shadow">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  id="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full">Full Day</option>
                  <option value="firstHalf">First Half</option>
                  <option value="secondHalf">Second Half</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="flex-1 min-w-[200px] bg-gray-50 p-4 rounded-xl shadow">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* End Date */}
              <div className="flex-1 min-w-[200px] bg-gray-50 p-4 rounded-xl shadow">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  min={formData.startDate || new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Reason */}
              <div className="flex-1 min-w-[400px] bg-gray-50 p-4 rounded-xl shadow">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  id="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please provide a reason for your leave request..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="reset"
                  onClick={() =>
                    setFormData({
                      type: "",
                      duration: "full",
                      startDate: "",
                      endDate: "",
                      reason: "",
                      emergencyContact: "",
                    })
                  }
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;