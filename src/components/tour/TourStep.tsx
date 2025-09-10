import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  XMarkIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';
import type { TourStep as TourStepType } from '../../types';

interface TourStepProps {
  step: TourStepType;
  elementRect: DOMRect;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev?: () => void;
  onSkip: () => void;
  isLastStep: boolean;
}

const TourStep: React.FC<TourStepProps> = ({
  step,
  elementRect,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  isLastStep,
}) => {
  const getTooltipPosition = () => {
    const tooltipWidth = 320;
    const tooltipHeight = 250;
    const margin = 16;
    const arrowSize = 12;

    let left = 0;
    let top = 0;
    let actualPosition = step.position;

    switch (step.position) {
      case 'top':
        left = elementRect.left + elementRect.width / 2 - tooltipWidth / 2;
        top = elementRect.top - tooltipHeight - margin - arrowSize;
        break;
      case 'bottom':
        left = elementRect.left + elementRect.width / 2 - tooltipWidth / 2;
        top = elementRect.bottom + margin + arrowSize;
        break;
      case 'left':
        left = elementRect.left - tooltipWidth - margin - arrowSize;
        top = elementRect.top + elementRect.height / 2 - tooltipHeight / 2;
        break;
      case 'right':
        left = elementRect.right + margin + arrowSize;
        top = elementRect.top + elementRect.height / 2 - tooltipHeight / 2;
        break;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < margin) {
      left = margin;
      if (step.position === 'left') actualPosition = 'right';
    }
    if (left + tooltipWidth > viewportWidth - margin) {
      left = viewportWidth - tooltipWidth - margin;
      if (step.position === 'right') actualPosition = 'left';
    }
    if (top < margin) {
      top = margin;
      if (step.position === 'top') actualPosition = 'bottom';
    }
    if (top + tooltipHeight > viewportHeight - margin) {
      top = viewportHeight - tooltipHeight - margin;
      if (step.position === 'bottom') actualPosition = 'top';
    }

    return { left, top, actualPosition };
  };

  const { left, top } = getTooltipPosition();


  const getActionText = () => {
    switch (step.action) {
      case 'click':
        return 'Clique aqui';
      case 'input':
        return 'Digite aqui';
      case 'navigate':
        return 'Navegue para';
      default:
        return 'Observe';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute z-52 pointer-events-auto"
      style={{ left, top }}
    >
      <div className="bg-white rounded-lg shadow-2xl border max-w-sm">
        <div className="bg-secondary p-4 rounded-t-lg text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <h3 className="font-semibold text-sm">{step.title}</h3>
                <p className="text-xs opacity-90">
                  Passo {currentStep} de {totalSteps}
                </p>
              </div>
            </div>
            <button
              onClick={onSkip}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-blue-600">
                {getActionText()}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {onPrev && (
                <button
                  onClick={onPrev}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={onSkip}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Pular tour
              </button>
              
              <button
                onClick={onNext}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {isLastStep ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Finalizar</span>
                  </>
                ) : (
                  <>
                    <span>Próximo</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TourStep;
