import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MonitoredFile, FileStatus } from '../types';

interface StatsChartProps {
  files: MonitoredFile[];
  maxSize: number;
}

const StatsChart: React.FC<StatsChartProps> = ({ files, maxSize }) => {
  const data = files.map(f => ({
    name: f.name.split('.')[0], // Short name
    size: f.sizeMB,
    status: f.status
  }));

  const getBarColor = (entry: any) => {
    if (entry.status === FileStatus.CRITICAL) return '#ef4444'; // Red-500
    if (entry.status === FileStatus.WARNING) return '#f59e0b'; // Amber-500
    return '#10b981'; // Emerald-500
  };

  return (
    <div className="h-64 w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-slate-400 text-sm font-medium mb-4">Size Distribution (MB)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#334155', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
          />
          <Bar dataKey="size" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;