// React Imports
import { useContext, useEffect, useState } from 'react';

// Data Imports
import { STREAMERS } from '@/data/streamers';

// Libs Imports
import { useReadLocalStorage } from 'usehooks-ts';

// Components Imports
import { TabsContent } from '@/components/ui/tabs';
import { Streamer } from '../streamer';

// Contexts Import
import { StreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { useFavoriteListsContext } from './favorite-lists-context';
import { Separator } from '@/components/ui/separator';
import { StreamResponseType } from '@/@types/StreamResponseType';

type OnlineStreamerType = { twitchName: string; isPlayingQsmp: boolean };

export const StreamersTab = () => {
  const { selectedStreamers } = useContext(StreamsSelectorDialogContext);
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

  const favoriteStreamers = STREAMERS.filter((item) =>
    favoritesList.value.includes(item.twitchName),
  );
  const nonFavoriteStreamers = STREAMERS.filter(
    (item) => !favoritesList.value.includes(item.twitchName),
  );

  return (
    <TabsContent
      value="streamers"
      className="scrollbar flex max-h-80 flex-col gap-2 overflow-y-auto"
    >
      <div className="flex w-full flex-wrap justify-center gap-2">
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
      <div className="flex w-full flex-wrap justify-center gap-2">
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
