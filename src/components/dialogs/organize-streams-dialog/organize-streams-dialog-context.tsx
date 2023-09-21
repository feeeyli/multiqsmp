'use client';

// React Imports
import React, { createContext, useContext, useState } from 'react';

type ContextType = [
  [string[], React.Dispatch<React.SetStateAction<string[]>>],
  [string[], React.Dispatch<React.SetStateAction<string[]>>],
];

export const OrganizeStreamsDialogContext = createContext<ContextType>([
  [[''], () => {}],
  [[''], () => {}],
]);

export const OrganizeStreamsDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const actualStreamers = useState<string[]>([]);
  const actualChats = useState<string[]>([]);

  return (
    <OrganizeStreamsDialogContext.Provider
      value={[actualStreamers, actualChats]}
    >
      {children}
    </OrganizeStreamsDialogContext.Provider>
  );
};

export const useOrganizeStreamsDialogContext = () =>
  useContext(OrganizeStreamsDialogContext);
