'use client';

// React Imports

// Next Imports
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Datas Imports

// Libs Imports
import { useTranslations } from 'next-intl';

// Icons Imports
import { ArrowLeftRight, ArrowRight } from 'lucide-react';

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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogClose } from '@radix-ui/react-dialog';
import { StreamersTab } from './tabs/streamers-tab';

// Contexts Import
import { useStreamsSelector } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { FavoriteListsProvider } from './tabs/favorite-lists-context';

// Scripts Imports
import { Tooltip } from '@/components/ui/tooltip';
import { useQueryData } from '@/hooks/useQueryData';
import { GroupsTab } from './tabs/groups-tab';
import { SortStreamersProvider } from './tabs/streamers-tab/sort-streamers-context';

interface StreamsSelectorDialogProps {
  purgatory: boolean;
}

export const StreamsSelectorDialog = (props: StreamsSelectorDialogProps) => {
  const t = useTranslations('streamers-dialog');
  const bt = useTranslations('button-titles');
  const { selectedStreamers, selectedGroups, changedGroups } =
    useStreamsSelector();
  const searchParams = useSearchParams();
  const [streamsOnQuery, groupsOnQuery] = useQueryData();

  const getWatchUrl = () => {
    const newUrl = new URLSearchParams();

    const chats = searchParams.get('chats')?.split('/') || [];
    const newChats = chats.filter((chat) =>
      selectedStreamers.value.some((s) => s.twitch_name === chat),
    );
    const groupsOnQuery = searchParams.get('groups')?.split('/') || [];

    if (selectedStreamers.value.length > 0)
      newUrl.set(
        'streamers',
        selectedStreamers.value.map((s) => s.twitch_name).join('/'),
      );
    if (selectedGroups.value.length > 0)
      newUrl.set(
        'groups',
        [
          ...groupsOnQuery.filter(
            (g) =>
              !changedGroups.value.includes(g.split('.')[0]) &&
              selectedGroups.value.some(
                (grp) => grp.simple_name === g.split('.')[0],
              ),
          ),
          ...selectedGroups.value
            .filter((g) => changedGroups.value.includes(g.simple_name))
            .map((g) => g.simple_name),
        ].join('/'),
      );
    if (selectedStreamers.value.length > 0 && newChats.length > 0)
      newUrl.set('chats', newChats.join('/'));

    return ('?' + newUrl).replaceAll('%2F', '/');
  };

  return (
    <Dialog
      onOpenChange={() => {
        selectedStreamers.set(streamsOnQuery);
        selectedGroups.set(groupsOnQuery);
        changedGroups.set([]);
      }}
    >
      <Tooltip title={bt('aside.streams-selector-dialog')}>
        <DialogTrigger asChild>
          <Button className="px-3" size="sm">
            <ArrowLeftRight size="1rem" className="block text-secondary" />
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="streamers" className="w-full">
          <TabsList className="flex h-auto w-full bg-transparent px-0 pb-1 pt-0">
            <TabsTrigger
              value="streamers"
              className="flex-1 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary/50"
            >
              Streamers
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="flex-1 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary/50"
            >
              {t('group-tab-title')}
            </TabsTrigger>
          </TabsList>
          <FavoriteListsProvider>
            <SortStreamersProvider>
              <StreamersTab />
            </SortStreamersProvider>
            <GroupsTab />
          </FavoriteListsProvider>
        </Tabs>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <p className="text-sm">
            <span className="text-muted-foreground">
              {(selectedStreamers.value.length > 0 ||
                selectedGroups.value.length > 0) &&
                t('selected-streamers-or-groups')}
              {selectedStreamers.value.length === 0 &&
                selectedGroups.value.length === 0 &&
                t('no-selected-streamers-or-groups')}
            </span>{' '}
            {[...selectedStreamers.value, ...selectedGroups.value].map(
              (s) => s.display_name,
            ).length > 0 &&
              [...selectedStreamers.value, ...selectedGroups.value]
                .map((s) => s.display_name)
                .join(', ')}
          </p>
          <div className="flex w-full flex-row-reverse items-center">
            <DialogClose asChild>
              <Button variant="ghost" asChild className="gap-2">
                <Link href={getWatchUrl()}>
                  {t('watch')}
                  <ArrowRight size="1rem" />
                </Link>
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
