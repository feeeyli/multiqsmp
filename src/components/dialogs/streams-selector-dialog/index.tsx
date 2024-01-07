'use client';

// React Imports
import { useState } from 'react';

// Next Imports
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Datas Imports
import { GROUPS as DEFAULT_GROUPS, PURGATORY_GROUPS } from '@/data/groups';
import {
  STREAMERS as DEFAULT_STREAMERS,
  PURGATORY_STREAMERS,
} from '@/data/streamers';

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
import { GroupsTab } from './tabs/groups-tab';
import { StreamersTab } from './tabs/streamers-tab/streamers-tab';

// Contexts Import
import { useStreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { useCustomGroupsContext } from '@/contexts/custom-groups-context';
import { FavoriteListsProvider } from './tabs/favorite-lists-context';

// Scripts Imports
import { useSettingsContext } from '@/contexts/settings-context';
import { getDisplayName } from '@/utils/getDisplayName';
import { SortStreamersProvider } from './tabs/streamers-tab/sort-streamers-context';

interface StreamsSelectorDialogProps {
  purgatory: boolean;
}

export const StreamsSelectorDialog = (props: StreamsSelectorDialogProps) => {
  const t = useTranslations('streamers-dialog');
  const bt = useTranslations('button-titles');
  const { selectedStreamers, selectedGroups, changedGroups } =
    useStreamsSelectorDialogContext();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<string>('streamers');
  const [customGroups] = useCustomGroupsContext();
  const [
    {
      streamers: {
        outro: { showOpposite },
      },
    },
  ] = useSettingsContext();

  const STREAMERS = showOpposite
    ? [
        ...PURGATORY_STREAMERS,
        ...DEFAULT_STREAMERS.filter(
          (s) =>
            !PURGATORY_STREAMERS.find((ps) => ps.twitchName === s.twitchName),
        ),
      ]
    : props.purgatory
    ? PURGATORY_STREAMERS
    : DEFAULT_STREAMERS;
  const GROUPS = props.purgatory ? PURGATORY_GROUPS : DEFAULT_GROUPS;

  const getWatchUrl = () => {
    const newUrl = new URLSearchParams();

    const chats = searchParams.get('chats')?.split('/') || [];
    const newChats = chats.filter((chat) =>
      selectedStreamers.value.includes(chat),
    );
    const groupsOnQuery = searchParams.get('groups')?.split('/') || [];

    if (selectedStreamers.value.length > 0)
      newUrl.set('streamers', selectedStreamers.value.join('/'));
    if (selectedGroups.value.length > 0)
      newUrl.set(
        'groups',
        [
          ...groupsOnQuery.filter(
            (g) =>
              !changedGroups.value.includes(g.split('.')[0]) &&
              selectedGroups.value.includes(g.split('.')[0]),
          ),
          ...selectedGroups.value.filter((g) =>
            changedGroups.value.includes(g),
          ),
        ].join('/'),
      );
    if (selectedStreamers.value.length > 0 && newChats.length > 0)
      newUrl.set('chats', newChats.join('/'));

    return ('?' + newUrl).replaceAll('%2F', '/');
  };

  return (
    <Dialog
      onOpenChange={() => {
        selectedStreamers.actions.updateList(
          searchParams.get('streamers')?.split('/') || [],
        );
        selectedGroups.actions.updateList(
          searchParams
            .get('groups')
            ?.split('/')
            .map((g) => g.split('.')[0]) || [],
        );
        changedGroups.actions.updateList([]);
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="px-3"
          size="sm"
          title={bt('aside.streams-selector-dialog')}
        >
          <ArrowLeftRight size="1rem" className="block text-secondary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="streamers"
          className="w-full"
          onValueChange={setTab}
        >
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
              <StreamersTab STREAMERS={STREAMERS} />
            </SortStreamersProvider>
            <GroupsTab
              GROUPS={GROUPS}
              STREAMERS={STREAMERS}
              purgatory={props.purgatory}
            />
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
            {[...selectedStreamers.value, ...selectedGroups.value].map((s) =>
              getDisplayName(s, customGroups),
            ).length > 0 &&
              [...selectedStreamers.value, ...selectedGroups.value]
                .map((s) => getDisplayName(s, customGroups))
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
