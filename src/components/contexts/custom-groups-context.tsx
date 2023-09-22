'use client';

// React Imports
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';

// Data Imports
import { GroupType } from '@/@types/data';

export const CustomGroupsContext = createContext<
  [GroupType[], Dispatch<SetStateAction<GroupType[]>>]
>([[], () => {}]);

export const CustomGroupsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const customGroups = useLocalStorage<GroupType[]>('custom-groups', []);

  return (
    <CustomGroupsContext.Provider value={customGroups}>
      {children}
    </CustomGroupsContext.Provider>
  );
};

export const useCustomGroupsContext = () => useContext(CustomGroupsContext);
