import React from "react";
import { AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Needs", value: 45000, color: "#10B981", percent: "50%" },
  { name: "Wants", value: 28500, color: "#F59E0B", percent: "30%" },
  { name: "Savings", value: 20000, color: "#3B82F6", percent: "20%" },
];

export const BudgetBreakdown: React.FC = () => {
  return (
    <div className="rounded-2xl p-6 border border-cool-white/10 bg-deep-charcoal/40 backdrop-blur-md animate-fade-in shadow-xl hover:border-cool-white/20 transition-all duration-300">
      <h5 className="text-lg font-semibold mb-6 text-cool-white tracking-tight">
        50/30/20 Budget Overview
      </h5>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="w-full sm:w-1/2 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `₹${(value as number).toLocaleString()}`}
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-cool-white">₹93.5k</span>
            <span className="text-xs text-cool-white/60">Spent</span>
          </div>
        </div>

        <div className="w-full sm:w-1/2 space-y-4">
          {data.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center group">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-cool-white/80 group-hover:text-cool-white transition-colors">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold" style={{ color: item.color }}>
                  ₹{item.value.toLocaleString()}
                </div>
                <div className="text-xs text-cool-white/50">{item.percent}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-amber-500 font-medium text-xs leading-relaxed">
          <span className="font-bold">Alert:</span> Wants category is near limit. Consider reducing discretionary spending to stay on track.
        </p>
      </div>
    </div>
  );
};
