import React, { useState } from "react";
import AdvancedCalendar from "./Calendar";
import { FaUsers, FaCalendarAlt, FaClock } from "react-icons/fa";
import type { LeaveRequestProps } from "../Types";

const EncashmentModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  availableLeaves: number;
}> = ({ visible, onClose, availableLeaves }) => {
  const [option, setOption] = useState<"cash" | "carry" | null>(null);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-md w-full shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Encashment Request</h3>
        <p className="mb-4">
          Available Leaves: <strong>{availableLeaves}</strong>
        </p>
        <div className="mb-6">
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              name="encashOption"
              value="cash"
              onChange={() => setOption("cash")}
              className="form-radio"
            />
            <span className="ml-2">Cash Payout</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="encashOption"
              value="carry"
              onChange={() => setOption("carry")}
              className="form-radio"
            />
            <span className="ml-2">Carry Forward</span>
          </label>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={!option}
            onClick={() => {
              alert(`You selected: ${option}`);
              onClose();
            }}
            className={`px-4 py-2 text-white rounded ${
              option ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeView: React.FC<LeaveRequestProps> = ({ onSubmit, userName = "User" }) => {
  const [formData, setFormData] = useState({
    type: "",
    duration: "full",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
  });
  const [showEncashModal, setShowEncashModal] = useState(false);

  const dummyLeaves = [
    { start: new Date("2025-08-10"), end: new Date("2025-08-12"), status: "approved" as const },
    { start: new Date("2025-08-15"), end: new Date("2025-08-16"), status: "pending" as const },
  ];

  const userData = {
    totalLeaves: 32,
    usedLeaves: 8,
    pendingLeaves: 2,
  };

  const remainingLeaves = userData.totalLeaves - userData.usedLeaves - userData.pendingLeaves;

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
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-white via-slate-50 to-blue-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* LEFT SIDE - Stats + Calendar */}
            <div className="lg:w-2/5 bg-gradient-to-br from-slate-100 to-blue-100 p-8 relative">
              <div className="relative z-10 space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-3 flex items-center text-gray-800">
                    <FaUsers className="mr-3 text-blue-500" /> Employee Dashboard
                  </h2>
                  <p className="text-gray-600 text-sm">Welcome back, {userName}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <div className="text-2xl font-bold text-gray-800">{userData.totalLeaves}</div>
                    <div className="text-xs text-gray-500">Total Balance</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <div className="text-2xl font-bold text-gray-800">{userData.usedLeaves}</div>
                    <div className="text-xs text-gray-500">Used</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <div className="text-2xl font-bold text-amber-500">{userData.pendingLeaves}</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm text-center relative">
                    <div className="text-2xl font-bold text-emerald-500">{remainingLeaves}</div>
                    <div className="text-xs text-gray-500">Remaining</div>
                    {/* Encash Leave Button */}
                    <button
                      onClick={() => setShowEncashModal(true)}
                      className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Options
                    </button>
                  </div>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="font-bold mb-3 text-gray-700 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" /> Calendar View
                  </h3>
                  <div className="w-full">
                    <AdvancedCalendar leaves={dummyLeaves} onRangeSelect={handleRangeSelect} />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Apply Form */}
            <div className="lg:w-3/5 p-8 bg-slate-50">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                  <FaClock className="mr-3 text-blue-500" /> Apply for Leave
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-md p-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold">
                      Leave Type
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-xl p-3 bg-slate-50"
                    >
                      <option value="">Select leave type</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-semibold">
                      Duration
                    </label>
                    <select
                      id="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full border rounded-xl p-3 bg-slate-50"
                    >
                      <option value="full">Full Day</option>
                      <option value="first">First Half</option>
                      <option value="second">Second Half</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <input
                      type="date"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-xl p-3 bg-slate-50"
                    />
                    <input
                      type="date"
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-xl p-3 bg-slate-50"
                    />
                  </div>
                  <textarea
                    id="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Reason..."
                    className="w-full border rounded-xl p-3 bg-slate-50"
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
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
                      className="px-6 py-3 border rounded-xl text-gray-600 bg-gray-50"
                    >
                      Reset
                    </button>
                    <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-xl">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Encashment Modal */}
      <EncashmentModal
        visible={showEncashModal}
        onClose={() => setShowEncashModal(false)}
        availableLeaves={remainingLeaves}
      />
    </div>
  );
};

export default EmployeeView;
