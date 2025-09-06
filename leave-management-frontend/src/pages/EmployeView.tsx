import React, { useState, useEffect } from "react";

import AdvancedCalendar from "./Calendar";

import { FaUsers, FaCalendarAlt, FaClock } from "react-icons/fa";

import type { LeaveRequestProps, Leave, LeaveStatus } from "../Types";

import NotificationScreen from "../components/Notification";

import EncashmentModal from "./EncashmentModal";

import { useNavigate } from "react-router-dom";
import { getMyLeaves, getStats, createLeave, encashLeaves } from "../services/api";





const EmployeeView: React.FC<LeaveRequestProps> = ({ onSubmit }) => {
  type LeaveFormData = {
    type: string;
    duration: "full" | "first" | "second";
    startDate: string;
    endDate: string;
    reason: string;
    emergencyContact: string;
  };

  // map your Leave (string dates) into CalendarLeave (Date dates)  
  // type CalendarLeave = {
  //   start: Date;
  //   end: Date;
  //   status: LeaveStatus;
  // };

  const navigate = useNavigate();


  const [formData, setFormData] = useState<LeaveFormData>({
    type: "",
    duration: "full",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
  });

  const [showEncashModal, setShowEncashModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [userData, setUserData] = useState({
    totalLeaves: 0,
    usedLeaves: 0,
    pendingLeaves: 0,
  });

  const [loading, setLoading] = useState(false);

  const remainingLeaves = userData.totalLeaves - userData.usedLeaves;

  const formatDate = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in ms
    const localISO = new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
    return localISO; // YYYY-MM-DD in local timezone
  };

useEffect(() => {
  async function fetchData() {
    try {
      const token = localStorage.getItem("token") ?? undefined;
      const leavesJson = await getMyLeaves(token);
      setLeaves(leavesJson);

      const statsJson = await getStats(token);
      setUserData({
        totalLeaves: statsJson.totalLeaves,
        usedLeaves: statsJson.usedLeaves,
        pendingLeaves: statsJson.pendingLeaves,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }
  fetchData();
}, []);
const handleEncash = async (action: "carry_forward" | "cash_encash") => {
  try {
    const token = localStorage.getItem("token") ?? undefined;
    await encashLeaves(action, token);
    setShowEncashModal(false);
    // refetch stats/leaves to reflect changes
    const stats = await getStats(token);
    setUserData(stats);
    const currentLeaves = await getMyLeaves(token);
    setLeaves(currentLeaves);
    alert("Encashment successful");
  } catch (e: any) {
    console.error(e);
    alert(`Encashment failed: ${e.response?.data?.error || e.message}`);
  }
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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const token = localStorage.getItem("token") ?? undefined;
    const result = await createLeave(formData, token);

    setFormData({
      type: "",
      duration: "full",
      startDate: "",
      endDate: "",
      reason: "",
      emergencyContact: "",
    });

    setLoading(false);
    setShowNotification(true);
    if (onSubmit) onSubmit(result);
  } catch (error: any) {
    setLoading(false);
    console.error("Error submitting leave request:", error);
    alert(`Error: ${error.message || error}`);
  }
};

  if (showNotification) {
    return (
      <NotificationScreen
        onGoToHistory={() => {
          setShowNotification(false);
          navigate("/history"); // Navigate to sidebar History page route
        }}
        onGoBack={() => setShowNotification(false)}
      />
    );
  }

  if (loading) {
    // Show only a centered loading spinner circle while loading
    return (
      <div className="flex justify-center items-center h-[550px]">
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 h-[300px] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Single Card Container */}
            <div className="lg:w-2/5 h-[650px] bg-white rounded-xl shadow-lg p-6 flex flex-col overflow-auto">
              {/* Header */}
              <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                <FaUsers className="mr-3 text-blue-500" /> Employee Dashboard
              </h2>

              {/* Stats Cards - grid with gaps */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-100 h-[70px] rounded-xl p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-gray-800">{userData.totalLeaves}</div>
                  <div className="text-xs text-gray-500">Total Balance</div>
                </div>
                <div className="bg-slate-100 h-[70px] rounded-xl p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-gray-800">{userData.usedLeaves}</div>
                  <div className="text-xs text-gray-500">Used</div>
                </div>
                <div className="bg-slate-100 h-[100px] rounded-xl p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-amber-500">{userData.pendingLeaves}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="bg-slate-100 h-[100px] rounded-xl p-4 shadow-sm text-center relative">
                  <div className="text-2xl font-bold text-emerald-500">{remainingLeaves}</div>
                  <div className="text-xs text-gray-500">Remaining</div>
                  <button
                    onClick={() => setShowEncashModal(true)}
                    className="mt-2 px-3 py-1 h-[25px] text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    L-Settle
                  </button>
                </div>
              </div>

              {/* Calendar */}
              <div className="flex-1 bg-slate-100 rounded-xl shadow-sm p-4 overflow-hidden">
                <h3 className="font-bold mb-3 text-gray-700 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" /> Calendar View
                </h3>
                <div className="w-full h-full">
                  {(() => {
                    try {
                      const calendarLeaves = leaves
                        .filter(l => l.start && l.end)
                        .map(l => ({
                          start: new Date(l.start!),
                          end: new Date(l.end!),
                          status: l.status as LeaveStatus,
                        }));

                      return <AdvancedCalendar leaves={calendarLeaves} onRangeSelect={handleRangeSelect} />;
                    } catch (error) {
                      console.error(error);
                      return <div>Error rendering calendar</div>;
                    }
                  })()}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Apply Form */}
            <div className="lg:w-3/5 p-8 bg-slate-50">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                  <FaClock className="mr-3 text-blue-500" /> Apply for Leave
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-md p-6 h-[550px]">
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
                      disabled={loading}
                    >
                      <option value="">Select leave type</option>
                      <option value="Casual Leave">Casual Leave</option>
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
                      disabled={loading}
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
                      disabled={loading}
                    />
                    <input
                      type="date"
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-xl p-3 bg-slate-50"
                      disabled={loading}
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
                    disabled={loading}
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
                      disabled={loading}
                    >
                      Reset
                    </button>
                    <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-xl" disabled={loading}>
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    <EncashmentModal
  visible={showEncashModal}
  onClose={() => setShowEncashModal(false)}
  availableLeaves={remainingLeaves}
  onConfirm={() => handleEncash("cash_encash")}
/>
    </div>
  );
};

export default EmployeeView;
