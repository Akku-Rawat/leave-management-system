import React from "react";

type Props = {
  title: string;
  remaining: number;
  total: number;
  used: number;
  icon?: React.ReactNode;
  barClass?: string; // Tailwind class for accent color
};

const StatCard: React.FC<Props> = ({ title, remaining, total, used, icon, barClass }) => {
  const pct = Math.min(100, Math.round((used / total) * 100));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Title + Icon */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Remaining Days */}
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-gray-900">{remaining}</span>
        <span className="text-sm text-gray-500">days remaining</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-4">
        <div
          className={`h-full ${barClass ?? "bg-green-600"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Days Available */}
      <p className="text-xs text-gray-500 mt-2">
        {used} of {total} days available
      </p>
    </div>
  );
};

export default StatCard;
