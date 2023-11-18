// React Imports
import { useContext } from 'react';

// Data Imports
import { GROUPS } from '@/data/groups';

// Contexts Imports
import { StreamsSelectorDialogContext } from '../streams-selector-dialog-context';
import { useFavoriteListsContext } from './favorite-lists-context';
import { useCustomGroupsContext } from '@/contexts/custom-groups-context';
import { CreateGroupDialogProvider } from '../../create-group-dialog/create-group-dialog-context';

// Components Imports
import { TabsContent } from '@/components/ui/tabs';
import { Group } from '../group';
import { CreateGroupDialog } from '../../create-group-dialog';
import { Separator } from '@/components/ui/separator';

// Scripts Imports
import { sortGroups } from '@/utils/sort';

export const GroupsTab = () => {
  const { selectedGroups } = useContext(StreamsSelectorDialogContext);
  const { groups: favoritesList } = useFavoriteListsContext();
  const [customGroups] = useCustomGroupsContext();

  const mergedGroups = sortGroups([...new Set([...GROUPS, ...customGroups])]);

  const favoriteGroups = mergedGroups.filter((item) =>
    favoritesList.value.includes(item.simpleGroupName),
  );
  const nonFavoriteGroups = GROUPS.filter(
    (item) => !favoritesList.value.includes(item.simpleGroupName),
  );
  const nonFavoriteCustomGroups = customGroups.filter(
    (item) => !favoritesList.value.includes(item.simpleGroupName),
  );

  return (
    <TabsContent
      value="groups"
      className="scrollbar flex max-h-80 flex-wrap justify-center gap-3 overflow-y-auto pb-3 pt-2 data-[state=inactive]:hidden"
    >
      <div className="flex w-full flex-wrap justify-center gap-4">
        {favoriteGroups.map((group) => (
          <Group
            key={group.groupName}
            group={group}
            selected={selectedGroups.value.includes(group.simpleGroupName)}
            favorite
            custom={customGroups
              .map((cg) => cg.simpleGroupName)
              .includes(group.simpleGroupName)}
          />
        ))}
      </div>
      {favoriteGroups.length > 0 && nonFavoriteGroups.length > 0 && (
        <Separator />
      )}
      <div className="flex w-full flex-wrap justify-center gap-4">
        {nonFavoriteGroups.map((group) => (
          <Group
            key={group.groupName}
            group={group}
            selected={selectedGroups.value.includes(group.simpleGroupName)}
          />
        ))}
      </div>
      <Separator />
      <div className="flex w-full flex-wrap justify-center gap-4">
        {nonFavoriteCustomGroups.map((group) => (
          <Group
            key={group.groupName}
            group={group}
            selected={selectedGroups.value.includes(group.simpleGroupName)}
            custom
          />
        ))}
        <CreateGroupDialogProvider>
          <CreateGroupDialog />
        </CreateGroupDialogProvider>
      </div>
    </TabsContent>
  );
};
