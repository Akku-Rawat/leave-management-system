import React from "react";

type Props = {
  onApply: () => void;
  className?: string;
};

const ApplyForLeaveCard: React.FC<Props> = ({ onApply, className }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-4 md:p-5 flex items-center justify-between ${className ?? ""}`}
    >
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gray-800">
          Need time off?
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Submit your request and get approval from your manager.
        </p>

        <button
          onClick={onApply}
          className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          <span className="text-lg leading-none">＋</span>
          Apply for Leave
        </button>
      </div>

      {/* small decorative tile */}
      <div className="hidden sm:flex w-24 h-20 md:w-28 md:h-24 rounded-2xl bg-indigo-50 items-center justify-center">
        <span className="text-2xl">📅</span>
      </div>
    </div>
  );
};

export default ApplyForLeaveCard;
