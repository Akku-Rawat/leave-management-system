// src/pages/employee/ApplyLeavePage.tsx
import React, { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import Header from "../../components/Header";
import { useLeave } from "../../context/LeaveContext"; // ✅ use global context
import type { LeaveRequestType } from "../../context/LeaveContext";
import toast from "react-hot-toast";

type Errors = {
  leaveType?: string;
  fromDate?: string;
  toDate?: string;
  reason?: string;
};

const ApplyLeavePage: React.FC = () => {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // ✅ get global addLeave function
  const { addLeave } = useLeave();

  // ✅ state for form inputs only
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const e: Errors = {};
    if (!leaveType) e.leaveType = "Choose a leave type.";
    if (!fromDate) e.fromDate = "Pick a start date.";
    if (!toDate) e.toDate = "Pick an end date.";
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      e.toDate = "End date cannot be before start date.";
    }
    if (reason.trim().length < 10) e.reason = "Minimum 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    // ✅ create new leave object
    const newLeave: LeaveRequestType = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      type: leaveType,
      start: fromDate,
      end: toDate,
      days:
        (new Date(toDate).getTime() - new Date(fromDate).getTime()) /
          (1000 * 60 * 60 * 24) +
        1,
      status: "Pending",
      reason,
    };

    // ✅ add leave to global context
    addLeave(newLeave);

    // ✅ reset form
    setLeaveType("");
    setFromDate("");
    setToDate("");
    setReason("");

    // ✅ show success toast
    toast.success("Leave request submitted!");
  };

  const field = (err?: string) =>
    `w-full border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      err ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <Layout>
      <Header name="Shivangi" />

      {/* Leave Form */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-6">Apply for Leave</h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className={field(errors.leaveType)}
            >
              <option value="">Select</option>
              <option value="Casual Leave">🌴 Casual Leave</option>
              <option value="Sick Leave">🤒 Sick Leave</option>
              <option value="Emergency Leave">⚡ Emergency Leave</option>
            </select>
            {errors.leaveType && (
              <p className="text-xs text-red-600 mt-1">{errors.leaveType}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                From
              </label>
              <input
                type="date"
                min={today}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={field(errors.fromDate)}
              />
              {errors.fromDate && (
                <p className="text-xs text-red-600 mt-1">{errors.fromDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                To
              </label>
              <input
                type="date"
                min={fromDate || today}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={field(errors.toDate)}
              />
              {errors.toDate && (
                <p className="text-xs text-red-600 mt-1">{errors.toDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Reason
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={field(errors.reason)}
              placeholder="Briefly explain…"
            />
            {errors.reason && (
              <p className="text-xs text-red-600 mt-1">{errors.reason}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ApplyLeavePage;
