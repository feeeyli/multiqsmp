'use client';

// React Imports
import React, { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { useLocalStorage } from 'usehooks-ts';

// Scripts Imports

interface ContextItemValue {
  value: string[];
  set: Dispatch<SetStateAction<string[]>>;
}

export const FavoriteListsContext = createContext<{
  streamers: ContextItemValue;
  groups: ContextItemValue;
}>({
  streamers: {
    value: [],
    set: () => {},
  },
  groups: {
    value: [],
    set: () => {},
  },
});

export const FavoriteListsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const favoriteStreamers = useLocalStorage<string[]>('favorite-streamers', []);
  const favoriteGroups = useLocalStorage<string[]>('favorite-groups', []);

  return (
    <FavoriteListsContext.Provider
      value={{
        streamers: {
          value: favoriteStreamers[0],
          set: favoriteStreamers[1],
        },
        groups: {
          value: favoriteGroups[0],
          set: favoriteGroups[1],
        },
      }}
    >
      {children}
    </FavoriteListsContext.Provider>
  );
};

export const useFavoriteListsContext = () => useContext(FavoriteListsContext);
