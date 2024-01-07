// React Imports
import { useEffect, useState } from 'react';

// Types Imports
import { StreamResponseType } from '@/@types/StreamResponseType';

// Data Imports
import {
  STREAMERS as DEFAULT_STREAMERS,
  PURGATORY_STREAMERS,
} from '@/data/streamers';

// Components Imports
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { Streamer } from '../../streamer';

// Contexts Import
import { useStreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { useFavoriteListsContext } from '../favorite-lists-context';

// Scripts Imports
import { StreamerType } from '@/@types/data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettingsContext } from '@/contexts/settings-context';
import { sortStreamers } from '@/utils/sort';
import { useTranslations } from 'next-intl';
import { SelectStreamersDropdown } from './select-streamers-dropdown';
import { SortStreamers } from './sort-streamers';
import { StreamersList } from './streamers-list';

export type OnlineStreamerType = { twitchName: string; isPlayingQsmp: boolean };

interface StreamersTabProps {
  STREAMERS: StreamerType[];
}

export const StreamersTab = ({
  STREAMERS: STREAMERS_LIST,
}: StreamersTabProps) => {
  const t = useTranslations('streamers-dialog');
  const [
    {
      streamers: { outro },
    },
  ] = useSettingsContext();
  const { selectedStreamers } = useStreamsSelectorDialogContext();
  const { streamers: favoritesList } = useFavoriteListsContext();
  const [onlineStreamers, setOnlineStreamers] = useState<OnlineStreamerType[]>(
    [],
  );
  const [search, setSearch] = useState('');

  const SELECTED_STREAMERS = [
    ...new Set([...DEFAULT_STREAMERS, ...PURGATORY_STREAMERS]),
  ].filter(
    (s) =>
      selectedStreamers.value.includes(s.twitchName) &&
      !STREAMERS_LIST.find((st) => st.twitchName === s.twitchName),
  );

  const STREAMERS = [
    ...new Set([...SELECTED_STREAMERS, ...STREAMERS_LIST]),
  ].filter(
    (s) =>
      s.twitchName.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      s.displayName.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );

  useEffect(() => {
    (async () => {
      /*.filter(
        (streamer) => !['willyrex', 'vegetta777'].includes(streamer.twitchName),
      )*/

      const twitchStreamers = STREAMERS.map(
        (streamer) => `user_login=${streamer.twitchName}`,
      ).join('&');

      const response = await fetch(
        'https://api.twitch.tv/helix/streams?' + twitchStreamers,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITCH_SECRET}`,
            'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          },
        },
      );

      const data: { data: StreamResponseType[] } = await response.json();

      setOnlineStreamers(
        data.data.map((stream) => ({
          twitchName: stream.user_login,
          isPlayingQsmp:
            /(qsmp)|(minecraft)/i.test(stream.tags?.join(',') || '') ||
            stream.game_name === 'Minecraft',
        })),
      );
    })();
  }, []);

  const newParticipants =
    process.env.NEXT_PUBLIC_NEW_PARTICIPANTS?.split('/') || [];

  const newParticipantsStreamers = STREAMERS.filter((item) =>
    newParticipants.includes(item.twitchName),
  );

  const streamersWithHide = STREAMERS.filter((streamer) => {
    const stream = onlineStreamers.find(
      (online) =>
        online.twitchName.toLocaleLowerCase() ===
        streamer.twitchName.toLocaleLowerCase(),
    );

    if (selectedStreamers.value.includes(streamer.twitchName)) return true;

    if (
      (outro.hideOffline && !stream) ||
      (outro.hideNotPlaying && !stream?.isPlayingQsmp && !!stream)
    )
      return false;

    return true;
  });

  const favoriteStreamers = sortStreamers(
    streamersWithHide.filter(
      (item) =>
        favoritesList.value.includes(item.twitchName) &&
        !newParticipants.includes(item.twitchName),
    ),
  );
  const nonFavoriteStreamers = streamersWithHide.filter(
    (item) =>
      !favoritesList.value.includes(item.twitchName) &&
      !newParticipants.includes(item.twitchName),
  );

  return (
    <TabsContent
      value="streamers"
      className="scrollbar relative flex max-h-80 flex-col gap-3 overflow-y-auto pb-3 data-[state=inactive]:hidden"
    >
      <header className="sticky top-0 z-20 flex w-full items-center gap-3 bg-background pb-4 pl-2 pr-4 pt-2">
        <SelectStreamersDropdown
          streamersWithHide={streamersWithHide}
          onlineStreamers={onlineStreamers}
        />
        <SortStreamers />
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
      <div className="flex w-full flex-wrap justify-center gap-4">
        {newParticipantsStreamers.length > 0 && (
          <div className="flex w-full flex-col items-center gap-4">
            <span className="font-bold text-primary">
              {t(
                newParticipantsStreamers.length === 1
                  ? 'new-participant'
                  : 'new-participants',
              )}
            </span>
            <div className="flex flex-wrap gap-4">
              {newParticipantsStreamers.map((streamer) => {
                const stream = onlineStreamers.find(
                  (online) =>
                    online.twitchName.toLocaleLowerCase() ===
                    streamer.twitchName.toLocaleLowerCase(),
                );
                return (
                  <Streamer
                    key={streamer.twitchName}
                    streamer={streamer}
                    selected={selectedStreamers.value.includes(
                      streamer.twitchName,
                    )}
                    isOnline={!!stream}
                    isPlayingQsmp={!!stream?.isPlayingQsmp}
                    favorite={favoritesList.value.includes(streamer.twitchName)}
                  />
                );
              })}
            </div>
            <Separator />
          </div>
        )}
        {favoriteStreamers.map((streamer) => {
          const stream = onlineStreamers.find(
            (online) =>
              online.twitchName.toLocaleLowerCase() ===
              streamer.twitchName.toLocaleLowerCase(),
          );

          return (
            <Streamer
              key={streamer.twitchName}
              streamer={streamer}
              selected={selectedStreamers.value.includes(streamer.twitchName)}
              isOnline={!!stream}
              isPlayingQsmp={!!stream?.isPlayingQsmp}
              favorite
            />
          );
        })}
      </div>
      {favoriteStreamers.length > 0 && nonFavoriteStreamers.length > 0 && (
        <Separator />
      )}
      <StreamersList
        streamers={nonFavoriteStreamers}
        onlineStreamers={onlineStreamers}
      />
    </TabsContent>
  );
};
