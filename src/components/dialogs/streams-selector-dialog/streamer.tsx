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
import { useEasterEggsContext } from '@/contexts/easter-eggs-context';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { GROUPS } from '@/data/groups';
import { getTeamByName } from '@/utils/getTeamByName';

interface StreamerProps {
  streamer: StreamerType;
  selected: boolean;
  favorite?: boolean;
  isOnline: boolean;
  isPlayingQsmp: boolean;
}

const groupVariant = cva(
  'group flex h-auto max-w-[6.25rem] flex-col items-center gap-2 p-2 sm:max-w-[8.25rem]',
  {
    variants: {
      variant: {
        default:
          'hover:bg-secondary/30 data-[state=on]:border-primary data-[state=on]:bg-secondary/50',
        red: 'bg-red-950/40 hover:bg-red-950/80 text-red-50 hover:text-red-50/80 border-red-900 data-[state=on]:border-red-500 data-[state=on]:bg-red-900/50',
        blue: 'bg-blue-950/40 hover:bg-blue-950/80 text-blue-50 hover:text-blue-50/80 border-blue-900 data-[state=on]:border-blue-500 data-[state=on]:bg-blue-900/50',
        green:
          'bg-green-950/40 hover:bg-green-950/80 text-green-50 hover:text-green-50/80 border-green-900 data-[state=on]:border-green-500 data-[state=on]:bg-green-900/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const Streamer = (props: StreamerProps) => {
  const t = useTranslations('streamers-dialog');
  const [
    {
      streamers: { streamersAvatar, streamStatus },
    },
  ] = useSettingsContext();

  const { selectedStreamers } = useStreamsSelectorDialogContext();
  const { streamers: favoritesList } = useFavoriteListsContext();
  const [{ cucurucho }] = useEasterEggsContext();

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
      {!props.isPlayingQsmp && props.isOnline && streamStatus.noPlaying && (
        <span className="absolute right-3 top-3 z-10 h-auto rounded-md bg-yellow-500 p-1.5 text-yellow-50 transition-all">
          <Info size="1rem" />
        </span>
      )}
      <Toggle
        pressed={props.selected}
        onPressedChange={() =>
          selectedStreamers.actions.toggleItem(props.streamer.twitchName, -1)
        }
        data-online={!streamStatus.offline || props.isOnline || cucurucho}
        asChild
      >
        <Button
          variant="outline"
          className={cn(
            groupVariant({
              variant: 'default',
            }),
          )}
        >
          {streamersAvatar === 'twitch' && (
            <Image
              src={
                cucurucho
                  ? 'https://static-cdn.jtvnw.net/jtv_user_pictures/90d53586-b538-4588-a03d-a67e9997dd9d-profile_image-300x300.png'
                  : props.streamer.avatarUrl
              }
              alt={`${t('profile-image-alt')} ${props.streamer.displayName}`}
              width={96}
              height={96}
              style={{ imageRendering: cucurucho ? 'pixelated' : 'auto' }}
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
                    src={cucurucho ? 'https://i.imgur.com/c1Y9KUp.png' : avatar}
                    alt={`${t('profile-image-alt')} ${
                      props.streamer.displayName
                    }`}
                    width={128}
                    height={128}
                    style={{ imageRendering: cucurucho ? 'pixelated' : 'auto' }}
                    className="pointer-events-none aspect-square group-data-[online=false]:grayscale"
                  />
                </picture>
              ))}
            </div>
          )}
          {streamersAvatar === 'both' && (
            <div className="relative">
              <Image
                src={
                  cucurucho
                    ? 'https://i.imgur.com/c1Y9KUp.png'
                    : props.streamer.avatarUrl
                }
                alt={`${t('profile-image-alt')} ${props.streamer.displayName}`}
                width={96}
                height={96}
                style={{ imageRendering: cucurucho ? 'pixelated' : 'auto' }}
                className="h-20 w-20 rounded-md group-data-[online=false]:grayscale sm:h-28 sm:w-28"
              />
              <div className="absolute bottom-1 right-1 flex flex-wrap items-center justify-center border-2 border-border">
                {getSkinHead(props.streamer.twitchName).map((avatar) => (
                  <picture key={avatar} className="h-5 w-5 sm:h-7 sm:w-7">
                    <Image
                      src={
                        cucurucho ? 'https://i.imgur.com/c1Y9KUp.png' : avatar
                      }
                      alt={`${t('profile-image-alt')} ${
                        props.streamer.displayName
                      }`}
                      width={128}
                      height={128}
                      style={{
                        imageRendering: cucurucho ? 'pixelated' : 'auto',
                      }}
                      className="pointer-events-none aspect-square group-data-[online=false]:grayscale"
                    />
                  </picture>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 group-data-[online=false]:text-muted-foreground">
            <span>{props.streamer.displayName}</span>
            {/* {props.streamer.invitation && (
              <span className="text-xs leading-3 opacity-70">
                #{String(props.streamer.invitation).padStart(3, '0')}
              </span>
            )} */}
          </div>
        </Button>
      </Toggle>
    </div>
  );
};
