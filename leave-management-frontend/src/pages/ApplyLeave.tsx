import React, { useState } from "react";

interface LeaveRequestData {
  type: string;
  duration: string;
  startDate: string;
  endDate: string;
  reason: string;
  emergencyContact: string;
}

interface ApplyLeaveProps {
  onSubmit: (data: LeaveRequestData) => void;
  setActiveView: (view: string) => void;
}

const ApplyLeave: React.FC<ApplyLeaveProps> = ({ onSubmit, setActiveView }) => {
  const [formData, setFormData] = useState<LeaveRequestData>({
    type: "",
    duration: "full",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit(formData);
};


  return (
    <div className="mb-8 max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for Leave</h2>
      <p className="text-gray-600 mb-6">
        Submit a new leave request for approval.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
        {/* Leave Type */}
        <div className="flex-1 min-w-[250px] bg-gray-50 p-4 rounded-xl shadow">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
        <div className="flex-1 min-w-[250px] bg-gray-50 p-4 rounded-xl shadow">
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
        <div className="flex-1 min-w-[250px] bg-gray-50 p-4 rounded-xl shadow">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
        <div className="flex-1 min-w-[250px] bg-gray-50 p-4 rounded-xl shadow">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
        <div className="flex-1 min-w-[350px] bg-gray-50 p-4 rounded-xl shadow">
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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

        {/* Emergency Contact */}
        <div className="flex-1 min-w-[250px] bg-gray-50 p-4 rounded-xl shadow">
          <label
            htmlFor="emergencyContact"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Emergency Contact (Optional)
          </label>
          <input
            type="tel"
            id="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-between items-center mt-4">
          {/* Back Button */}
          <button
            onClick={() => setActiveView("dashboard")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>

          {/* Reset + Submit */}
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
        </div>
      </form>
    </div>
  );
};

export default ApplyLeave;
