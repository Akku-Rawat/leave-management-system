import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ApplyForLeaveCard from "../components/ApplyForLeaveCard";
import UpcomingLeaves from "../components/UpcomingLeaves";
import RecentLeaveRequests from "../components/RecentLeaveRequests";
import CalendarCard from "../components/CalendarCard";
import UpcomingHolidays from "../components/UpcomingHolidays";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const summary = [
    { title: "Casual Leaves", remaining: 12, total: 16, used: 4, icon: <span>🧘</span>, barClass: "bg-emerald-500" },
    { title: "Sick Leaves",   remaining: 8,  total: 10, used: 2, icon: <span>🤒</span>, barClass: "bg-amber-500" },
    { title: "Emergency Leaves", remaining: 3, total: 5, used: 2, icon: <span>⚡</span>, barClass: "bg-rose-500" },
  ];

  const upcoming = [
    { type: "Casual Leave", range: "Aug 24 – Aug 25, 2023", days: 2, status: "Pending" as const },
    { type: "Casual Leave", range: "Sep 15 – Sep 19, 2023", days: 5, status: "Approved" as const },
  ];

  const recent = [
    { type: "Casual Leave",    date: "Jul 01 – 03, 2023", duration: "3 days", status: "Approved" as const },
    { type: "Sick Leave",      date: "Jun 05, 2023",      duration: "1 day",  status: "Approved" as const },
    { type: "Emergency Leave", date: "May 02, 2023",      duration: "1 day",  status: "Approved" as const },
  ];

  // Rich calendar events with status & labels (for colored dots + tooltips)
  const calendarEvents = [
    { date: "2023-08-24", label: "Casual Leave (Pending)",  status: "pending"  as const },
    { date: "2023-08-25", label: "Casual Leave (Pending)",  status: "pending"  as const },
    { date: "2023-09-15", label: "Casual Leave (Approved)", status: "approved" as const },
    { date: "2023-09-16", label: "Casual Leave (Approved)", status: "approved" as const },
    { date: "2023-09-17", label: "Casual Leave (Approved)", status: "approved" as const },
    { date: "2023-09-18", label: "Casual Leave (Approved)", status: "approved" as const },
    { date: "2023-09-19", label: "Casual Leave (Approved)", status: "approved" as const },
  ];

  return (
    <Layout>
      <Header name="Shivangi" />

      {/* Top stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-5">
        {summary.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            remaining={s.remaining}
            total={s.total}
            used={s.used}
            icon={s.icon}
            barClass={s.barClass}
          />
        ))}
      </div>

      {/* Three balanced columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Apply + Recent */}
        <div className="space-y-5 flex flex-col">
          <ApplyForLeaveCard onApply={() => navigate("/apply-leave")} />
          <RecentLeaveRequests rows={recent} className="flex-1" />
        </div>

        {/* Column 2: Calendar + Holidays */}
        <div className="space-y-5 flex flex-col">
          <CalendarCard events={calendarEvents} className="flex-1" />
          <UpcomingHolidays />
        </div>

        {/* Column 3: Upcoming Leaves */}
        <div className="flex flex-col">
          <UpcomingLeaves items={upcoming} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
