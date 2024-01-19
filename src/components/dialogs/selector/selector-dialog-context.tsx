'use client';

// React Imports
import React, { createContext, useContext, useState } from 'react';

// Scripts Imports
import { GroupType, SimpleStreamerType } from '@/@types/data';

interface ContextItemValue<T> {
  value: T[];
  set: React.Dispatch<React.SetStateAction<T[]>>;
}

export const StreamsSelectorDialogContext = createContext<{
  selectedStreamers: ContextItemValue<SimpleStreamerType>;
  selectedGroups: ContextItemValue<
    GroupType & {
      hidedMembers: {
        display_name: string;
        twitch_name: string;
      }[];
    }
  >;
  changedGroups: ContextItemValue<string>;
}>({
  selectedStreamers: {
    value: [],
    set: () => {},
  },
  selectedGroups: {
    value: [],
    set: () => {},
  },
  changedGroups: {
    value: [],
    set: () => {},
  },
});

export const StreamsSelectorDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const selectedStreamers = useState<SimpleStreamerType[]>([]);
  const selectedGroups = useState<
    (GroupType & {
      hidedMembers: {
        display_name: string;
        twitch_name: string;
      }[];
    })[]
  >([]);
  const changedGroups = useState<string[]>([]);

  return (
    <StreamsSelectorDialogContext.Provider
      value={{
        selectedStreamers: {
          value: selectedStreamers[0],
          set: selectedStreamers[1],
        },
        selectedGroups: {
          value: selectedGroups[0],
          set: selectedGroups[1],
        },
        changedGroups: {
          value: changedGroups[0],
          set: changedGroups[1],
        },
      }}
    >
      {children}
    </StreamsSelectorDialogContext.Provider>
  );
};

export const useStreamsSelector = () =>
  useContext(StreamsSelectorDialogContext);
