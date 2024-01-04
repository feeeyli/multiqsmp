'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCustomGroupsContext } from '@/contexts/custom-groups-context';
import { DialogClose } from '@radix-ui/react-dialog';
import { ArrowRight, ListOrdered } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SetStateAction, useState } from 'react';
import { getDataFromQuery } from './getDataFromQuery';
import { GroupListItem } from './list-item/group-list-item';
import { StreamerAndChatListItem } from './list-item/streamer-and-chat-list-item';
import { OrganizeDialogProvider } from './organize-context';

export type OrganizeStateStreamers = {
  name: string;
  twitchName: string;
  chatOpened: boolean;
};

export type OrganizeStateGroups = {
  name: string;
  simpleName: string;
  members: {
    name: string;
    twitchName: string;
    isHidden: boolean;
    chatOpened: boolean;
  }[];
};

type OrganizeState = {
  streamers: OrganizeStateStreamers[];
  groups: OrganizeStateGroups[];
};

export const OrganizeDialog = () => {
  const t = useTranslations('organize-dialog');
  const searchParams = useSearchParams();
  const [customGroups] = useCustomGroupsContext();

  const [streamers, groups] = getDataFromQuery(searchParams, customGroups);

  const [organizeState, setOrganizeState] = useState<OrganizeState>({
    streamers,
    groups,
  });

  function setOrganizeStateList<T>(list: keyof OrganizeState, value: T) {
    const storedValue = organizeState[list] as T[];

    const newValue = value instanceof Function ? value(storedValue) : value;

    setOrganizeState((old) => ({ ...old, [list]: newValue }));
  }

  const loaded =
    organizeState.streamers.length > 0 && organizeState.groups.length > 0;

  function getWatchUrl() {
    const url = new URLSearchParams();

    const streamers = organizeState.streamers
      .map((s) => s.twitchName)
      .join('/');

    if (streamers) url.set('streamers', streamers);

    const groups = organizeState.groups
      .map(
        (g) =>
          `${g.simpleName}${
            g.members.some((m) => m.isHidden) ? '.-' : ''
          }${g.members
            .filter((m) => m.isHidden)
            .map((m) => m.twitchName)
            .join('-')}`,
      )
      .join('/');

    if (groups) url.set('groups', groups);

    const allGroupsMembers: string[] = [];

    organizeState.groups.forEach((group) =>
      allGroupsMembers.push(
        ...group.members
          .filter((m) => m.chatOpened && !m.isHidden)
          .map((m) => m.twitchName),
      ),
    );

    const chats = Array.from(
      new Set([
        ...organizeState.streamers
          .filter((s) => s.chatOpened)
          .map((s) => s.twitchName),
        ...allGroupsMembers,
      ]),
    ).join('/');

    if (chats) url.set('chats', chats);

    return `?${String(url).replaceAll('%2F', '/')}`;
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setOrganizeState({ streamers, groups });
        } else {
          setOrganizeState({ streamers: [], groups: [] });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="z-30 px-3" size="sm">
          <ListOrdered size="1rem" className="block text-secondary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <OrganizeDialogProvider
          streamersList={[
            organizeState.streamers,
            (value: SetStateAction<OrganizeStateStreamers[]>) =>
              setOrganizeStateList('streamers', value),
          ]}
          groupsList={[
            organizeState.groups,
            (value: SetStateAction<OrganizeStateGroups[]>) =>
              setOrganizeStateList('groups', value),
          ]}
        >
          <div className="scrollbar flex max-h-[40rem] flex-col gap-3 overflow-y-auto pr-2 sm:grid sm:grid-cols-2">
            <div className="flex flex-col items-center gap-2">
              <h3>{t('streams-subtitle')}</h3>
              {organizeState.streamers.length > 0 && (
                <ul className="scrollbar max-h-[17rem] w-full space-y-2 overflow-y-auto pr-2 sm:max-h-none">
                  {organizeState.streamers.map((streamer) => (
                    <StreamerAndChatListItem
                      channel={streamer}
                      key={streamer.twitchName}
                    />
                  ))}
                </ul>
              )}
              {organizeState.streamers.length === 0 && (
                <span className="text-sm">{t('no-streams')}</span>
              )}
            </div>
            <div className="row-span-2 flex flex-col items-center gap-2">
              <h3>{t('groups-subtitle')}</h3>
              {organizeState.groups.length > 0 && (
                <ul className="scrollbar w-full space-y-2 overflow-y-auto">
                  {organizeState.groups.map((group, i) => (
                    <GroupListItem
                      group={group}
                      key={group.simpleName}
                      first={i === 0}
                    />
                  ))}
                </ul>
              )}
              {organizeState.groups.length === 0 && (
                <span className="text-sm">{t('no-groups')}</span>
              )}
            </div>
          </div>
        </OrganizeDialogProvider>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" asChild className="gap-2">
              <Link href={getWatchUrl()}>
                {t('watch')}
                <ArrowRight size="1rem" />
              </Link>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};