// React Imports
import { useEffect, useState } from 'react';

// Types Imports
import { StreamResponseType } from '@/@types/StreamResponseType';

// Data Imports
import { STREAMERS } from '@/data/streamers';

// Components Imports
import { TabsContent } from '@/components/ui/tabs';
import { Streamer } from '../streamer';
import { Separator } from '@/components/ui/separator';

// Contexts Import
import { useStreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { useFavoriteListsContext } from './favorite-lists-context';

// Scripts Imports
import { sortStreamers } from '@/utils/sort';

type OnlineStreamerType = { twitchName: string; isPlayingQsmp: boolean };

export const StreamersTab = () => {
  const { selectedStreamers } = useStreamsSelectorDialogContext();
  const { streamers: favoritesList } = useFavoriteListsContext();
  const [onlineStreamers, setOnlineStreamers] = useState<OnlineStreamerType[]>(
    [],
  );

  useEffect(() => {
    (async () => {
      const twitchStreamers = STREAMERS.filter(
        (streamer) => !['willyrex', 'vegetta777'].includes(streamer.twitchName),
      )
        .map((streamer) => `user_login=${streamer.twitchName}`)
        .join('&');

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

  const favoriteStreamers = sortStreamers(
    STREAMERS.filter((item) => favoritesList.value.includes(item.twitchName)),
  );
  const nonFavoriteStreamers = STREAMERS.filter(
    (item) => !favoritesList.value.includes(item.twitchName),
  );

  return (
    <TabsContent
      value="streamers"
      className="scrollbar flex max-h-80 flex-col gap-3 overflow-y-auto pb-3 pt-2 data-[state=inactive]:hidden"
    >
      <div className="flex w-full flex-wrap justify-center gap-3">
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
      <div className="flex w-full flex-wrap justify-center gap-3">
        {nonFavoriteStreamers.map((streamer) => {
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
            />
          );
        })}
      </div>
    </TabsContent>
  );
};
