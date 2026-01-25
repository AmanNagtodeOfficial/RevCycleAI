'use client';
import { createContext, useContext, ReactNode, useState } from 'react';
import { Practice, practices } from '@/lib/data';

type PracticeContextType = {
  selectedPractice: Practice;
  setSelectedPractice: (practice: Practice) => void;
};

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [selectedPractice, setSelectedPractice] = useState<Practice>(practices[0]);

  return (
    <PracticeContext.Provider value={{ selectedPractice, setSelectedPractice }}>
      {children}
    </PracticeContext.Provider>
  );
}

export function usePractice() {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
}
