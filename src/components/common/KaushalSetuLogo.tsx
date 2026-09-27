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

  // The primary KaushalSetu SVG Emblem:
  // Represents a futuristic digital bridge ("Setu") linking Education/Curriculum & Industry Demand,
  // crowned with the golden apex star of "Kaushal" (Excellence & Skill).
  const renderSvgMark = () => (
    <svg
      width={currentSize.box}
      height={currentSize.box}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm transition-transform duration-200 hover:scale-105"
      role="img"
      aria-label="SkillSetu Logo"
    >
      <defs>
        {/* Main bridge arch gradient: Indigo to Cyan */}
        <linearGradient id="ksArchGrad" x1="10" y1="80" x2="90" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Lower support suspension gradient */}
        <linearGradient id="ksBaseGrad" x1="15" y1="85" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Golden skill intelligence spark */}
        <linearGradient id="ksGoldGrad" x1="40" y1="15" x2="60" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Outer squircle backdrop gradient */}
        <linearGradient id="ksBgGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        {/* Subtle glow filter */}
        <filter id="ksGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded container with subtle inner border */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="22"
        fill="url(#ksBgGradient)"
        stroke="#334155"
        strokeWidth="2"
      />

      {/* Futuristic digital grid dots in background */}
      <circle cx="28" cy="32" r="1.5" fill="#475569" opacity="0.6" />
      <circle cx="50" cy="24" r="1.5" fill="#475569" opacity="0.6" />
      <circle cx="72" cy="32" r="1.5" fill="#475569" opacity="0.6" />
      <circle cx="36" cy="46" r="1.2" fill="#475569" opacity="0.4" />
      <circle cx="64" cy="46" r="1.2" fill="#475569" opacity="0.4" />

      {/* Bridge Deck Base / Connection Platform */}
      <path
        d="M 18 72 L 82 72"
        stroke="url(#ksBaseGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 22 78 L 78 78"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 3"
        opacity="0.8"
      />

      {/* Vertical Data Cables / Tensile Pillars connecting Deck to Arch */}
      <line x1="32" y1="72" x2="32" y2="52" stroke="#60A5FA" strokeWidth="1.5" opacity="0.75" />
      <line x1="42" y1="72" x2="42" y2="40" stroke="#818CF8" strokeWidth="1.8" opacity="0.85" />
      <line x1="50" y1="72" x2="50" y2="35" stroke="#A78BFA" strokeWidth="2" opacity="0.9" />
      <line x1="58" y1="72" x2="58" y2="40" stroke="#818CF8" strokeWidth="1.8" opacity="0.85" />
      <line x1="68" y1="72" x2="68" y2="52" stroke="#60A5FA" strokeWidth="1.5" opacity="0.75" />

      {/* The Dynamic Bridge Arch (Setu) */}
      <path
        d="M 18 72 Q 50 26 82 72"
        fill="none"
        stroke="url(#ksArchGrad)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Secondary Upper Harmonic Arc (Skill Flow Energy) */}
      <path
        d="M 26 62 Q 50 32 74 62"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Foundation Pillars / Nodes (Education on Left, Industry on Right) */}
      <circle cx="18" cy="72" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="82" cy="72" r="5" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="1.5" />

      {/* Intermediate Telemetry Nodes */}
      <circle cx="32" cy="52" r="3" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1" />
      <circle cx="68" cy="52" r="3" fill="#0EA5E9" stroke="#BAE6FD" strokeWidth="1" />

      {/* Central Keystone / Golden Apex Diamond ("Kaushal" - Skill Enlightenment) */}
      <g transform="translate(50, 31)">
        <polygon
          points="0,-8 7,0 0,8 -7,0"
          fill="url(#ksGoldGrad)"
          stroke="#FEF08A"
          strokeWidth="1.2"
        />
        <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderSvgMark()}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 shadow-md ${className}`}
      >
        {renderSvgMark()}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white tracking-tight text-sm">SkillSetu</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SIH26134
            </span>
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
        {renderSvgMark()}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold text-white tracking-tight ${currentSize.font}`}>
              Skill<span className="text-cyan-400">Setu</span>
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/10">
              SIH26134
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
      {renderSvgMark()}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span className={`font-extrabold text-slate-900 tracking-tight ${currentSize.font}`}>
            Skill<span className="text-indigo-600">Setu</span>
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            SIH26134
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
