'use client';

import { SimpleStreamerType } from '@/@types/data';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';

type PinnedStreamer = SimpleStreamerType & {
  skin_head?: string;
};

export const PinnedStreamersContext = createContext<
  [
    PinnedStreamer[],
    Dispatch<SetStateAction<PinnedStreamer[]>>,
    (twitch_name: string) => boolean,
  ]
>([[], () => {}, () => false]);

export const PinnedStreamersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pinnedStreamers, setPinnedStreamers] = useLocalStorage<
    PinnedStreamer[]
  >('pinned-streamers', []);

  function isPinned(twitch_name: string) {
    return pinnedStreamers.some((pinned) => pinned.twitch_name === twitch_name);
  }

  return (
    <PinnedStreamersContext.Provider
      value={[pinnedStreamers, setPinnedStreamers, isPinned]}
    >
      {children}
    </PinnedStreamersContext.Provider>
  );
};

export const usePinnedStreamers = () => useContext(PinnedStreamersContext);
