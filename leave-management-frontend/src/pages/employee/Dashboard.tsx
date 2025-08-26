import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Header from "../../components/Header";
import ApplyForLeaveCard from "../../components/ApplyForLeaveCard";
import CompactCalendarCard from "../../components/CompactCalendarCard";
import UpcomingHolidays from "../../components/UpcomingHolidays";
import LeaveSummaryChart from "../../components/LeaveSummaryChart";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Adaptive header glow
  const hour = new Date().getHours();
  let glowClass = "shadow-blue-100/70";
  if (hour >= 11 && hour < 17) glowClass = "shadow-yellow-100/70";
  else if (hour >= 17 || hour < 6) glowClass = "shadow-indigo-200/70";

  // Leave summary dataset
  const summary = [
    { category: "Casual", remaining: 12, used: 4, total: 16, color: "#10b981" },
    { category: "Sick", remaining: 8, used: 2, total: 10, color: "#f59e0b" },
    { category: "Emergency", remaining: 3, used: 2, total: 5, color: "#ef4444" },
  ];

  // Calendar events (leaves + holidays)
  const calendarEvents = [
    { date: "2025-08-24", label: "Casual Leave (Pending)", status: "pending" as const },
    { date: "2025-08-25", label: "Casual Leave (Pending)", status: "pending" as const },
    { date: "2025-09-15", label: "Casual Leave (Approved)", status: "approved" as const },
    { date: "2025-09-16", label: "Casual Leave (Approved)", status: "approved" as const },
    { date: "2025-10-02", label: "Gandhi Jayanti (Holiday)", status: "holiday" as const },
    { date: "2025-10-24", label: "Dussehra (Holiday)", status: "holiday" as const },
  ];

  return (
    <Layout>
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-50 mx-4 mt-2 rounded-2xl bg-white shadow-lg ${glowClass}`}
      >
        <Header name="Shivangi" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Leave Overview */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow p-4 space-y-4">
            <LeaveSummaryChart data={summary} />

            <div className="flex flex-col gap-3">
              <ApplyForLeaveCard onApply={() => navigate("/apply-leave")} />
              <button
                onClick={() => navigate("/leave-history")}
                className="text-sm text-blue-600 underline self-start"
              >
                View Past Requests →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar + Holidays + Insights */}
        <div className="lg:col-span-2 space-y-5">
          {/* Combined Calendar + Holidays Card */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <CompactCalendarCard events={calendarEvents} />
            </div>
            <div className="w-full lg:w-1/3">
              <UpcomingHolidays />
            </div>
          </div>

          {/* Quick Insights / Notifications */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Quick Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• You have <strong>23 total leave days</strong> remaining.</li>
              <li>• Emergency leave balance is running low (3 left).</li>
              <li>• Next company holiday: <strong>Gandhi Jayanti (Oct 2)</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
