// React Imports
import { useContext } from 'react';

// Next Imports
import Image from 'next/image';

// Libs Imports
import { useTranslations } from 'next-intl';

// Types Imports
import { StreamerType } from '@/@types/data';

// Components Imports
import { Toggle } from '@/components/ui/toggle';

// Contexts Import
import { StreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';

interface StreamerProps {
  streamer: StreamerType;
  selected: boolean;
}

export const Streamer = (props: StreamerProps) => {
  const t = useTranslations('streamers-dialog');

  const { selectedStreamers } = useContext(StreamsSelectorDialogContext);

  return (
    /* TODO: ADD ARIA-LABEL (view doc)*/
    <Toggle
      pressed={props.selected}
      onPressedChange={() =>
        selectedStreamers.actions.toggleItem(props.streamer.twitchName, -1)
      }
      className="flex h-auto max-w-[6.25rem] flex-col items-center gap-2 border-2 bg-secondary/50 p-2 data-[state=on]:border-primary/50 data-[state=on]:bg-secondary/50 sm:max-w-[8.25rem]"
    >
      <Image
        src={props.streamer.avatarUrl}
        alt={`${t('profile-image-alt')} ${props.streamer.displayName}`}
        width={96}
        height={96}
        className="h-20 w-20 rounded-md sm:h-28 sm:w-28"
      />
      <span>{props.streamer.displayName}</span>
    </Toggle>
  );
};
