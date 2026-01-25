'use client';
import { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react';
import { Practice } from '@/lib/data';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

type PracticeContextType = {
  selectedPractice: Practice | undefined;
  setSelectedPractice: (practice: Practice) => void;
  practices: (Practice & { id: string; })[] | null;
  practicesLoading: boolean;
};

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [selectedPractice, setSelectedPractice] = useState<Practice | undefined>(undefined);
  const firestore = useFirestore();
  
  const practicesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'practices'));
  }, [firestore]);

  const { data: practices, isLoading: practicesLoading } = useCollection<Practice>(practicesQuery);

  useEffect(() => {
    // If practices have loaded and there's at least one
    if (practices && practices.length > 0) {
      // And if no practice is selected OR the selected one is no longer in the list
      if (!selectedPractice || !practices.find(p => p.id === selectedPractice.id)) {
        // Select the first one
        setSelectedPractice(practices[0]);
      }
    } else if (!practicesLoading && practices && practices.length === 0) {
      // If loading is done and there are no practices, ensure selectedPractice is undefined.
      setSelectedPractice(undefined);
    }
  }, [practices, selectedPractice, practicesLoading]);

  return (
    <PracticeContext.Provider value={{ selectedPractice, setSelectedPractice, practices, practicesLoading }}>
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
