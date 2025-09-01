import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaCalendarAlt,
  FaBuilding,
  FaUsers,
  FaChartLine,
  FaEnvelope,
  FaBell,
  FaCog,
  FaCheckCircle,
  FaFileExcel,
  FaFilePdf,
  FaTimes,
} from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface ReportsProps {}

const Reports: React.FC<ReportsProps> = () => {
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [approvedRequests, setApprovedRequests] = useState<number>(0);
  const [totalLeaveDays, setTotalLeaveDays] = useState<number>(0);
  const [encashableLeaves, setEncashableLeaves] = useState<number>(5);
  const [rolloverEligible, setRolloverEligible] = useState<number>(3);
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [remainingLeaves, setRemainingLeaves] = useState<number>(0);

  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showEncash, setShowEncash] = useState(false);
  const [showRollover, setShowRollover] = useState(false);
  const [encashDays, setEncashDays] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const resReport = await fetch("/api/reports/summary");
        if (!resReport.ok) throw new Error("Failed to fetch report summary");
        const reportData = await resReport.json();

        setTotalRequests(reportData.totalRequests);
        setPendingRequests(reportData.pendingRequests);
        setApprovedRequests(reportData.approvedRequests);
        setTotalLeaveDays(reportData.totalLeaveDays);
        setEncashableLeaves(reportData.encashableLeaves);
        setRolloverEligible(reportData.rolloverEligible);
        setRemainingLeaves(reportData.remainingLeaves ?? 0);

        const resHolidays = await fetch("/api/holidays");
        if (!resHolidays.ok) throw new Error("Failed to fetch holidays");
        const holidaysData = await resHolidays.json();
        setHolidays(holidaysData.map((d: string) => new Date(d)));

      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    fetchData();
  }, []);

  const handleReportGeneration = async (type: string) => {
    setActiveReport(type);
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsGenerating(false);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting to ${format}`);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing bulk action: ${action}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">

      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📊 Reports & Analytics</h1>
        <p className="text-gray-600">Generate detailed reports and manage leave requests.</p>
      </div>

      {/* Quick Reports */}
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaChartLine className="mr-2 text-indigo-600" /> Quick Reports
        </h2>
        <div className="space-y-3">
          {[
            { id: "monthly", icon: <FaCalendarAlt />, label: "Monthly Summary" },
            { id: "department", icon: <FaBuilding />, label: "Department Wise" },
            { id: "leavetype", icon: <FaFileAlt />, label: "Leave Type Analysis" },
            { id: "employee", icon: <FaUsers />, label: "Employee Rankings" },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => handleReportGeneration(r.id)}
              disabled={isGenerating}
              className={`w-full flex items-center p-3 rounded-md border ${
                activeReport === r.id ? "bg-indigo-100 border-indigo-400" : "border-gray-200 hover:bg-gray-100"
              } transition ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-indigo-600 mr-3 text-lg">{r.icon}</span>
              {r.label}
              {isGenerating && activeReport === r.id && <span className="ml-auto animate-spin">⏳</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaDownload className="mr-2 text-green-600" /> Export Options
          </h2>
          <div className="space-y-2">
            <button onClick={() => handleExport("CSV")} className="flex items-center p-3 rounded-md bg-green-50 hover:bg-green-100 transition">
              <FaFileExcel className="text-green-600 mr-2" /> Download CSV
            </button>
            <button onClick={() => handleExport("PDF")} className="flex items-center p-3 rounded-md bg-red-50 hover:bg-red-100 transition">
              <FaFilePdf className="text-red-600 mr-2" /> Download PDF
            </button>
            <button onClick={() => handleExport("Email")} className="flex items-center p-3 rounded-md bg-blue-50 hover:bg-blue-100 transition">
              <FaEnvelope className="text-blue-600 mr-2" /> Email Report
            </button>
          </div>
        </div>

        {/* Remaining Leaves Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaCog className="mr-2 text-purple-600" /> Remaining Leaves
          </h2>
          <p className="text-3xl font-bold">{remainingLeaves} days</p>
          <p className="text-gray-600 mt-1">Available for cash out or rollover</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaCog className="mr-2 text-purple-600" /> Quick Actions
        </h2>
        <div className="space-y-2">
          <button onClick={() => handleBulkAction("approve")} className="flex items-center p-3 rounded-md bg-green-50 hover:bg-green-100 transition">
            <FaCheckCircle className="text-green-600 mr-2" /> Bulk Approve
          </button>
          <button onClick={() => handleBulkAction("remind")} className="flex items-center p-3 rounded-md bg-yellow-50 hover:bg-yellow-100 transition">
            <FaBell className="text-yellow-600 mr-2" /> Send Reminders
          </button>
          <button onClick={() => handleBulkAction("reject")} className="flex items-center p-3 rounded-md bg-red-50 hover:bg-red-100 transition">
            <FaTimes className="text-red-600 mr-2" /> Bulk Reject
          </button>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showCalendar} onClose={() => setShowCalendar(false)} className="fixed inset-0 flex items-center justify-center bg-black/30">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <button className="float-right text-gray-500 hover:text-gray-800" onClick={() => setShowCalendar(false)}>
            <FaTimes />
          </button>
          <h3 className="text-2xl font-bold mb-4">Holiday Calendar</h3>
          <Calendar
            tileClassName={({ date }) =>
              holidays.some((d: Date) => d.toDateString() === date.toDateString())
                ? "bg-red-200 text-red-800 font-semibold rounded"
                : undefined
            }
            className="react-calendar-custom"
          />
        </Dialog.Panel>
      </Dialog>

      <Dialog open={showEncash} onClose={() => setShowEncash(false)} className="fixed inset-0 flex items-center justify-center bg-black/30">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
          <button className="float-right text-gray-500 hover:text-gray-800" onClick={() => setShowEncash(false)}>
            <FaTimes />
          </button>
          <h3 className="text-2xl font-bold mb-4">Encash Leaves</h3>
          <input
            type="number"
            min={1}
            max={encashableLeaves}
            value={encashDays}
            onChange={(e) => setEncashDays(Number(e.target.value))}
            className="border p-2 w-full mb-4 rounded-md"
          />
          <button onClick={() => setShowEncash(false)} className="w-full bg-green-500 text-white rounded-md p-2 hover:bg-green-600">
            Confirm
          </button>
        </Dialog.Panel>
      </Dialog>

      <Dialog open={showRollover} onClose={() => setShowRollover(false)} className="fixed inset-0 flex items-center justify-center bg-black/30">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
          <button className="float-right text-gray-500 hover:text-gray-800" onClick={() => setShowRollover(false)}>
            <FaTimes />
          </button>
          <h3 className="text-2xl font-bold mb-4">Rollover Leaves</h3>
          <p>You can rollover up to {rolloverEligible} days</p>
          <button onClick={() => setShowRollover(false)} className="w-full bg-yellow-500 text-white rounded-md p-2 hover:bg-yellow-600 mt-4">
            Confirm
          </button>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default Reports;
