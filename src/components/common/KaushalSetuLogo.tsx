import React from 'react';

export interface KaushalSetuLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'horizontal' | 'badge' | 'inverted-horizontal';
  className?: string;
  showSubtitle?: boolean;
}

export const KaushalSetuLogo: React.FC<KaushalSetuLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
  showSubtitle = true,
}) => {
  // Dimensions map for the icon
  const sizeMap = {
    sm: { box: 32, icon: 24, font: 'text-base', sub: 'text-[10px]' },
    md: { box: 40, icon: 30, font: 'text-lg', sub: 'text-xs' },
    lg: { box: 48, icon: 36, font: 'text-xl', sub: 'text-xs' },
    xl: { box: 64, icon: 48, font: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  const renderLogoMark = () => (
    <img
      src="/logo.png"
      alt="SkillSetu Logo"
      width={currentSize.box}
      height={currentSize.box}
      className="shrink-0 object-contain rounded-lg drop-shadow-xs transition-transform duration-200 hover:scale-105 bg-white p-0.5"
      style={{ width: `${currentSize.box}px`, height: `${currentSize.box}px` }}
    />
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderLogoMark()}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 shadow-md ${className}`}
      >
        {renderLogoMark()}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white tracking-tight text-sm">SkillSetu</span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] text-slate-400 font-medium">National Skill Intelligence Bridge</span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'inverted-horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {renderLogoMark()}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold text-white tracking-tight ${currentSize.font}`}>
              Skill<span className="text-emerald-400">Setu</span>
            </span>
          </div>
          {showSubtitle && (
            <span className={`text-slate-300 font-medium tracking-tight ${currentSize.sub}`}>
              National Skill Intelligence Bridge
            </span>
          )}
        </div>
      </div>
    );
  }

  // Standard horizontal variant (for light backgrounds like the top header)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {renderLogoMark()}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span className={`font-extrabold text-slate-900 tracking-tight ${currentSize.font}`}>
            Skill<span className="text-emerald-600">Setu</span>
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-slate-500 font-medium tracking-tight ${currentSize.sub} hidden sm:block`}>
            AI Industry Demand &amp; Skill Intelligence Platform
          </span>
        )}
      </div>
    </div>
  );
};

export const SkillSetuLogo = KaushalSetuLogo;
export type SkillSetuLogoProps = KaushalSetuLogoProps;
