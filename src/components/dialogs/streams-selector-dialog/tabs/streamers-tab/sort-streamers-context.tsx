'use client';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

export const SortStreamersContext = createContext<{
  direction: {
    value: 'asc' | 'des';
    set: Dispatch<SetStateAction<'asc' | 'des'>>;
  };
  sortMethod: {
    value: 'name-lang' | 'name';
    set: Dispatch<SetStateAction<'name-lang' | 'name'>>;
  };
  onlineFirst: {
    value: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
  playingFirst: {
    value: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
}>({
  direction: {
    value: 'asc',
    set: () => {},
  },
  sortMethod: {
    value: 'name-lang',
    set: () => {},
  },
  onlineFirst: {
    value: false,
    set: () => {},
  },
  playingFirst: {
    value: false,
    set: () => {},
  },
});

export const SortStreamersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [direction, setDirection] = useState<'asc' | 'des'>('asc');
  const [sortMethod, setSortMethod] = useState<'name-lang' | 'name'>(
    'name-lang',
  );
  const [onlineFirst, setOnlineFirst] = useState(false);
  const [playingFirst, setPlayingFirst] = useState(false);

  return (
    <SortStreamersContext.Provider
      value={{
        direction: {
          value: direction,
          set: setDirection,
        },
        sortMethod: {
          value: sortMethod,
          set: setSortMethod,
        },
        onlineFirst: {
          value: onlineFirst,
          set: setOnlineFirst,
        },
        playingFirst: {
          value: playingFirst,
          set: setPlayingFirst,
        },
      }}
    >
      {children}
    </SortStreamersContext.Provider>
  );
};

export const useSortStreamers = () => useContext(SortStreamersContext);
