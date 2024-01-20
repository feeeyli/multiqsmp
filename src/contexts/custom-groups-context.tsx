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

type OldGroupType = {
  groupName: string;
  simpleGroupName: string;
  members: string[];
  twitchNames: string[];
  avatars: string[];
};

export const CustomGroupsContext = createContext<
  [GroupType[], Dispatch<SetStateAction<OldGroupType[]>>]
>([[], () => {}]);

export const CustomGroupsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const customGroups = useLocalStorage<OldGroupType[]>('custom-groups', []);

  const parsedGroups: GroupType[] = customGroups[0].map((cg) => ({
    display_name: cg.groupName,
    simple_name: cg.simpleGroupName,
    members: cg.members.map((m, i) => ({
      display_name: m,
      twitch_name: cg.twitchNames[i],
    })),
  }));

  return (
    <CustomGroupsContext.Provider value={[parsedGroups, customGroups[1]]}>
      {children}
    </CustomGroupsContext.Provider>
  );
};

export const useCustomGroups = () => useContext(CustomGroupsContext);
