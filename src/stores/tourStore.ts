import { create } from 'zustand';
import type { Tour, TourStep } from '../types';

interface TourState {
  activeTour: Tour | null;
  currentStep: number;
  isActive: boolean;
  isWaiting: boolean;
  startTour: (tour: Tour) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  skipTour: () => void;
  getCurrentStep: () => TourStep | null;
  setWaiting: (waiting: boolean) => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  activeTour: null,
  currentStep: 0,
  isActive: false,
  isWaiting: false,

  startTour: (tour) => {
    set({
      activeTour: tour,
      currentStep: 0,
      isActive: true,
      isWaiting: false,
    });
  },

  nextStep: () => {
    const { activeTour, currentStep } = get();
    if (activeTour && currentStep < activeTour.steps.length - 1) {
      set({ 
        currentStep: currentStep + 1,
        isWaiting: true 
      });
      
      // Remove waiting após delay
      setTimeout(() => {
        set({ isWaiting: false });
      }, 500);
    } else {
      get().endTour();
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  endTour: () => {
    set({
      activeTour: null,
      currentStep: 0,
      isActive: false,
      isWaiting: false,
    });
  },

  skipTour: () => {
    get().endTour();
  },

  getCurrentStep: () => {
    const { activeTour, currentStep } = get();
    return activeTour?.steps[currentStep] || null;
  },

  setWaiting: (waiting) => set({ isWaiting: waiting }),
}));
