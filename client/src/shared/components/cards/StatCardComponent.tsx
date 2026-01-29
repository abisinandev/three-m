import type { ReactNode } from "react";

type ColorVariant = 
  | 'emerald' 
  | 'rose' 
  | 'red' 
  | 'blue' 
  | 'indigo' 
  | 'amber' 
  | 'yellow' 
  | 'purple' 
  | 'teal' 
  | 'gray' 
  | 'zinc' 
  | 'neutral';

type SizeVariant = 'sm' | 'md' | 'lg';

interface StatsCardProps {
  title: string;
  value: string | number;
  formattedValue?: string;
  prefix?: string;
  suffix?: string;
  icon?: ReactNode;
  color?: ColorVariant;
  subtitle?: string;
  size?: SizeVariant;
  className?: string;
  valueClassName?: string;
  showIconBg?: boolean;
}

export const StatsCardComponent = ({
  title,
  value,
  formattedValue,
  prefix = '',
  suffix = '',
  icon,
  color = 'gray',
  subtitle,
  size = 'md',
  className = '',
  valueClassName = '',
  showIconBg = true,
}: StatsCardProps) => {
  const colorMap: Record<ColorVariant, string> = {
    emerald: 'text-emerald-400 bg-emerald-950/30',
    rose:    'text-rose-500 bg-rose-950/30',
    red:     'text-red-400 bg-red-950/30',
    blue:    'text-blue-400 bg-blue-950/30',
    indigo:  'text-indigo-400 bg-indigo-950/30',
    amber:   'text-amber-400 bg-amber-950/30',
    yellow:  'text-yellow-400 bg-yellow-950/30',
    purple:  'text-purple-400 bg-purple-950/30',
    teal:    'text-teal-400 bg-teal-950/30',
    gray:    'text-gray-400 bg-gray-800/30',
    zinc:    'text-zinc-400 bg-zinc-800/30',
    neutral: 'text-neutral-400 bg-neutral-800/30',
  };

  const selected = colorMap[color] || colorMap.gray;
  const [textColor, bgColor] = selected.split(' ');

  const sizeStyles: Record<SizeVariant, {
    container: string;
    title: string;
    value: string;
    subtitle: string;
    icon: string;
  }> = {
    sm: {
      container: 'p-3',
      title: 'text-xs',
      value: 'text-xl',
      subtitle: 'text-xs',
      icon: 'w-8 h-8',
    },
    md: {
      container: 'p-4',
      title: 'text-xs',
      value: 'text-2xl',
      subtitle: 'text-xs',
      icon: 'w-10 h-10',
    },
    lg: {
      container: 'p-5',
      title: 'text-sm',
      value: 'text-3xl',
      subtitle: 'text-sm',
      icon: 'w-12 h-12',
    },
  };

  const styles = sizeStyles[size];

  const displayValue =
    formattedValue !== undefined
      ? formattedValue
      : typeof value === 'number'
        ? value.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })
        : value;

  return (
    <div
      className={`
        bg-[#111111] border border-neutral-800 rounded-lg
        ${styles.container}
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className={`${styles.title} text-gray-500 font-medium truncate`}>
            {title}
          </p>
          <p className={`
            ${styles.value} font-bold mt-1
            ${valueClassName || textColor}
          `}>
            {prefix}
            {displayValue}
            {suffix}
          </p>
        </div>

        {icon && (
          <div
            className={`
              ${styles.icon}
              rounded-lg flex items-center justify-center flex-shrink-0
              ${showIconBg ? bgColor : 'bg-transparent'}
            `}
          >
            {icon}
          </div>
        )}
      </div>

      {subtitle && (
        <p className={`
          ${styles.subtitle} mt-2
          ${textColor}
        `}>
          {subtitle}
        </p>
      )}
    </div>
  );
};