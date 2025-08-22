import React, { useState, useMemo } from "react";
import clsx from "clsx";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function toISO(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const SimpleCalendar: React.FC = () => {
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [selected, setSelected] = useState<string | null>(null);
  const todayISO = toISO(new Date());

  const { monthLabel, days } = useMemo(() => {
    const year = current.getFullYear();
    const month = current.getMonth();

    const monthLabel = current.toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });

    const startOfMonth = new Date(year, month, 1);
    const startWeekday = (startOfMonth.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: { date: Date; inMonth: boolean }[] = [];

    // leading days
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ date: new Date(year, month, i - startWeekday + 1), inMonth: false });
    }

    // month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), inMonth: true });
    }

    // trailing days → ensure 6 rows
    while (cells.length < 42) {
      cells.push({
        date: new Date(year, month, daysInMonth + (cells.length - startWeekday) + 1),
        inMonth: false,
      });
    }

    return { monthLabel, days: cells };
  }, [current]);

  return (
    <div className="bg-white rounded-2xl shadow p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() =>
            setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))
          }
          className="text-gray-500 hover:text-gray-700"
        >
          ‹
        </button>
        <div className="font-semibold text-gray-800">{monthLabel}</div>
        <button
          onClick={() =>
            setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))
          }
          className="text-gray-500 hover:text-gray-700"
        >
          ›
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-xs font-medium text-gray-400 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center">
            {w}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-2 text-sm flex-1">
        {days.map(({ date, inMonth }, i) => {
          const iso = toISO(date);
          const isToday = iso === todayISO;
          const isSelected = iso === selected;

          return (
            <div
              key={i}
              onClick={() => inMonth && setSelected(iso)}
              className={clsx(
                "h-8 w-8 flex items-center justify-center rounded-full cursor-pointer select-none mx-auto transition",
                inMonth ? "text-gray-800" : "text-gray-300",
                isToday && !isSelected && "border border-blue-400",
                isSelected && "bg-blue-500 text-white"
              )}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleCalendar;
