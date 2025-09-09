import React from 'react';
import { formatCurrency } from '../utils/mask';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  isCurrency = false,
}) => {
  const displayValue = isCurrency && typeof value === 'number' ? formatCurrency(value) : value;
  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-2 sm:p-2.5 md:p-3 ${iconBgColor} rounded-lg flex-shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${iconColor}`} />
        </div>
        <div className="ml-2 sm:ml-3 md:ml-4 min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">{displayValue}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
