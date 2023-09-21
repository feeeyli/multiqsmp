// React Imports
import { useContext } from 'react';

// Data Imports
import { GROUPS } from '@/data/groups';

// Contexts Imports
import { StreamsSelectorDialogContext } from '../streams-selector-dialog-context';
import { useFavoriteListsContext } from './favorite-lists-context';

// Components Imports
import { TabsContent } from '@/components/ui/tabs';
import { Group } from '../group';
import { Separator } from '@/components/ui/separator';

export const GroupsTab = () => {
  const { selectedGroups } = useContext(StreamsSelectorDialogContext);
  const { groups: favoritesList } = useFavoriteListsContext();

  const favoriteGroups = GROUPS.filter((item) =>
    favoritesList.value.includes(item.simpleGroupName),
  );
  const nonFavoriteGroups = GROUPS.filter(
    (item) => !favoritesList.value.includes(item.simpleGroupName),
  );

  return (
    <TabsContent
      value="groups"
      className="scrollbar flex max-h-80 flex-wrap justify-center gap-2 overflow-y-auto"
    >
      <div className="flex w-full flex-wrap justify-center gap-2">
        {favoriteGroups.map((group) => (
          <Group
            key={group.groupName}
            group={group}
            selected={selectedGroups.value.includes(group.simpleGroupName)}
            favorite
          />
        ))}
      </div>
      {favoriteGroups.length > 0 && nonFavoriteGroups.length > 0 && (
        <Separator />
      )}
      <div className="flex w-full flex-wrap justify-center gap-2">
        {nonFavoriteGroups.map((group) => (
          <Group
            key={group.groupName}
            group={group}
            selected={selectedGroups.value.includes(group.simpleGroupName)}
          />
        ))}
      </div>
    </TabsContent>
  );
};
