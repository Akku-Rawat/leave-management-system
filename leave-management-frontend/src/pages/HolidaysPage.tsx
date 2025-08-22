// src/pages/HolidaysPage.tsx
import React from "react";
import Layout from "../components/Layout";

type Holiday = {
  dateISO: string;
  name: string;
};

// In a real app you would fetch these from your backend
const ALL_HOLIDAYS: Holiday[] = [
  { dateISO: "2023-08-15", name: "Independence Day" },
  { dateISO: "2023-10-02", name: "Gandhi Jayanti" },
  { dateISO: "2023-10-24", name: "Dussehra" },
  { dateISO: "2023-11-12", name: "Diwali" },
  { dateISO: "2023-12-25", name: "Christmas" },
];

function monthDayWeekday(dateISO: string) {
  const d = new Date(dateISO);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  const weekday = d.toLocaleString("en-US", { weekday: "long" });
  return { month, day, weekday };
}

const HolidaysPage: React.FC = () => {
  const items = ALL_HOLIDAYS.slice().sort(
    (a, b) => +new Date(a.dateISO) - +new Date(b.dateISO)
  );

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Holidays</h1>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <ul className="divide-y divide-gray-100">
            {items.map((h) => {
              const { month, day, weekday } = monthDayWeekday(h.dateISO);
              return (
                <li key={h.dateISO} className="py-4 flex items-center gap-4">
                  {/* date pill */}
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-1 rounded-md">
                      {month}
                    </span>
                    <span className="text-lg font-bold text-sky-700">{day}</span>
                  </div>

                  {/* name + weekday */}
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium">{h.name}</div>
                    <div className="text-sm text-gray-500">{weekday}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default HolidaysPage;
