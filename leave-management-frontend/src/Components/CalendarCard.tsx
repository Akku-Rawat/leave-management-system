import React, { useMemo, useState } from "react";

type CalendarEvent = {
  date: string;                  // yyyy-mm-dd
  label?: string;                // tooltip text
  status?: "approved" | "pending";
};

type CalendarCardProps = {
  /** Accepts string[] OR CalendarEvent[] */
  events?: Array<string | CalendarEvent>;
  className?: string;
};

function toISO(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarCard: React.FC<CalendarCardProps> = ({ events = [], className }) => {
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const todayISO = toISO(new Date());

  const { monthLabel, gridDays } = useMemo(() => {
    const year = current.getFullYear();
    const month = current.getMonth();

    const monthLabel = current.toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });

    const startOfMonth = new Date(year, month, 1);
    const startWeekday = startOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { date: Date; inCurrentMonth: boolean }[] = [];

    for (let i = startWeekday; i > 0; i--) {
      days.push({ date: new Date(year, month, 1 - i), inCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: new Date(year, month, d), inCurrentMonth: true });
    }
    while (days.length < 42) {
      const nextIndex = days.length - (startWeekday + daysInMonth) + 1;
      days.push({ date: new Date(year, month + 1, nextIndex), inCurrentMonth: false });
    }
    return { monthLabel, gridDays: days };
  }, [current]);

  // Normalize events ⇒ Map(iso -> CalendarEvent)
  const eventsMap = useMemo(() => {
    const map = new Map<string, CalendarEvent>();
    for (const e of events) {
      if (typeof e === "string") {
        map.set(e, { date: e });
      } else if (e?.date) {
        map.set(e.date, e);
      }
    }
    return map;
  }, [events]);

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-5 flex flex-col ${className ?? ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Calendar</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            className="px-2 py-1 rounded-md border text-sm hover:bg-gray-50"
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="text-sm font-medium text-gray-700 w-36 text-center">{monthLabel}</div>
          <button
            type="button"
            onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            className="px-2 py-1 rounded-md border text-sm hover:bg-gray-50"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2 text-center">
            {w}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {gridDays.map(({ date, inCurrentMonth }, i) => {
          const iso = toISO(date);
          const isToday = iso === todayISO;
          const ev = eventsMap.get(iso);

          const dot =
            ev?.status === "approved"
              ? "bg-emerald-500"
              : ev?.status === "pending"
              ? "bg-amber-500"
              : "bg-blue-500";

          return (
            <div
              key={i}
              className={[
                "aspect-square rounded-lg flex items-center justify-center relative select-none",
                inCurrentMonth ? "bg-gray-50" : "bg-gray-50/40",
                "hover:bg-blue-50 transition",
                isToday ? "ring-1 ring-blue-400" : "",
              ].join(" ")}
              title={ev?.label ? `${iso}: ${ev.label}` : iso}
              aria-label={ev?.label ? `${iso}: ${ev.label}` : iso}
            >
              <span className={inCurrentMonth ? "text-gray-800 text-sm" : "text-gray-400 text-sm"}>
                {date.getDate()}
              </span>

              {/* colored event dot */}
              {ev && <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${dot}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarCard;
