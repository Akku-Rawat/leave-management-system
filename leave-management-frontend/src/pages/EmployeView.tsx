import React, { useState, useEffect } from "react";
import AdvancedCalendar from "./Calendar";
import { FaUsers, FaCalendarAlt, FaClock } from "react-icons/fa";
import type { LeaveRequestProps, Leave, LeaveStatus } from "../Types";

const EmployeeView: React.FC<LeaveRequestProps> = ({ onSubmit, userName = "User" }) => {
  type LeaveFormData = {
    type: string;
    duration: "full" | "first" | "second";
    startDate: string;
    endDate: string;
    reason: string;
    emergencyContact: string;
  };

  const [formData, setFormData] = useState<LeaveFormData>({
    type: "",
    duration: "full",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
  });

  const [showEncashModal, setShowEncashModal] = useState(false);

  const [leaves, setLeaves] = useState<Leave[]>([]);

  const [userData, setUserData] = useState({
    totalLeaves: 0,
    usedLeaves: 0,
    pendingLeaves: 0,
  });

  const remainingLeaves = userData.totalLeaves - userData.usedLeaves - userData.pendingLeaves;

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
 async function fetchData() {
  try {
    const token = localStorage.getItem("token"); // apne token storage ke hisab se adjust karo

    const leavesRes = await fetch("/api/leaves/my", {
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
    });
    const leavesJson = await leavesRes.json();

    if (!Array.isArray(leavesJson)) {
      throw new Error('Invalid leaves data');
    }

   const formattedLeaves = leavesJson.map((leave: any) => {
  const startDate = leave.startDate && !isNaN(Date.parse(leave.startDate))
    ? new Date(leave.startDate).toISOString()
    : null;
  
  const endDate = leave.endDate && !isNaN(Date.parse(leave.endDate))
    ? new Date(leave.endDate).toISOString()
    : null;

  return {
    start: startDate,
    end: endDate,
    status: leave.status as LeaveStatus,
  };
});
    setLeaves(formattedLeaves);

    const statsRes = await fetch("/api/leaves/stats", {
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
    });
    const statsJson = await statsRes.json();
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
  try {
    // localStorage se token uthao, agar aapka token wahan stored hai
    const token = localStorage.getItem("token");

    const response = await fetch("/api/leaves/create", {
      method: "POST",
      credentials: "include", // agar aap cookie-based auth use kar rahe ho, nahi toh hatao
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Backend se error message lene ki koshish karo
      const errorText = await response.text();
      throw new Error(`Failed to submit leave request: ${response.status} - ${errorText}`);
    }

    await response.json();

    alert("Leave request submitted successfully.");
    if (onSubmit) onSubmit(formData);
  } catch (error: any) {
    console.error("Error submitting leave request:", error);
    alert(`Error submitting leave request: ${error.message || error}`);
  }
};


  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 h-[650px] py-8 px-6">
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
        Options
      </button>
    </div>
  </div>

  {/* Calendar */}
  <div className="flex-1 bg-slate-100 rounded-xl shadow-sm p-4 overflow-hidden ">
    <h3 className="font-bold mb-3 text-gray-700 flex items-center">
      <FaCalendarAlt className="mr-2 text-blue-500" /> Calendar View
    </h3>
    <div className="w-full h-full">
      <AdvancedCalendar leaves={leaves} onRangeSelect={handleRangeSelect} />
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
      {/* <EncashmentModal visible={showEncashModal} onClose={() => setShowEncashModal(false)} availableLeaves={remainingLeaves} /> */}
    </div>
  );
};

export default EmployeeView;
