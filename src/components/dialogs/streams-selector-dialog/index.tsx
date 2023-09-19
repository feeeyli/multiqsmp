'use client';

// React Imports
import { useContext } from 'react';

// Next Imports
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
import { StreamersTab } from './tabs/streamers-tab';
import { GroupsTab } from './tabs/groups-tab';

// Contexts Import
import { StreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';

export const StreamsSelectorDialog = () => {
  const { selectedStreamers, selectedGroups } = useContext(
    StreamsSelectorDialogContext,
  );

  const t = useTranslations('streamers-dialog');

  const getWatchUrl = () => {
    const newUrl = new URLSearchParams();

    if (selectedStreamers.value.length > 0)
      newUrl.set('streamers', selectedStreamers.value.join('/'));
    if (selectedGroups.value.length > 0)
      newUrl.set('groups', selectedGroups.value.join('/'));

    return ('?' + newUrl).replaceAll('%2F', '/');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-r-none px-3" size="sm">
          <ArrowLeftRight size="1rem" className="block text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="streamers" className="w-full">
          <TabsList className="flex h-auto w-full bg-transparent px-0 pb-3 pt-0">
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
          <StreamersTab />
          <GroupsTab />
        </Tabs>
        <DialogFooter className="">
          <Button variant="ghost" asChild>
            <Link href={getWatchUrl()}>
              {t('watch')}
              <ArrowRight size="1rem" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
