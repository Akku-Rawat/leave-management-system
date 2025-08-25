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
    {
      category: "Emergency",
      remaining: 3,
      used: 2,
      total: 5,
      color: "#ef4444",
    },
  ];

  // Calendar events (leaves + holidays)
  const calendarEvents = [
    {
      date: "2025-08-24",
      label: "Casual Leave (Pending)",
      status: "pending" as const,
    },
    {
      date: "2025-08-25",
      label: "Casual Leave (Pending)",
      status: "pending" as const,
    },
    {
      date: "2025-09-15",
      label: "Casual Leave (Approved)",
      status: "approved" as const,
    },
    {
      date: "2025-09-16",
      label: "Casual Leave (Approved)",
      status: "approved" as const,
    },
    {
      date: "2025-10-02",
      label: "Gandhi Jayanti (Holiday)",
      status: "holiday" as const,
    },
    {
      date: "2025-10-24",
      label: "Dussehra (Holiday)",
      status: "holiday" as const,
    },
  ];

  // Extract only holidays for UpcomingHolidays
  const upcomingHolidays = calendarEvents
    .filter((e) => e.status === "holiday")
    .map((e) => {
      const date = new Date(e.date);
      return {
        dateISO: e.date,
        name: e.label.replace(" (Holiday)", ""),
        weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
        flag: "🎉", // you can enhance this: maybe map specific holidays to icons/flags
      };
    });

  // Recent leave requests (sample data)
  const recentRequests = [
    { id: 1, type: "Sick Leave", date: "Aug 20, 2025", status: "Approved" },
    { id: 2, type: "Casual Leave", date: "Aug 24–25, 2025", status: "Pending" },
    {
      id: 3,
      type: "Emergency Leave",
      date: "Jul 30, 2025",
      status: "Rejected",
    },
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
        {/* Left Column: Leave Overview + Recent Requests */}
        <div className="space-y-5">
          {/* Leave Summary */}
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

          {/* Recent Requests */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Recent Requests</h3>
            <ul className="divide-y divide-gray-200 text-sm">
              {recentRequests.map((req) => (
                <li
                  key={req.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{req.type}</p>
                    <p className="text-xs text-gray-500">{req.date}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {req.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Calendar + Holidays + Insights */}
        <div className="lg:col-span-2 space-y-5">
          {/* Combined Calendar + Holidays Card */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col lg:flex-row items-stretch gap-4">
            {/* Calendar (left side) */}
            <div className="flex-1 flex">
              <CompactCalendarCard events={calendarEvents} />
            </div>

            {/* Upcoming Holidays (right side, equal height & width) */}
            <div className="flex-1 flex">
              <UpcomingHolidays items={upcomingHolidays} className="w-full" />
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Quick Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • You have <strong>23 total leave days</strong> remaining.
              </li>
              <li>• Emergency leave balance is running low (3 left).</li>
              <li>
                • Next company holiday: <strong>Gandhi Jayanti (Oct 2)</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
