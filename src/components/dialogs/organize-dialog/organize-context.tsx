'use client';

// React Imports
import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { OrganizeStateGroups, OrganizeStateStreamers } from '.';

type UseState<S> = [S, Dispatch<SetStateAction<S>>];

type ContextType = {
  streamersList: UseState<OrganizeStateStreamers[]>;
  groupsList: UseState<OrganizeStateGroups[]>;
};

export const OrganizeDialogContext = createContext<ContextType>({
  streamersList: [[], () => {}],
  groupsList: [[], () => {}],
});

export const OrganizeDialogProvider = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
} & ContextType) => {
  return (
    <OrganizeDialogContext.Provider value={{ ...rest }}>
      {children}
    </OrganizeDialogContext.Provider>
  );
};

export const useOrganize = () => useContext(OrganizeDialogContext);
