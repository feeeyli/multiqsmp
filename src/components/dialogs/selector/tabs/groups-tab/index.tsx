// React Imports
import { useState } from 'react';

// Data Imports
// import { GROUPS } from '@/data/groups';

// Contexts Imports
import { useCustomGroups } from '@/contexts/custom-groups-context';
import { useStreamsSelector } from '../../selector-dialog-context';
import { useFavoriteListsContext } from '../favorite-lists-context';

// Components Imports
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { CreateGroupDialog } from '../../../custom-groups/create-group/create-group-dialog';
import { Group } from './group';

// Scripts Imports
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { GROUPS } from '@/data/groups';
import { useTranslations } from '@/hooks/useTranslations';
import { sortGroups } from '@/utils/sort';
import { Label } from '@radix-ui/react-label';
import { BoxSelect, CheckSquare, MousePointerSquareDashed } from 'lucide-react';

export const GroupsTab = () => {
  const { selectedGroups } = useStreamsSelector();
  const { groups: favoritesList } = useFavoriteListsContext();
  const [customGroups] = useCustomGroups();
  const [search, setSearch] = useState('');

  const t = useTranslations('streamers-dialog');

  const mergedGroups = sortGroups([...new Set([...GROUPS, ...customGroups])]);

  const searchedGroups = mergedGroups.filter(
    (s) =>
      s.simple_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      s.display_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );

  const favoriteGroups = searchedGroups.filter((item) =>
    favoritesList.value.includes(item.simple_name),
  );
  const nonFavoriteGroups = GROUPS.filter(
    (s) =>
      s.simple_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      s.display_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  ).filter((item) => !favoritesList.value.includes(item.simple_name));
  const nonFavoriteCustomGroups = customGroups
    .filter(
      (s) =>
        s.simple_name
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()) ||
        s.display_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    )
    .filter((item) => !favoritesList.value.includes(item.simple_name));

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
              {t('select.label')}
              <MousePointerSquareDashed size="1rem" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                selectedGroups.set(
                  searchedGroups.map((g) => ({ ...g, hidedMembers: [] })),
                );
              }}
            >
              <CheckSquare size="1rem" /> {t('select.all')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                selectedGroups.set([]);
              }}
            >
              <BoxSelect size="1rem" /> {t('select.none')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-full">
          <Label className="sr-only" htmlFor="group-search">
            {t('group-search-label')}
          </Label>
          <Input
            type="text"
            id="group-search"
            placeholder={t('group-search-label')}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
      </header>
      <ToggleGroup
        className="scrollbar h-full w-full flex-col space-x-0 overflow-y-auto bg-transparent pt-1"
        type="multiple"
        orientation="vertical"
        value={selectedGroups.value.map((s) => s.simple_name)}
        onValueChange={(value) => {
          selectedGroups.set((old) => {
            return value.map((grp) => {
              const group = mergedGroups.find((s) => s.simple_name === grp)!;

              const hidedMembers = old.find((s) => s.simple_name === grp)
                ?.hidedMembers;

              return { ...group, hidedMembers: hidedMembers ?? [] };
            });
          });
        }}
      >
        <div className="flex w-full flex-wrap justify-center gap-4">
          {favoriteGroups.map((group) => (
            <Group
              key={group.simple_name}
              group={{
                ...group,
                hidedMembers:
                  selectedGroups.value.find(
                    (g) => g.simple_name === group.simple_name,
                  )?.hidedMembers ?? [],
              }}
              favorite
              custom={customGroups
                .map((cg) => cg.simple_name)
                .includes(group.simple_name)}
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
                  key={group.simple_name}
                  group={{
                    ...group,
                    hidedMembers:
                      selectedGroups.value.find(
                        (g) => g.simple_name === group.simple_name,
                      )?.hidedMembers ?? [],
                  }}
                />
              ))}
            </div>
            <Separator className="my-3" />
          </>
        )}
        <div className="flex w-full flex-wrap justify-center gap-4">
          {nonFavoriteCustomGroups.map((group) => (
            <Group
              key={group.simple_name}
              group={{
                ...group,
                hidedMembers:
                  selectedGroups.value.find(
                    (g) => g.simple_name === group.simple_name,
                  )?.hidedMembers ?? [],
              }}
              custom
            />
          ))}
          <CreateGroupDialog />
        </div>
      </ToggleGroup>
    </TabsContent>
  );
};
