// React Imports
import { useState } from 'react';

// Types Imports
import { GroupType } from '@/@types/data';

// Datas Imports
import { GROUPS } from '@/data/groups';
import { STREAMERS } from '@/data/streamers';

// Libs Imports
import { useTranslations } from 'next-intl';

// Components Imports
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@radix-ui/react-dialog';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { StreamerItem } from '../create-group-dialog/streamer-item';

// Icons Imports
import { Pencil, Save } from 'lucide-react';

// Contexts Imports
import { useCustomGroupsContext } from '@/contexts/custom-groups-context';

// Scripts Imports
import { getDisplayName } from '@/utils/getDisplayName';
import { getAvatarsList } from '@/utils/getAvatarsList';
import { DeleteGroupDialog } from '../delete-group-dialog';
import { useFavoriteListsContext } from '../streams-selector-dialog/tabs/favorite-lists-context';

interface EditGroupDialog {
  group: GroupType;
}

export const EditGroupDialog = (props: EditGroupDialog) => {
  const t = useTranslations('edit-group-dialog');
  const [customGroups, setCustomGroups] = useCustomGroupsContext();
  const { groups: favoriteGroups } = useFavoriteListsContext();
  const [selectedGroupStreamers, setSelectedGroupStreamers] = useState(
    props.group.twitchNames,
  );
  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState(props.group.groupName);

  const mergedGroups = [...new Set([...GROUPS, ...customGroups])];

  const avatars = getAvatarsList(selectedGroupStreamers);

  const isGroupNameUnique = mergedGroups
    .map((cg) => cg.simpleGroupName)
    .filter((cg) => cg !== props.group.simpleGroupName)
    .includes(groupName.toLocaleLowerCase().replaceAll(' ', '-'));

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSearch('');
          setGroupName(props.group.groupName);
          setSelectedGroupStreamers(props.group.twitchNames);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="absolute -right-1 -top-1 z-10 h-auto p-1.5"
        >
          <Pencil size="1rem" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <section className="space-y-2">
            <h3>1. {t('name-subtitle')}</h3>
            <Label className="sr-only" htmlFor="group-name">
              {t('group-name-label')}
            </Label>
            <Input
              type="text"
              id="group-name"
              placeholder={t('group-name-label')}
              onChange={(e) => setGroupName(e.target.value)}
              value={groupName}
            />
            {isGroupNameUnique && (
              <span className="text-xs text-red-500">{t('name-error')}</span>
            )}
          </section>
          <section className="space-y-2">
            <h3>2. {t('choose-subtitle')}</h3>
            <div>
              <Label className="sr-only" htmlFor="streamer-search">
                {t('search-streamer-label')}
              </Label>
              <Input
                type="text"
                id="streamer-search"
                placeholder={t('search-streamer-label')}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            <ToggleGroup.Root
              type="multiple"
              className="scrollbar flex max-h-96 flex-wrap gap-2 overflow-y-auto p-1 pr-2"
              onValueChange={setSelectedGroupStreamers}
              defaultValue={selectedGroupStreamers}
            >
              {STREAMERS.filter((streamer) =>
                streamer.displayName
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase()),
              ).map((streamer, index) => (
                <StreamerItem
                  streamer={streamer}
                  index={index}
                  key={streamer.twitchName}
                />
              ))}
            </ToggleGroup.Root>
            <p className="text-sm">
              <span className="text-muted-foreground">
                {selectedGroupStreamers.length > 0 && t('selected-streamers')}
                {selectedGroupStreamers.length === 0 &&
                  t('no-selected-streamers')}
              </span>{' '}
              {selectedGroupStreamers.map((s) => getDisplayName(s)).length >
                0 &&
                selectedGroupStreamers.map((s) => getDisplayName(s)).join(', ')}
            </p>
          </section>
        </div>
        <DialogFooter className="sm:justify-between">
          <DeleteGroupDialog group={props.group} />
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => {
                setCustomGroups((old) => {
                  const groupId = old.findIndex(
                    (g) => g.simpleGroupName === props.group.simpleGroupName,
                  );

                  let editedCustomGroups = [...old];

                  editedCustomGroups[groupId] = {
                    groupName,
                    simpleGroupName: groupName
                      .toLocaleLowerCase()
                      .replaceAll(' ', '-'),
                    members: selectedGroupStreamers.map((s) =>
                      getDisplayName(s),
                    ),
                    avatars:
                      avatars.includes('peqitw') && avatars.includes('pactw')
                        ? avatars.filter((a) => a !== 'peqitw')
                        : avatars,
                    twitchNames: selectedGroupStreamers,
                  };

                  return editedCustomGroups;
                });

                if (favoriteGroups.value.includes(props.group.simpleGroupName))
                  favoriteGroups.set((old) => {
                    let newFavoriteGroups = old.filter(
                      (fg) => fg !== props.group.simpleGroupName,
                    );

                    newFavoriteGroups.push(
                      groupName.toLocaleLowerCase().replaceAll(' ', '-'),
                    );

                    return newFavoriteGroups;
                  });
              }}
              disabled={
                isGroupNameUnique ||
                groupName.trim() === '' ||
                selectedGroupStreamers.length === 0
              }
            >
              {t('submit')}
              <Save size="1rem" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
