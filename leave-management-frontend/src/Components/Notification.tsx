import React, { useEffect, useState } from "react";
import { CheckCircle, Loader2, ArrowLeft, Clock } from "lucide-react";
import type { LeaveRequestType } from "../Types";

interface NotificationScreenProps {
  onBack: () => void;
  onGoToHistory: () => void;
  lastRequest: LeaveRequestType;   // ✅ App.tsx se latest request aayegi
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ onBack, onGoToHistory, lastRequest }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-6 w-[500px] animate-fadeIn">
          <Loader2 className="w-14 h-14 text-blue-600 animate-spin" />
          <p className="text-gray-700 text-lg font-medium">
            Submitting your request...
          </p>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-2xl w-full text-center animate-fadeIn">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Leave Submitted Successfully!
          </h2>

          {/* Status Badge */}
          <span className="inline-block px-3 py-1 mb-6 text-sm font-medium rounded-full bg-green-100 text-green-700">
            Status: {lastRequest.status}
          </span>

          {/* Leave Summary */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 text-left">
            <p className="text-sm text-gray-600">
              <strong>Leave Type:</strong> {lastRequest.type}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Duration:</strong> {lastRequest.start} to {lastRequest.end}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total Days:</strong> {lastRequest.days}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Reason:</strong> {lastRequest.reason}
            </p>
          </div>

          <p className="text-gray-600 mb-8 text-lg">
            Your leave request has been recorded and is pending manager approval.
          </p>

          <div className="flex justify-center gap-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-8 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-lg"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button
              onClick={onGoToHistory}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-md text-lg"
            >
              <Clock className="w-5 h-5" /> Go to History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationScreen;
