// React Imports
import { useEffect, useState } from 'react';

// Types Imports
import { StreamResponseType } from '@/@types/StreamResponseType';

// Data Imports
// import { STREAMERS } from '@/data/streamers';

// Components Imports
import { TabsContent } from '@/components/ui/tabs';
import { Streamer } from '../streamer';
import { Separator } from '@/components/ui/separator';

// Contexts Import
import { useStreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { useFavoriteListsContext } from './favorite-lists-context';

// Scripts Imports
import { sortStreamers } from '@/utils/sort';
import { useTranslations } from 'next-intl';
import { useSettingsContext } from '@/contexts/settings-context';
import { StreamerType } from '@/@types/data';

type OnlineStreamerType = { twitchName: string; isPlayingQsmp: boolean };

interface StreamersTabProps {
  STREAMERS: StreamerType[];
}

export const StreamersTab = ({ STREAMERS }: StreamersTabProps) => {
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

    if (
      ['willyrex', 'vegetta777'].includes(streamer.twitchName) ||
      selectedStreamers.value.includes(streamer.twitchName)
    )
      return true;

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
      className="scrollbar flex max-h-80 flex-col gap-3 overflow-y-auto pb-3 pt-2 data-[state=inactive]:hidden"
    >
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
                    isYoutubeStream={['willyrex', 'vegetta777'].includes(
                      streamer.twitchName,
                    )}
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
              isYoutubeStream={['willyrex', 'vegetta777'].includes(
                streamer.twitchName,
              )}
              favorite
            />
          );
        })}
      </div>
      {favoriteStreamers.length > 0 && nonFavoriteStreamers.length > 0 && (
        <Separator />
      )}
      <div className="flex w-full flex-wrap justify-center gap-4">
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
              isYoutubeStream={['willyrex', 'vegetta777'].includes(
                streamer.twitchName,
              )}
            />
          );
        })}
      </div>
    </TabsContent>
  );
};
