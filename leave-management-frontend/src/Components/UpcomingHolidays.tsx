// src/components/UpcomingHolidays.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Sparkles } from "lucide-react";

export type Holiday = {
  dateISO: string;
  name: string;
  weekday: string;
};

const HOLIDAYS: Holiday[] = [
  { dateISO: "2023-08-15", name: "Independence Day", weekday: "Tuesday" },
  { dateISO: "2023-10-02", name: "Gandhi Jayanti", weekday: "Monday" },
  { dateISO: "2023-10-24", name: "Dussehra", weekday: "Tuesday" },
  { dateISO: "2023-11-12", name: "Diwali", weekday: "Sunday" },
];

function monthDay(dateISO: string) {
  const d = new Date(dateISO);
  return {
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0"),
  };
}

interface UpcomingHolidaysProps {
  items?: Holiday[];
  className?: string;
}

const UpcomingHolidays: React.FC<UpcomingHolidaysProps> = ({ items, className }) => {
  const source = items ?? HOLIDAYS;

  // Only future holidays
  const today = new Date();
  const upcoming = source
    .filter((h) => new Date(h.dateISO) >= today)
    .sort((a, b) => +new Date(a.dateISO) - +new Date(b.dateISO))
    .slice(0, 3);

  return (
    <div className={`bg-white rounded-2xl shadow p-5 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          Upcoming Holidays
        </h3>
        <Link
          to="/holidays"
          className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
        >
          View All →
        </Link>
      </div>

      {/* List */}
      <ul className="space-y-3">
        {upcoming.map((h, idx) => {
          const { month, day } = monthDay(h.dateISO);
          const isNext = idx === 0; // highlight first
          return (
            <li
              key={h.dateISO}
              className={`flex items-center justify-between p-3 rounded-xl ${
                isNext ? "bg-purple-50 border border-purple-100" : "hover:bg-gray-50"
              } transition`}
            >
              {/* Left: date + details */}
              <div className="flex items-center gap-4">
                {/* Date badge */}
                <div className="flex flex-col items-center w-12 shrink-0">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      isNext
                        ? "text-white bg-purple-600"
                        : "text-purple-700 bg-purple-100"
                    }`}
                  >
                    {month}
                  </span>
                  <span className="text-lg font-bold text-gray-900 leading-none mt-1">
                    {day}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <span
                    className={`block font-medium ${
                      isNext ? "text-purple-900" : "text-gray-900"
                    }`}
                  >
                    {h.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {h.weekday}
                  </span>
                </div>
              </div>

              {/* Right: Consistent icon */}
              <Sparkles className="h-4 w-4 text-purple-500" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UpcomingHolidays;
