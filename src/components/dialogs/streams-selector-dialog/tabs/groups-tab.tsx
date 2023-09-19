// React Imports
import { useContext } from 'react';

// Data Imports
import { GROUPS } from '@/data/groups';

// Contexts Imports
import { StreamsSelectorDialogContext } from '../streams-selector-dialog-context';

// Components Imports
import { TabsContent } from '@/components/ui/tabs';
import { Group } from '../group';

export const GroupsTab = () => {
  const { selectedGroups } = useContext(StreamsSelectorDialogContext);

  return (
    <TabsContent
      value="groups"
      className="scrollbar flex max-h-80 flex-wrap justify-center gap-2 overflow-y-auto"
    >
      {GROUPS.map((group) => (
        <Group
          key={group.groupName}
          group={group}
          selected={selectedGroups.value.includes(group.simpleGroupName)}
        />
      ))}
    </TabsContent>
  );
};
