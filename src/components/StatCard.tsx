import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`p-3 ${iconBgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
