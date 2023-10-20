// Next Imports
import Image from 'next/image';

// Libs Imports
import { useTranslations } from 'next-intl';

// Types Imports
import { StreamerType } from '@/@types/data';

/// Icons Imports
import { Heart, Info, Youtube } from 'lucide-react';

// Components Imports
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';

// Contexts Import
import { useStreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { useFavoriteListsContext } from './tabs/favorite-lists-context';
import { useSettingsContext } from '@/contexts/settings-context';
import { getSkinHead } from '@/utils/getSkinHead';

interface StreamerProps {
  streamer: StreamerType;
  selected: boolean;
  favorite?: boolean;
  isOnline: boolean;
  isPlayingQsmp: boolean;
  isYoutubeStream: boolean;
}

export const Streamer = (props: StreamerProps) => {
  const t = useTranslations('streamers-dialog');
  const [
    {
      streamers: { streamersAvatar, streamStatus },
    },
  ] = useSettingsContext();

  const { selectedStreamers } = useStreamsSelectorDialogContext();
  const { streamers: favoritesList } = useFavoriteListsContext();

  return (
    /* TODO: ADD ARIA-LABEL (view doc)*/
    <div className="relative">
      <Button
        size="favorite"
        variant="favorite"
        data-favorite={!!props.favorite}
        onClick={() => {
          if (favoritesList.value.includes(props.streamer.twitchName)) {
            favoritesList.set((old) =>
              old.filter((s) => s !== props.streamer.twitchName),
            );
          } else {
            favoritesList.set((old) => [...old, props.streamer.twitchName]);
          }
        }}
      >
        <Heart
          size="1rem"
          className="group-data-[favorite=true]:fill-rose-400"
        />
      </Button>
      {!props.isPlayingQsmp &&
        props.isOnline &&
        !props.isYoutubeStream &&
        streamStatus.noPlaying && (
          <span className="absolute right-3 top-3 z-10 h-auto rounded-md bg-yellow-500 p-1.5 text-yellow-50 transition-all">
            <Info size="1rem" />
          </span>
        )}
      {props.isYoutubeStream && (
        <span className="absolute right-3 top-3 z-10 h-auto rounded-md bg-red-500 p-1.5 text-red-50 transition-all">
          <Youtube size="1rem" />
        </span>
      )}
      <Toggle
        pressed={props.selected}
        onPressedChange={() =>
          selectedStreamers.actions.toggleItem(props.streamer.twitchName, -1)
        }
        data-online={
          !streamStatus.offline || props.isYoutubeStream || props.isOnline
        }
        asChild
      >
        <Button
          variant="outline"
          className="group flex h-auto max-w-[6.25rem] flex-col items-center gap-2 p-2 hover:bg-secondary/30 data-[state=on]:border-primary data-[state=on]:bg-secondary/50 sm:max-w-[8.25rem]"
        >
          {streamersAvatar === 'twitch' && (
            <Image
              src={props.streamer.avatarUrl}
              alt={`${t('profile-image-alt')} ${props.streamer.displayName}`}
              width={96}
              height={96}
              className="pointer-events-none h-20 w-20 select-none rounded-md group-data-[online=false]:grayscale sm:h-28 sm:w-28"
            />
          )}
          {streamersAvatar === 'skin' && (
            <div className="flex h-20 w-20 flex-wrap items-center justify-center sm:h-28 sm:w-28">
              {getSkinHead(props.streamer.twitchName).map((avatar) => (
                <picture
                  key={avatar}
                  style={{
                    width: `${
                      100 / getSkinHead(props.streamer.twitchName).length
                    }%`,
                  }}
                >
                  <Image
                    src={avatar}
                    alt={`${t('profile-image-alt')} ${
                      props.streamer.displayName
                    }`}
                    width={128}
                    height={128}
                    className="pointer-events-none aspect-square group-data-[online=false]:grayscale"
                  />
                </picture>
              ))}
            </div>
          )}
          {streamersAvatar === 'both' && (
            <div className="relative">
              <Image
                src={props.streamer.avatarUrl}
                alt={`${t('profile-image-alt')} ${props.streamer.displayName}`}
                width={96}
                height={96}
                className="h-20 w-20 rounded-md group-data-[online=false]:grayscale sm:h-28 sm:w-28"
              />
              <div className="absolute bottom-1 right-1 flex flex-wrap items-center justify-center border-2 border-border">
                {getSkinHead(props.streamer.twitchName).map((avatar) => (
                  <picture key={avatar} className="h-5 w-5 sm:h-7 sm:w-7">
                    <Image
                      src={avatar}
                      alt={`${t('profile-image-alt')} ${
                        props.streamer.displayName
                      }`}
                      width={128}
                      height={128}
                      className="pointer-events-none aspect-square group-data-[online=false]:grayscale"
                    />
                  </picture>
                ))}
              </div>
            </div>
          )}
          <span className="group-data-[online=false]:text-muted-foreground">
            {props.streamer.displayName}
          </span>
        </Button>
      </Toggle>
    </div>
  );
};
