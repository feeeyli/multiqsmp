// Next Imports
import Image from 'next/image';

// Libs Imports
import { useTranslations } from 'next-intl';

// Types Imports
import { StreamerType } from '@/@types/data';

/// Icons Imports
import { Heart, Info } from 'lucide-react';

// Components Imports
import { Button } from '@/components/ui/button';

// Contexts Import
import { ToggleGroupItem } from '@/components/ui/toggle-group';
import { useEasterEggsContext } from '@/contexts/easter-eggs-context';
import { useSettings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';
import { getSkinHead } from '@/utils/getSkinHead';
import { cva } from 'class-variance-authority';
import { useFavoriteListsContext } from '../favorite-lists-context';

type StreamerTypeProps =
  | {
      type: 'qsmp';
      favorite?: boolean;
    }
  | {
      type: 'search';
    };

type StreamerProps = {
  streamer: StreamerType;
  isDefault?: boolean;
} & StreamerTypeProps;

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

export const Streamer = ({ isDefault = true, ...props }: StreamerProps) => {
  const t = useTranslations('streamers-dialog');
  const [
    {
      streamers: { streamersAvatar, streamStatus },
    },
  ] = useSettings();

  const { streamers: favoritesList } = useFavoriteListsContext();
  const [{ cucurucho }] = useEasterEggsContext();

  return (
    <div className="relative">
      {props.type === 'qsmp' && (
        <>
          {isDefault && (
            <Button
              size="favorite"
              variant="favorite"
              data-favorite={!!props.favorite}
              onClick={() => {
                if (favoritesList.value.includes(props.streamer.twitch_name)) {
                  favoritesList.set((old) =>
                    old.filter((s) => s !== props.streamer.twitch_name),
                  );
                } else {
                  favoritesList.set((old) => [
                    ...old,
                    props.streamer.twitch_name,
                  ]);
                }
              }}
            >
              <Heart
                size="1rem"
                className="group-data-[favorite=true]:fill-rose-400"
              />
            </Button>
          )}
          {!props.streamer.is_playing_qsmp &&
            props.streamer.is_live &&
            streamStatus.noPlaying && (
              <span className="absolute right-3 top-3 z-10 h-auto rounded-md bg-yellow-500 p-1.5 text-yellow-50 transition-all">
                <Info size="1rem" />
              </span>
            )}
        </>
      )}
      <ToggleGroupItem
        value={props.streamer.twitch_name}
        data-online={
          !streamStatus.offline || props.streamer.is_live || cucurucho
        }
        asChild
      >
        <Button
          variant="outline"
          className={cn(
            'data-[online=true]:text-foreground',
            groupVariant({
              variant: 'default',
            }),
          )}
          title={props.streamer.display_name}
        >
          {streamersAvatar === 'twitch' && (
            <Image
              src={
                cucurucho
                  ? 'https://static-cdn.jtvnw.net/jtv_user_pictures/90d53586-b538-4588-a03d-a67e9997dd9d-profile_image-300x300.png'
                  : props.streamer.avatar_url
              }
              alt={`${t('profile-image-alt')} ${props.streamer.display_name}`}
              width={96}
              height={96}
              style={{ imageRendering: cucurucho ? 'pixelated' : 'auto' }}
              className="pointer-events-none h-20 w-20 select-none rounded-md group-data-[online=false]:grayscale sm:h-28 sm:w-28"
            />
          )}
          {streamersAvatar === 'skin' && (
            <div className="flex h-20 w-20 flex-wrap items-center justify-center sm:h-28 sm:w-28">
              {getSkinHead(props.streamer.twitch_name).map((avatar) => (
                <picture
                  key={avatar}
                  style={{
                    width: `${
                      100 / getSkinHead(props.streamer.twitch_name).length
                    }%`,
                  }}
                >
                  <Image
                    src={
                      cucurucho
                        ? 'https://i.imgur.com/c1Y9KUp.png'
                        : avatar
                        ? avatar
                        : 'https://placehold.co/300x300/281f37/f9fafb.png?text=' +
                          (props.streamer.is_live ? 'o_O' : '-_-')
                    }
                    alt={`${t('profile-image-alt')} ${
                      props.streamer.display_name
                    }`}
                    width={128}
                    height={128}
                    style={{ imageRendering: cucurucho ? 'pixelated' : 'auto' }}
                    data-has-avatar={!!avatar}
                    className="pointer-events-none aspect-square data-[has-avatar=true]:group-data-[online=false]:grayscale"
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
                    : props.streamer.avatar_url
                }
                alt={`${t('profile-image-alt')} ${props.streamer.display_name}`}
                width={96}
                height={96}
                style={{ imageRendering: cucurucho ? 'pixelated' : 'auto' }}
                className="h-20 w-20 rounded-md group-data-[online=false]:grayscale sm:h-28 sm:w-28"
              />
              {isDefault && (
                <div className="absolute bottom-1 right-1 flex flex-wrap items-center justify-center border-2 border-border">
                  {getSkinHead(props.streamer.twitch_name).map((avatar) => (
                    <picture key={avatar} className="h-5 w-5 sm:h-7 sm:w-7">
                      <Image
                        src={
                          cucurucho ? 'https://i.imgur.com/c1Y9KUp.png' : avatar
                        }
                        alt={`${t('profile-image-alt')} ${
                          props.streamer.display_name
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
              )}
            </div>
          )}
          <div className="w-full overflow-x-hidden text-ellipsis group-data-[online=false]:text-muted-foreground">
            {props.streamer.display_name}
            {/* {props.streamer.invitation && (
              <span className="text-xs leading-3 opacity-70">
                P{String(props.streamer.invitation).padStart(2, '0')}
              </span>
            )} */}
          </div>
        </Button>
      </ToggleGroupItem>
    </div>
  );
};
