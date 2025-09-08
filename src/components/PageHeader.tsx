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
    const baseClasses = "px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors";
    const className = action.className || "bg-secondary hover:bg-secondary-dark text-white";
    const finalClasses = `${baseClasses} ${className}`;

    const content = (
      <>
        {action.icon && <action.icon className="w-5 h-5" />}
        <span>{action.text}</span>
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
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions.length > 0 && (
        <div className="flex space-x-3">
          {actions.map(renderAction)}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
