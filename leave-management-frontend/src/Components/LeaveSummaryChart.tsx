// components/LeaveSummaryChart.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type LeaveSummaryData = {
  category: string;  // e.g., "Casual"
  used: number;
  remaining: number;
  color: string;
};

interface LeaveSummaryChartProps {
  data: LeaveSummaryData[];
  className?: string;
}

export default function LeaveSummaryChart({ data, className }: LeaveSummaryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-5 text-gray-500">
        No leave data available
      </div>
    );
  }

  const chartData = data.flatMap((d) => [
    { category: d.category, type: "Used", value: d.used, color: d.color },
    { category: d.category, type: "Remaining", value: d.remaining, color: "#e5e7eb" },
  ]);

  const totalRemaining = data.reduce((acc, cur) => acc + cur.remaining, 0);

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-5 ${className || ""}`}>
      <h3 className="font-semibold text-gray-800 mb-3">Leave Summary</h3>

      <div className="relative flex justify-center">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              cornerRadius={6}
              labelLine={false}
            >
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} stroke="#fff" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip
              formatter={(_value: number, _name, props: any) => {
                const { category, type, value } = props.payload;
                return [`${type}: ${value}`, category];
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-xs text-gray-500">Total Remaining</p>
          <p className="text-lg font-bold text-gray-800">{totalRemaining}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.category} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-sm text-gray-700">
              {d.category} ({d.used + d.remaining} days)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
