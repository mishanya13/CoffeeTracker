import React from 'react';

interface BadgeProps {
  icon?: React.ReactNode;
  label?: string;
  variant?: 'brown' | 'light' | 'small';
}

const Badge: React.FC<BadgeProps> = ({ icon, label, variant = 'brown' }) => {
  const sizeClasses = variant === 'small' ? 'w-12 h-12 text-sm' : 'w-16 h-16 text-base';
  const colorClasses =
    variant === 'light'
      ? 'bg-cream-300 text-coffee-800'
      : 'bg-coffee-600 text-white';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`inline-flex items-center justify-center ${sizeClasses} ${colorClasses} rounded-full shadow-md`}
      >
        {icon}
      </div>
      {label && <span className="text-sm text-coffee-800 font-medium">{label}</span>}
    </div>
  );
};

export default Badge;
