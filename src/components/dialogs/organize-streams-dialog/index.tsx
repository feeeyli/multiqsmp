'use client';

// React Imports
import { useState } from 'react';

// Next Imports
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Libs Imports
import { useTranslations } from 'next-intl';
import { Reorder } from 'framer-motion';

// Icons Imports
import { ArrowRight, ListOrdered } from 'lucide-react';

// Contexts Imports
import { useCustomGroupsContext } from '@/components/contexts/custom-groups-context';

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
import { DialogClose } from '@radix-ui/react-dialog';
import { OrganizeListItem } from './organize-list-item';

// Scripts Imports
import { getStreamersFromGroups } from '@/utils/getStreamersFromGroups';

export const OrganizeStreamsDialog = () => {
  const t = useTranslations('organize-dialog');
  const searchParams = useSearchParams();
  const [customGroups] = useCustomGroupsContext();

  const streamersOnQuery = searchParams.get('streamers')?.split('/') || [];
  const groupsOnQuery = searchParams.get('groups')?.split('/') || [];

  const streamersFromGroups = getStreamersFromGroups(
    groupsOnQuery,
    customGroups,
  );

  const actualStreams = [
    ...new Set([...streamersOnQuery, ...streamersFromGroups]),
  ];
  const actualChats = searchParams.get('chats')?.split('/') || [];

  const [newStreamsOrder, setNewStreamsOrder] = useState(actualStreams);
  const [newChatsOrder, setNewChatsOrder] = useState(actualChats);

  const getWatchUrl = () => {
    const newUrl = new URLSearchParams();

    if (newStreamsOrder.length > 0)
      newUrl.set('streamers', newStreamsOrder.join('/'));
    if (newChatsOrder.length > 0) newUrl.set('chats', newChatsOrder.join('/'));

    return ('?' + newUrl).replaceAll('%2F', '/');
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setNewStreamsOrder(actualStreams);
          setNewChatsOrder(actualChats);
        } else {
          setNewStreamsOrder([]);
          setNewChatsOrder([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="z-30 rounded-r-none px-3" size="sm">
          <ListOrdered size="1rem" className="block text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-wrap gap-3">
          <div className="flex flex-1 flex-col items-center gap-2">
            <h3>{t('streams-subtitle')}</h3>
            {newStreamsOrder.length > 0 && (
              <Reorder.Group
                axis="y"
                values={newStreamsOrder}
                onReorder={setNewStreamsOrder}
                className="flex w-full flex-col space-y-2"
              >
                {newStreamsOrder.map((stream) => (
                  <OrganizeListItem
                    key={stream}
                    channel={stream}
                    removeItem={setNewStreamsOrder}
                  />
                ))}
              </Reorder.Group>
            )}
            {newStreamsOrder.length === 0 && (
              <span className="text-sm">{t('no-streams')}</span>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <h3>{t('chats-subtitle')}</h3>
            {newChatsOrder.length > 0 && (
              <Reorder.Group
                axis="y"
                values={newChatsOrder}
                onReorder={setNewChatsOrder}
                className="flex w-full flex-col space-y-2"
              >
                {newChatsOrder.map((stream) => (
                  <OrganizeListItem
                    key={stream}
                    channel={stream}
                    removeItem={setNewChatsOrder}
                  />
                ))}
              </Reorder.Group>
            )}
            {newChatsOrder.length === 0 && (
              <span className="text-sm">{t('no-chats')}</span>
            )}
          </div>
        </div>
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
