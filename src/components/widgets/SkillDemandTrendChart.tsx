import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import { DataBadge } from '../common/DataBadge';

interface SkillDemandTrendProps {
  trendData?: {
    label: string;
    isDemoData: boolean;
    description?: string;
    data: Array<{
      period: string;
      Docker: number;
      AWS: number;
      Kubernetes: number;
      Python: number;
      Linux: number;
    }>;
  };
}

export const SkillDemandTrendChart: React.FC<SkillDemandTrendProps> = ({ trendData }) => {
  const defaultData = [
    { period: '2025 Q1', Docker: 64, AWS: 72, Kubernetes: 46, Python: 82, Linux: 75 },
    { period: '2025 Q2', Docker: 69, AWS: 76, Kubernetes: 51, Python: 84, Linux: 78 },
    { period: '2025 Q3', Docker: 74, AWS: 80, Kubernetes: 56, Python: 87, Linux: 80 },
    { period: '2025 Q4', Docker: 78, AWS: 84, Kubernetes: 61, Python: 89, Linux: 82 },
    { period: '2026 Q1', Docker: 82, AWS: 88, Kubernetes: 66, Python: 91, Linux: 85 },
  ];

  const chartData = trendData?.data || defaultData;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              SKILL DEMAND TREND
            </h3>
            <DataBadge type="DEMO DATA" label="Illustrative Demo Data" size="sm" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quarterly demand intensity trajectory for core cloud &amp; infrastructure competencies.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Hiring Demand Index (0-100)</span>
        </div>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="period"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[30, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                color: '#fff',
                borderRadius: '0.5rem',
                fontSize: '11px',
                padding: '8px 12px',
              }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="AWS"
              stroke="#4f46e5"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#4f46e5' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Docker"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#06b6d4' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Python"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey="Linux"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f59e0b' }}
            />
            <Line
              type="monotone"
              dataKey="Kubernetes"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#8b5cf6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>Illustrative Demo Data: Does not imply live labour-market data</span>
        <span className="font-mono">Rolling Index</span>
      </div>
    </div>
  );
};
