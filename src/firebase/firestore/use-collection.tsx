'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, Query, DocumentData } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';

type DocumentWithId<T> = T & { id: string };

export function useCollection<T extends DocumentData>(
  query: Query | null
) {
  const [data, setData] = useState<DocumentWithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    if (query === null) {
      setData(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DocumentWithId<T>[];
        setData(documents);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore useCollection error:", err);
        // Emit error for central listener
        errorEmitter.emit('permission-error', err);
        setError(err);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, isLoading, error };
}
