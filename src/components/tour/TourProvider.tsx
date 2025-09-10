import React, { createContext, useContext, useEffect } from 'react';
import { useTourStore } from '../../stores/tourStore';
import { useChatStore } from '../../stores/chatStore';
import TourOverlay from './TourOverlay';

interface TourContextType {
  startTour: (tourId: string) => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextType | null>(null);

export const useTourContext = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: React.ReactNode;
}

const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const { isActive, activeTour, startTour: startStoreTour, endTour } = useTourStore();
  const isChatOpen = useChatStore((state) => state.isOpen);
  const toggleChat = useChatStore((state) => state.toggleChat);

  useEffect(() => {
    if (isActive && isChatOpen) {
      toggleChat();
    }
  }, [isActive, isChatOpen, toggleChat]);

  const startTour = async (tourId: string) => {
    try {
      // Lazy loading
      const { tours } = await import('../../data/tours');
      const tour = tours.find(t => t.id === tourId);
      if (tour) {
        if (toggleChat) toggleChat();
        startStoreTour(tour);
      } else {
        console.warn(`Tour com ID ${tourId} não encontrado`);
      }
    } catch (error) {
      console.error('Erro ao carregar tours:', error);
    }
  };

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isActive]);

  const contextValue: TourContextType = {
    startTour,
    endTour,
  };

  return (
    <TourContext.Provider value={contextValue}>
      {children}
      {isActive && activeTour && <TourOverlay />}
    </TourContext.Provider>
  );
};

export default TourProvider;
