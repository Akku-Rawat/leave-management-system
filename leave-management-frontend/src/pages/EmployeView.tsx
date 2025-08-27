import React, { useState } from "react";
import AdvancedCalendar from "./Calendar";
import { FaUsers, FaCalendarAlt, FaClock } from "react-icons/fa";
import type { LeaveRequestProps, Leave } from "../Types";

const EmployeeView: React.FC<LeaveRequestProps> = ({ 
  onSubmit, 
  userName = "User",
  userRole = "employee",
  allRequests = []
}) => {
  const [formData, setFormData] = useState({
    type: "",
    duration: "full",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
  });

  // Convert leave requests to calendar leaves
  const leaves: Leave[] = allRequests.map(req => ({
    start: new Date(req.startDate),
    end: new Date(req.endDate),
    status: req.status.toLowerCase() as "approved" | "pending" | "rejected"
  }));

  // Calculate user stats from requests
  const userStats = {
    totalLeaves: 30, // This should come from backend
    usedLeaves: allRequests.filter(req => req.status === "Approved").length,
    pendingLeaves: allRequests.filter(req => req.status === "Pending").length,
  };

  const remainingLeaves = userStats.totalLeaves - userStats.usedLeaves - userStats.pendingLeaves;

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    console.log("Range selected:", range);
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
      // Single date selected
      setFormData((prev) => ({
        ...prev,
        startDate: formatDate(range.from!),
        endDate: formatDate(range.from!),
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      alert("Please fill all required fields");
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({ 
      type: "", 
      duration: "full", 
      startDate: "", 
      endDate: "", 
      reason: "", 
      emergencyContact: "" 
    });
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        {/* LEFT SIDE - Stats + Calendar */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Employee Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userName}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <FaCalendarAlt className="mx-auto text-2xl text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-800">{userStats.totalLeaves}</div>
              <div className="text-sm text-blue-600">Total Balance</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg text-center">
              <FaClock className="mx-auto text-2xl text-red-600 mb-2" />
              <div className="text-2xl font-bold text-red-800">{userStats.usedLeaves}</div>
              <div className="text-sm text-red-600">Used</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <FaUsers className="mx-auto text-2xl text-yellow-600 mb-2" />
              <div className="text-2xl font-bold text-yellow-800">{userStats.pendingLeaves}</div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <FaCalendarAlt className="mx-auto text-2xl text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-800">{remainingLeaves}</div>
              <div className="text-sm text-green-600">Remaining</div>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendar View</h3>
            <AdvancedCalendar leaves={leaves} onRangeSelect={handleRangeSelect} />
          </div>
        </div>

        {/* RIGHT SIDE - Apply Form */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Apply for Leave</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select leave type</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                id="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="full">Full Day</option>
                <option value="first-half">First Half</option>
                <option value="second-half">Second Half</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                placeholder="Brief reason for leave"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
              />
            </div>

            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency contact number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;