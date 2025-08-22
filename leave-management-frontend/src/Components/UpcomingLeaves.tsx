import React from "react";
import Card from "./Card";

type Item = { type: string; range: string; days: number; status: "Approved" | "Pending" };

const UpcomingLeaves: React.FC<{ items: Item[]; className?: string }> = ({ items, className }) => {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Leaves</h3>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl bg-blue-50/50 px-4 py-3 flex items-start justify-between">
            <div>
              <div className="font-medium text-gray-900">{it.type}</div>
              <div className="text-xs text-gray-500">{it.range}</div>
              <div className="mt-1 text-xs text-gray-600">📅 {it.days} {it.days > 1 ? "days" : "day"}</div>
            </div>
            <span
              className={
                "text-xs px-2 py-1 rounded-full " +
                (it.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700")
              }
            >
              {it.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UpcomingLeaves;
