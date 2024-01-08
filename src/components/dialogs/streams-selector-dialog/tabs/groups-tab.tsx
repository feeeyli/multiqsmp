// React Imports
import { useContext, useState } from 'react';

// Data Imports
// import { GROUPS } from '@/data/groups';

// Contexts Imports
import { useCustomGroupsContext } from '@/contexts/custom-groups-context';
import { CreateGroupDialogProvider } from '../../create-group-dialog/create-group-dialog-context';
import { StreamsSelectorDialogContext } from '../streams-selector-dialog-context';
import { useFavoriteListsContext } from './favorite-lists-context';

// Components Imports
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { CreateGroupDialog } from '../../create-group-dialog';
import { Group } from '../group';

// Scripts Imports
import { GroupType, StreamerType } from '@/@types/data';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { sortGroups } from '@/utils/sort';
import { Label } from '@radix-ui/react-label';
import { BoxSelect, CheckSquare, MousePointerSquareDashed } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface GroupsTabProps {
  GROUPS: GroupType[];
  STREAMERS: StreamerType[];
  purgatory: boolean;
}

export const GroupsTab = ({ GROUPS, ...props }: GroupsTabProps) => {
  const { selectedGroups } = useContext(StreamsSelectorDialogContext);
  const { groups: favoritesList } = useFavoriteListsContext();
  const [customGroups] = useCustomGroupsContext();
  const [search, setSearch] = useState('');

  const t = useTranslations('streamers-dialog');

  const mergedGroups = sortGroups([
    ...new Set([...GROUPS, ...customGroups]),
  ]).filter(
    (s) =>
      s.simpleGroupName
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()) ||
      s.groupName.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );

  const favoriteGroups = mergedGroups.filter((item) =>
    favoritesList.value.includes(item.simpleGroupName),
  );
  const nonFavoriteGroups = GROUPS.filter(
    (s) =>
      s.simpleGroupName
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()) ||
      s.groupName.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  ).filter((item) => !favoritesList.value.includes(item.simpleGroupName));
  const nonFavoriteCustomGroups = customGroups
    .filter(
      (s) =>
        s.simpleGroupName
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()) ||
        s.groupName.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    )
    .filter((item) => !favoritesList.value.includes(item.simpleGroupName));

  return (
    <TabsContent
      value="groups"
      className="relative flex max-h-80 flex-col gap-3 pb-3 data-[state=inactive]:hidden"
    >
      <header className="flex w-full items-center gap-3 bg-background">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 px-2.5"
            >
              Selecionar
              <MousePointerSquareDashed size="1rem" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                selectedGroups.actions.updateList(
                  mergedGroups.map((s) => s.simpleGroupName),
                );
              }}
            >
              <CheckSquare size="1rem" /> {t('select.all')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                selectedGroups.actions.updateList([]);
              }}
            >
              <BoxSelect size="1rem" /> {t('select.none')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-full">
          <Label className="sr-only" htmlFor="streamer-search">
            {t('streamer-search-label')}
          </Label>
          <Input
            type="text"
            id="streamer-search"
            placeholder={t('streamer-search-label')}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
      </header>
      <div className="scrollbar h-full w-full overflow-auto pt-1">
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
              STREAMERS={props.STREAMERS}
            />
          ))}
        </div>
        {favoriteGroups.length > 0 && nonFavoriteGroups.length > 0 && (
          <Separator className="my-3" />
        )}
        {nonFavoriteGroups.length > 0 && (
          <>
            <div className="flex w-full flex-wrap justify-center gap-4">
              {nonFavoriteGroups.map((group) => (
                <Group
                  key={group.groupName}
                  group={group}
                  selected={selectedGroups.value.includes(
                    group.simpleGroupName,
                  )}
                  STREAMERS={props.STREAMERS}
                />
              ))}
            </div>
            <Separator className="my-3" />
          </>
        )}
        <div className="flex w-full flex-wrap justify-center gap-4">
          {nonFavoriteCustomGroups.map((group) => (
            <Group
              key={group.groupName}
              group={group}
              selected={selectedGroups.value.includes(group.simpleGroupName)}
              custom
              STREAMERS={props.STREAMERS}
            />
          ))}
          <CreateGroupDialogProvider>
            <CreateGroupDialog
              purgatory={props.purgatory}
              STREAMERS={props.STREAMERS}
            />
          </CreateGroupDialogProvider>
        </div>
      </div>
    </TabsContent>
  );
};
