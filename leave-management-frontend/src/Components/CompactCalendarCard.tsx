import React, { useState, useMemo } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toISO(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

interface CalendarEvent {
  date: string;
  label: string;
  status: "approved" | "pending" | "holiday";
}

interface CalendarProps {
  events: CalendarEvent[];
}

const SimpleCalendar: React.FC<CalendarProps> = ({ events }) => {
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [selected, setSelected] = useState<string | null>(null);
  const todayISO = toISO(new Date());

  const eventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  const { monthLabel, days } = useMemo(() => {
    const year = current.getFullYear();
    const month = current.getMonth();

    const monthLabel = current.toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });

    const startOfMonth = new Date(year, month, 1);
    const startWeekday = startOfMonth.getDay(); // Sun = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: { date: Date; inMonth: boolean }[] = [];

    // Find the first visible day (Sunday of the first week)
    const firstVisible = new Date(startOfMonth);
    firstVisible.setDate(firstVisible.getDate() - startWeekday);

    // Always fill 42 cells (6 weeks)
    for (let i = 0; i < 42; i++) {
      const d = new Date(firstVisible);
      d.setDate(firstVisible.getDate() + i);
      cells.push({
        date: d,
        inMonth: d.getMonth() === month,
      });
    }

    return { monthLabel, days: cells };
  }, [current]);

  const getEventColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#10b981";
      case "pending":
        return "#3b82f6";
      case "holiday":
        return "#9333ea";
      default:
        return "#d1d5db";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() =>
            setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))
          }
          className="p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <div className="text-base font-semibold text-gray-800">{monthLabel}</div>
        <button
          onClick={() =>
            setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))
          }
          className="p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-[11px] font-semibold text-gray-500 mb-2">
        {WEEKDAYS.map((w, idx) => (
          <div
            key={w}
            className={clsx(
              "text-center",
              (idx === 0 || idx === 6) && "text-red-400" // highlight weekends
            )}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1 text-xs">
        {days.map(({ date, inMonth }, i) => {
          const iso = toISO(date);
          const isToday = iso === todayISO;
          const isSelected = iso === selected;
          const eventsForDay = eventMap[iso] || [];

          return (
            <div
              key={i}
              onClick={() => inMonth && setSelected(iso)}
              className={clsx(
                "relative h-8 w-8 flex flex-col items-center justify-center cursor-pointer select-none mx-auto transition rounded-full",
                inMonth ? "text-gray-800" : "text-gray-300",
                isToday && "ring-2 ring-blue-400 ring-offset-1",
                isSelected && "bg-blue-500 text-white",
                inMonth && "hover:bg-gray-100"
              )}
            >
              <span className="leading-none">{date.getDate()}</span>
              {/* Event dots */}
              <div className="flex gap-0.5 mt-0.5">
                {eventsForDay.slice(0, 2).map((e, idx) => (
                  <span
                    key={idx}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: getEventColor(e.status) }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-5 mt-4 text-[11px] text-gray-600">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#10b981" }} />
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#3b82f6" }} />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#9333ea" }} />
          <span>Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleCalendar;
