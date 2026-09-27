import React from 'react';

export type DataStateType =
  | 'VERIFIED'
  | 'ANALYSED'
  | 'SELF-REPORTED'
  | 'DEMO DATA'
  | 'REAL'
  | 'SAMPLE'
  | 'FORECAST';

interface DataBadgeProps {
  type: DataStateType;
  label?: string;
  size?: 'sm' | 'md';
}

export const DataBadge: React.FC<DataBadgeProps> = ({ type, label, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  if (type === 'VERIFIED' || type === 'REAL') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {label || 'VERIFIED'}
      </span>
    );
  }

  if (type === 'ANALYSED') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        {label || 'ANALYSED'}
      </span>
    );
  }

  if (type === 'SELF-REPORTED') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono rounded font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        {label || 'SELF-REPORTED'}
      </span>
    );
  }

  if (type === 'DEMO DATA' || type === 'SAMPLE') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono rounded font-semibold bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        {label || 'DEMO DATA'}
      </span>
    );
  }

  if (type === 'FORECAST') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono rounded font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        {label || 'MODEL FORECAST'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono rounded font-medium bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      {label || type}
    </span>
  );
};
