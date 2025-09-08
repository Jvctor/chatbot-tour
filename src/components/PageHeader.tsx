import React from 'react';
import { Link } from 'react-router-dom';

interface ActionButton {
  type: 'button' | 'link';
  text: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  to?: string;
  className?: string;
  testId?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  actions?: ActionButton[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions = []
}) => {
  const renderAction = (action: ActionButton, index: number) => {
    const baseClasses = "px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base w-full sm:w-auto";
    const className = action.className || "bg-secondary hover:bg-secondary-dark text-white";
    const finalClasses = `${baseClasses} ${className}`;

    const content = (
      <>
        {action.icon && <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />}
        <span className="truncate">{action.text}</span>
      </>
    );

    if (action.type === 'link' && action.to) {
      return (
        <Link
          key={index}
          to={action.to}
          data-testid={action.testId}
          className={finalClasses}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={index}
        onClick={action.onClick}
        data-testid={action.testId}
        className={finalClasses}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary break-words">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 mt-1 text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
          {actions.map(renderAction)}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
