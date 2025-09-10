import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTourStore } from '../../stores/tourStore';
import TourStep from './TourStep';

const TourOverlay: React.FC = () => {
  const { 
    activeTour, 
    currentStep, 
    isActive, 
    nextStep, 
    prevStep, 
    endTour,
    getCurrentStep 
  } = useTourStore();

  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  const step = getCurrentStep();

  useEffect(() => {
    if (!step || !isActive) {
      setHighlightedElement(null);
      setElementRect(null);
      return;
    }

    const findElement = () => {
      const element = document.querySelector(step.selector);
      if (element) {
        setHighlightedElement(element);
        
        requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          setElementRect(rect);
          
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        });
      } else {
        setTimeout(findElement, 1000);
      }
    };

    findElement();
  }, [step, isActive]);

  useEffect(() => {
    const updateElementRect = () => {
      if (highlightedElement) {
        setElementRect(highlightedElement.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', updateElementRect);
    window.addEventListener('scroll', updateElementRect);

    return () => {
      window.removeEventListener('resize', updateElementRect);
      window.removeEventListener('scroll', updateElementRect);
    };
  }, [highlightedElement]);

  if (!isActive || !activeTour || !step) {
    return null;
  }

  const handleNext = () => {
    if (step.action === 'click' && highlightedElement) {
      try {
        (highlightedElement as HTMLElement).click();
        
        setTimeout(() => {
          nextStep();
        }, 1000);
      } catch (error) {
        console.warn('Erro ao clicar no elemento:', error);
        nextStep();
      }
    } else if (step.action === 'navigate') {
      setTimeout(() => {
        nextStep();
      }, 1500);
    } else {
      nextStep();
    }
  };

  const canGoPrev = currentStep > 0;
  const isLastStep = currentStep === activeTour.steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ pointerEvents: 'none' }}
      >
        {elementRect ? (
          <>
            <div 
              className="absolute bg-black bg-opacity-20"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: elementRect.top - 4,
                zIndex: 51,
                pointerEvents: 'auto'
              }}
              onClick={endTour}
            />
            
            <div 
              className="absolute bg-black bg-opacity-20"
              style={{
                top: elementRect.bottom + 4,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 51,
                pointerEvents: 'auto'
              }}
              onClick={endTour}
            />
            
            {/* Left overlay */}
            <div 
              className="absolute bg-black bg-opacity-20"
              style={{
                top: elementRect.top - 4,
                left: 0,
                width: elementRect.left - 4,
                height: elementRect.height + 8,
                zIndex: 51,
                pointerEvents: 'auto'
              }}
              onClick={endTour}
            />
            
            <div 
              className="absolute bg-black bg-opacity-20"
              style={{
                top: elementRect.top - 4,
                left: elementRect.right + 4,
                right: 0,
                height: elementRect.height + 8,
                zIndex: 51,
                pointerEvents: 'auto'
              }}
              onClick={endTour}
            />
          </>
        ) : (
          <div 
            className="absolute inset-0 bg-black bg-opacity-20"
            onClick={endTour}
            style={{ zIndex: 51, pointerEvents: 'auto' }}
          />
        )}

        {elementRect && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute pointer-events-none"
            style={{
              left: elementRect.left - 4,
              top: elementRect.top - 4,
              width: elementRect.width + 8,
              height: elementRect.height + 8,
              border: '2px solid #3B82F6',
              borderRadius: '8px',
              zIndex: 52,
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
            }}
          />
        )}

        {elementRect && (
          <div
            className="absolute cursor-pointer"
            style={{
              left: elementRect.left,
              top: elementRect.top,
              width: elementRect.width,
              height: elementRect.height,
              zIndex: 53,
              background: 'transparent',
              pointerEvents: 'auto'
            }}
            onClick={handleNext}
            title="Clique aqui para continuar"
          />
        )}

        {elementRect && (
          <TourStep
            step={step}
            elementRect={elementRect}
            currentStep={currentStep + 1}
            totalSteps={activeTour.steps.length}
            onNext={handleNext}
            onPrev={canGoPrev ? prevStep : undefined}
            onSkip={endTour}
            isLastStep={isLastStep}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TourOverlay;
