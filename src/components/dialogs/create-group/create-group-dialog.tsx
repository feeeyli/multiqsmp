// React Imports
import { useState } from 'react';

// Types Imports

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
import { StreamerItem } from './streamer-item';

// Icons Imports
import { Plus } from 'lucide-react';

// Contexts Imports
import { useCustomGroups } from '@/contexts/custom-groups-context';

// Scripts Imports
import { SimpleStreamerType } from '@/@types/data';
import { matchSorter } from 'match-sorter';
import { usePinnedStreamers } from '../selector/tabs/pinned-streamers-context';

export const CreateGroupDialog = () => {
  const t = useTranslations('create-group-dialog');
  const [selectedGroupStreamers, setSelectedGroupStreamers] = useState<
    SimpleStreamerType[]
  >([]);
  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [customGroups, setCustomGroups] = useCustomGroups();
  const [PinnedStreamers] = usePinnedStreamers();

  const Streamers: SimpleStreamerType[] =
    PinnedStreamers.concat(STREAMERS).flat();

  const mergedGroups = [...new Set([...GROUPS, ...customGroups])];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSearch('');
          setGroupName('');
          setSelectedGroupStreamers([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group flex h-auto max-w-[6.25rem] flex-col items-center gap-2 p-2 hover:bg-secondary/30 data-[state=on]:border-primary data-[state=on]:bg-secondary/50 sm:max-w-[8.25rem]"
        >
          <div className="flex h-20 w-20 items-center overflow-hidden rounded-xl sm:h-28 sm:w-28">
            <div className="flex max-h-24 w-full flex-wrap items-center justify-center sm:max-h-32">
              <Plus />
            </div>
          </div>
          <span>{t('title')}</span>
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
            {mergedGroups
              .map((cg) => cg.simple_name)
              .includes(groupName.toLocaleLowerCase().replaceAll(' ', '-')) && (
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
              className="scrollbar flex max-h-96 flex-wrap gap-2 overflow-y-auto"
              onValueChange={(value) => {
                const mapped = value.map(
                  (streamer) =>
                    Streamers.find((str) => str.twitch_name === streamer)!,
                );

                setSelectedGroupStreamers(mapped);
              }}
            >
              {matchSorter(Streamers, search, {
                keys: ['twitch_name', 'display_name'],
                baseSort: () => 0,
              }).map((streamer) => (
                <StreamerItem streamer={streamer} key={streamer.twitch_name} />
              ))}
            </ToggleGroup.Root>
            <p className="text-sm">
              <span className="text-muted-foreground">
                {selectedGroupStreamers.length > 0 && t('selected-streamers')}
                {selectedGroupStreamers.length === 0 &&
                  t('no-selected-streamers')}
              </span>{' '}
              {selectedGroupStreamers.map((s) => s.display_name).length > 0 &&
                selectedGroupStreamers.map((s) => s.display_name).join(', ')}
            </p>
          </section>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() =>
                setCustomGroups((old) => [
                  ...old,
                  {
                    groupName,
                    simpleGroupName: groupName
                      .toLocaleLowerCase()
                      .replaceAll(' ', '-'),
                    twitchNames: selectedGroupStreamers.map(
                      (str) => str.twitch_name,
                    ),
                    avatars: selectedGroupStreamers.map(
                      (str) => str.twitch_name,
                    ),
                    members: selectedGroupStreamers.map(
                      (str) => str.display_name,
                    ),
                  },
                ])
              }
              disabled={
                mergedGroups
                  .map((cg) => cg.simple_name)
                  .includes(
                    groupName.toLocaleLowerCase().replaceAll(' ', '-'),
                  ) ||
                groupName.trim() === '' ||
                selectedGroupStreamers.length === 0
              }
            >
              {t('submit')}
              <Plus size="1rem" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
