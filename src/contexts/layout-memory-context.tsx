'use client';

// React Imports
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
} from 'react';
import { Layout } from 'react-grid-layout';
import { useLocalStorage } from 'usehooks-ts';

type LayoutMemory = {
  [url: string]: Layout[];
};

export const LayoutMemoryContext = createContext<
  [LayoutMemory, Dispatch<SetStateAction<LayoutMemory>>]
>([{}, () => {}]);

export const LayoutMemoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const layoutMemory = useLocalStorage<LayoutMemory>('layout-memory', {});

  return (
    <LayoutMemoryContext.Provider value={layoutMemory}>
      {children}
    </LayoutMemoryContext.Provider>
  );
};

export const useLayoutMemory = () => useContext(LayoutMemoryContext);
