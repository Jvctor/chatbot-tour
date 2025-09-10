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

  // Encontra e destaca o elemento do passo atual
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
        
        // Aguarda um frame para garantir que o elemento está renderizado
        requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          setElementRect(rect);
          
          // Scroll para o elemento de forma mais suave
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        });
      } else {
        // Se não encontrar, tenta novamente após delay maior
        setTimeout(findElement, 1000);
      }
    };

    // Tenta encontrar o elemento imediatamente
    findElement();
  }, [step, isActive]);

  // Atualiza posição do elemento quando a janela redimensiona
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
      // Se for uma ação de clique, executa o clique automaticamente
      try {
        (highlightedElement as HTMLElement).click();
        
        // Aguarda um pouco mais antes de ir para o próximo passo
        setTimeout(() => {
          nextStep();
        }, 1000);
      } catch (error) {
        console.warn('Erro ao clicar no elemento:', error);
        nextStep();
      }
    } else if (step.action === 'navigate') {
      // Para navegação, aguarda mais tempo para a página carregar
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
        style={{ pointerEvents: 'auto' }}
      >
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-75"
          onClick={endTour}
          style={{ zIndex: 50 }}
        />

        {/* Clickable area over highlighted element */}
        {elementRect && (
          <div
            className="absolute cursor-pointer"
            style={{
              left: elementRect.left - 8,
              top: elementRect.top - 8,
              width: elementRect.width + 16,
              height: elementRect.height + 16,
              zIndex: 52,
              background: 'transparent',
            }}
            onClick={handleNext}
            title="Clique aqui para continuar"
          />
        )}

        {/* Spotlight */}
        {elementRect && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute"
            style={{
              left: elementRect.left - 8,
              top: elementRect.top - 8,
              width: elementRect.width + 16,
              height: elementRect.height + 16,
              background: 'transparent',
              borderRadius: '8px',
              border: '3px solid #3B82F6',
              boxShadow: `
                0 0 0 4px rgba(59, 130, 246, 0.3),
                0 0 0 9999px rgba(0, 0, 0, 0.75)
              `,
              zIndex: 51,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Tour Step Component */}
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
