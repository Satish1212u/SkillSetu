import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  dataLabel?: 'REAL' | 'SAMPLE' | 'FORECAST' | 'VERIFIED' | 'DEMO DATA';
  icon?: any;
  onClick?: () => void;
  interactive?: boolean;
  statusColor?: 'default' | 'danger' | 'warning' | 'success';
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  dataLabel,
  icon: Icon,
  onClick,
  interactive,
  statusColor = 'default',
  children,
}) => {
  const isClickable = Boolean(onClick || interactive);

  const statusBorderClass =
    statusColor === 'danger'
      ? 'border-rose-300 hover:border-rose-400 bg-white'
      : statusColor === 'warning'
      ? 'border-amber-300 hover:border-amber-400 bg-white'
      : statusColor === 'success'
      ? 'border-emerald-300 hover:border-emerald-400 bg-white'
      : 'border-slate-200 hover:border-slate-300 bg-white';

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={e => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`border rounded-xl p-5 flex flex-col justify-between transition-all duration-150 ${statusBorderClass} ${
        isClickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 select-none' : ''
      }`}
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <p
              className={`text-2xl font-extrabold mt-1 tracking-tight ${
                statusColor === 'danger' ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {value}
            </p>
          </div>
          {Icon && (
            <div
              className={`p-2 rounded-lg border text-slate-600 ${
                statusColor === 'danger'
                  ? 'bg-rose-50 border-rose-100 text-rose-600'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Custom children (e.g. breakdown checklist, matched explanation) */}
        {children && <div className="mt-2.5">{children}</div>}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-500 font-medium truncate">{subtitle}</span>}
        {change && (
          <span
            className={`font-semibold shrink-0 ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {change}
          </span>
        )}
        {dataLabel && (
          <span className="text-[10px] font-mono text-slate-400 shrink-0">
            [{dataLabel === 'REAL' ? 'VERIFIED' : dataLabel}]
          </span>
        )}
      </div>
    </div>
  );
};
