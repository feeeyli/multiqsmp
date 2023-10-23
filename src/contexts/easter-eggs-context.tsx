'use client';

// React Imports
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';

type EasterEggs = {
  active: boolean;
  cucurucho: boolean;
};

export const EasterEggsContext = createContext<
  [EasterEggs, Dispatch<SetStateAction<EasterEggs>>]
>([{ cucurucho: false, active: false }, () => {}]);

export const EasterEggsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const easterEggs = useLocalStorage<EasterEggs>('easter-eggs', {
    cucurucho: false,
    active: false,
  });

  return (
    <EasterEggsContext.Provider value={easterEggs}>
      {children}
    </EasterEggsContext.Provider>
  );
};

export const useEasterEggsContext = () => useContext(EasterEggsContext);
