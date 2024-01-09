'use client';

// React Imports
import React, { createContext, useContext } from 'react';

// Scripts Imports
import { ListReturnProps, useList } from '@/hooks/useList';

export const CreateGroupDialogContext = createContext<ListReturnProps<string>>([
  [],
  {
    addItem() {},
    moveItem() {},
    removeItem() {},
    updateList() {},
    toggleItem() {},
  },
]);

export const CreateGroupDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const selectedStreamers = useList<string>([]);

  return (
    <CreateGroupDialogContext.Provider value={selectedStreamers}>
      {children}
    </CreateGroupDialogContext.Provider>
  );
};

export const useCreateGroupDialogContext = () =>
  useContext(CreateGroupDialogContext);
