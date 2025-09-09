import React from 'react';

interface Step {
  id: number;
  label: string;
  completed?: boolean;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const StepProgress: React.FC<StepProgressProps> = ({ 
  steps, 
  currentStep, 
  className = "" 
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center space-x-4">
        {steps.map((step) => (
          <div key={step.id} className="flex-1">
            <div className={`h-2 rounded-full transition-colors duration-200 ${
              step.id <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
            <p className={`text-xs mt-1 transition-colors duration-200 ${
              step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
