'use client';

// React Imports
import React, { createContext } from 'react';

// Scripts Imports
import { ListReturnProps, useList } from '@/utils/useList';

interface ContextItemValue {
  value: ListReturnProps<string>[0];
  actions: ListReturnProps<string>[1];
}

export const StreamsSelectorDialogContext = createContext<{
  selectedStreamers: ContextItemValue;
  selectedGroups: ContextItemValue;
}>({
  selectedStreamers: {
    value: [],
    actions: {
      addItem() {},
      moveItem() {},
      removeItem() {},
      updateList() {},
      toggleItem() {},
    },
  },
  selectedGroups: {
    value: [],
    actions: {
      addItem() {},
      moveItem() {},
      removeItem() {},
      updateList() {},
      toggleItem() {},
    },
  },
});

export const StreamsSelectorDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const selectedStreamers = useList<string>([]);
  const selectedGroups = useList<string>([]);

  return (
    <StreamsSelectorDialogContext.Provider
      value={{
        selectedStreamers: {
          value: selectedStreamers[0],
          actions: selectedStreamers[1],
        },
        selectedGroups: {
          value: selectedGroups[0],
          actions: selectedGroups[1],
        },
      }}
    >
      {children}
    </StreamsSelectorDialogContext.Provider>
  );
};
