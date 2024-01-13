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
import { useCustomGroups } from '@/contexts/custom-groups-context';

// Scripts Imports
import {
  getGroupsDisplayName,
  getStreamerDisplayName,
} from '@/utils/getDisplayName';
import { DeleteGroupDialog } from '../delete-group-dialog';
import { useFavoriteListsContext } from '../streams-selector-dialog/tabs/favorite-lists-context';

interface EditGroupDialog {
  group: GroupType;
}

export const EditGroupDialog = (props: EditGroupDialog) => {
  const t = useTranslations('edit-group-dialog');
  const [customGroups, setCustomGroups] = useCustomGroups();
  const { groups: favoriteGroups } = useFavoriteListsContext();
  const [selectedGroupStreamers, setSelectedGroupStreamers] = useState(
    props.group.members.map((m) => m.twitch_name),
  );
  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState(props.group.display_name);

  const mergedGroups = [...new Set([...GROUPS, ...customGroups])];

  const isGroupNameUnique = mergedGroups
    .map((cg) => cg.simple_name)
    .filter((cg) => cg !== props.group.simple_name)
    .includes(groupName.toLocaleLowerCase().replaceAll(' ', '-'));

  const STREAMERS_IN_GROUP = STREAMERS.filter((s) =>
    props.group.members.some((m) => m.twitch_name == s.twitch_name),
  );

  const REORDERED_STREAMERS = [
    ...new Set([...STREAMERS_IN_GROUP, ...STREAMERS]),
  ];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSearch('');
          setGroupName(props.group.display_name);
          setSelectedGroupStreamers(
            props.group.members.map((m) => m.twitch_name),
          );
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
              {REORDERED_STREAMERS.filter((streamer) =>
                streamer.display_name
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase()),
              ).map((streamer) => (
                <StreamerItem streamer={streamer} key={streamer.twitch_name} />
              ))}
            </ToggleGroup.Root>
            <p className="text-sm">
              <span className="text-muted-foreground">
                {selectedGroupStreamers.length > 0 && t('selected-streamers')}
                {selectedGroupStreamers.length === 0 &&
                  t('no-selected-streamers')}
              </span>{' '}
              {selectedGroupStreamers.map((s) => getGroupsDisplayName(s))
                .length > 0 &&
                selectedGroupStreamers
                  .map((s) => getGroupsDisplayName(s))
                  .join(', ')}
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
                    (g) => g.simpleGroupName === props.group.simple_name,
                  );

                  const editedCustomGroups = [...old];

                  editedCustomGroups[groupId] = {
                    groupName,
                    simpleGroupName: groupName
                      .toLocaleLowerCase()
                      .replaceAll(' ', '-'),
                    avatars: selectedGroupStreamers,
                    twitchNames: selectedGroupStreamers,
                    members: selectedGroupStreamers.map((s) =>
                      getStreamerDisplayName(s),
                    ),
                  };

                  return editedCustomGroups;
                });

                if (favoriteGroups.value.includes(props.group.simple_name))
                  favoriteGroups.set((old) => {
                    const newFavoriteGroups = old.filter(
                      (fg) => fg !== props.group.simple_name,
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
