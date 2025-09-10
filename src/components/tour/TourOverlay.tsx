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

  const waitForNextStepElement = (selector: string, timeout = 7000) => {
    return new Promise<void>((resolve) => {
      const start = Date.now();
      function check() {
        const el = document.querySelector(selector);
        if (el && (el as HTMLElement).offsetParent !== null) {
          resolve();
        } else if (Date.now() - start > timeout) {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      }
      check();
    });
  };

  const handleNext = async () => {
    if (step.action === 'click' && highlightedElement) {
      try {
        (highlightedElement as HTMLElement).click();
        // Aguarda o elemento do próximo passo aparecer antes de avançar
        const nextStepObj = activeTour?.steps[currentStep + 1];
        if (nextStepObj && nextStepObj.selector) {
          await waitForNextStepElement(nextStepObj.selector);
        } else {
          await new Promise(res => setTimeout(res, 700));
        }
        nextStep();
      } catch (error) {
        console.warn('Erro ao clicar no elemento:', error);
        nextStep();
      }
    } else if (step.action === 'navigate') {
      // Aguarda o elemento do próximo passo aparecer antes de avançar
      const nextStepObj = activeTour?.steps[currentStep + 1];
      if (nextStepObj && nextStepObj.selector) {
        await waitForNextStepElement(nextStepObj.selector);
      } else {
        await new Promise(res => setTimeout(res, 1500));
      }
      nextStep();
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
              className="absolute"
              style={{
                background: 'rgba(0,0,0,0.20)',
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
              className="absolute"
              style={{
                background: 'rgba(0,0,0,0.20)',
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
              className="absolute"
              style={{
                background: 'rgba(0,0,0,0.20)',
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
              className="absolute"
              style={{
                background: 'rgba(0,0,0,0.20)',
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
            className="absolute inset-0"
            onClick={endTour}
            style={{ background: 'rgba(0,0,0,0.20)', zIndex: 51, pointerEvents: 'auto' }}
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
