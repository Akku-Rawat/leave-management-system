// src/components/UpcomingHolidays.tsx
import React from "react";
import { Link } from "react-router-dom";

type Holiday = {
  dateISO: string;       // e.g., "2023-08-15"
  name: string;          // e.g., "Independence Day"
  weekday: string;       // e.g., "Tuesday"
};

// Dummy data (you can later fetch this from an API)
const HOLIDAYS: Holiday[] = [
  { dateISO: "2023-08-15", name: "Independence Day", weekday: "Tuesday" },
  { dateISO: "2023-10-02", name: "Gandhi Jayanti",   weekday: "Monday" },
  { dateISO: "2023-10-24", name: "Dussehra",         weekday: "Tuesday" },
  { dateISO: "2023-11-12", name: "Diwali",           weekday: "Sunday"  },
];

function monthDayPill(dateISO: string) {
  const d = new Date(dateISO);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase(); // AUG
  const day = String(d.getDate()).padStart(2, "0");                           // 15
  return { month, day };
}

const UpcomingHolidays: React.FC<{ className?: string }> = ({ className }) => {
  const items = HOLIDAYS
    .slice() // copy
    .sort((a, b) => +new Date(a.dateISO) - +new Date(b.dateISO))
    .slice(0, 3); // show only first 3 in dashboard card

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Holidays</h3>
        <Link
          to="/holidays"
          className="text-sm font-medium text-sky-600 hover:underline"
        >
          View All
        </Link>
      </div>

      <ul className="space-y-4">
        {items.map((h) => {
          const { month, day } = monthDayPill(h.dateISO);
          return (
            <li key={h.dateISO} className="flex items-start gap-4">
              {/* Date pill */}
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-1 rounded-md">
                  {month}
                </span>
                <span className="text-lg font-bold text-sky-700">{day}</span>
              </div>

              {/* Name + weekday */}
              <div>
                <div className="text-gray-900 font-medium">{h.name}</div>
                <div className="text-xs text-gray-500">{h.weekday}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UpcomingHolidays;
