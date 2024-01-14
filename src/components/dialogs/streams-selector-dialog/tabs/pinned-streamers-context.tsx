'use client';

import { SimpleStreamerType } from '@/@types/data';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';

export const PinnedStreamersContext = createContext<
  [SimpleStreamerType[], Dispatch<SetStateAction<SimpleStreamerType[]>>]
>([[], () => {}]);

export const PinnedStreamersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pinnedStreamers = useLocalStorage<SimpleStreamerType[]>(
    'pinned-streamers',
    [],
  );

  return (
    <PinnedStreamersContext.Provider value={pinnedStreamers}>
      {children}
    </PinnedStreamersContext.Provider>
  );
};

export const usePinnedStreamers = () => useContext(PinnedStreamersContext);
