import React from "react";
import { FaCheckCircle, FaHistory, FaArrowLeft } from "react-icons/fa";

interface NotificationScreenProps {
  onGoToHistory: () => void;
  onGoBack: () => void;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ onGoToHistory, onGoBack }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md mx-auto text-center p-8 bg-green-50 rounded-xl border border-green-200">
        <div className="mb-6">
          <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Success!</h2>
          <p className="text-green-700">
            Your leave request has been submitted successfully and is now pending approval.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onGoToHistory}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaHistory className="mr-2" />
            View History
          </button>

          <button
            onClick={onGoBack}
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationScreen;