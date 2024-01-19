'use client';

// React Imports
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { Layout } from 'react-grid-layout';
import { useLocalStorage } from 'usehooks-ts';

type LayoutMemory = {
  [url: string]: Layout[];
};

export const LayoutMemoryContext = createContext<{
  layoutMemory: [LayoutMemory, Dispatch<SetStateAction<LayoutMemory>>];
  layout: [Layout[], Dispatch<SetStateAction<Layout[]>>];
}>({
  layoutMemory: [{}, () => {}],
  layout: [[], () => {}],
});

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const layoutMemory = useLocalStorage<LayoutMemory>('layout-memory', {});
  const layout = useState<Layout[]>([]);

  return (
    <LayoutMemoryContext.Provider value={{ layout, layoutMemory }}>
      {children}
    </LayoutMemoryContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutMemoryContext);
