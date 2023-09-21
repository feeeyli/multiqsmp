// Next Imports
import Image from 'next/image';

// Libs Imports
import { useTranslations } from 'next-intl';

// Types Imports
import { StreamerType } from '@/@types/data';

// Components Imports
import { Toggle } from '@/components/ui/toggle';

// Contexts Import
import { useStreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { useFavoriteListsContext } from './tabs/favorite-lists-context';
import { Heart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreamerProps {
  streamer: StreamerType;
  selected: boolean;
  favorite?: boolean;
  isOnline: boolean;
  isPlayingQsmp: boolean;
}

export const Streamer = (props: StreamerProps) => {
  const t = useTranslations('streamers-dialog');

  const { selectedStreamers } = useStreamsSelectorDialogContext();
  const { streamers: favoritesList } = useFavoriteListsContext();

  return (
    /* TODO: ADD ARIA-LABEL (view doc)*/
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
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
        className="group absolute left-3 top-3 z-10 h-auto border border-border bg-muted/30 p-1.5 text-border transition-all hover:border-rose-900 hover:bg-rose-800/50 hover:text-rose-900 data-[favorite=true]:border-rose-900 data-[favorite=true]:bg-rose-700 data-[favorite=true]:text-rose-400"
      >
        <Heart
          size="1rem"
          className="group-data-[favorite=true]:fill-rose-400"
        />
      </Button>
      {!props.isPlayingQsmp && props.isOnline && (
        <span className="absolute right-3 top-3 z-10 h-auto rounded-md border border-border border-yellow-800 bg-muted/30 bg-yellow-600 p-1.5 text-border text-yellow-300 transition-all">
          <Info size="1rem" />
        </span>
      )}
      <Toggle
        pressed={props.selected}
        onPressedChange={() =>
          selectedStreamers.actions.toggleItem(props.streamer.twitchName, -1)
        }
        data-online={props.isOnline}
        className="group flex h-auto max-w-[6.25rem] flex-col items-center gap-2 border-2 bg-secondary/50 p-2 data-[state=on]:border-primary/50 data-[state=on]:bg-secondary/50 sm:max-w-[8.25rem]"
      >
        <Image
          src={props.streamer.avatarUrl}
          alt={`${t('profile-image-alt')} ${props.streamer.displayName}`}
          width={96}
          height={96}
          className="h-20 w-20 rounded-md group-data-[online=false]:grayscale sm:h-28 sm:w-28"
        />
        <span className="group-data-[online=false]:text-muted-foreground">
          {props.streamer.displayName}
        </span>
      </Toggle>
    </div>
  );
};
