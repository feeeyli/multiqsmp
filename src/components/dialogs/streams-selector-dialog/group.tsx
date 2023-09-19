// React Imports
import { useContext } from 'react';

// Next Imports
import Image from 'next/image';

// Libs Imports
import { useTranslations } from 'next-intl';

// Types Imports
import { GroupType } from '@/@types/data';

// Components Imports
import { Toggle } from '@/components/ui/toggle';

// Contexts Import
import { StreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';

// Scripts Imports
import { getSkinHead } from '@/utils/getSkinHead';

interface GroupProps {
  group: GroupType;
  selected: boolean;
}

export const Group = (props: GroupProps) => {
  const { selectedGroups } = useContext(StreamsSelectorDialogContext);

  const t = useTranslations('streamers-dialog');

  const cols = [3, 4].includes(props.group.avatars.length)
    ? 2
    : [5, 6, 8, 9].includes(props.group.avatars.length)
    ? 3
    : 4;

  return (
    /* TODO: ADD ARIA-LABEL (view doc)*/
    <Toggle
      pressed={props.selected}
      onPressedChange={() =>
        selectedGroups.actions.toggleItem(props.group.simpleGroupName, -1)
      }
      className="flex h-auto max-w-[6.25rem] flex-col items-center gap-2 border-2 bg-secondary/50 p-2 data-[state=on]:border-primary/50 data-[state=on]:bg-secondary/50 sm:max-w-[8.25rem]"
    >
      <div className="flex h-20 w-20 items-center overflow-hidden rounded-xl sm:h-28 sm:w-28">
        <div className="flex max-h-24 w-full flex-wrap justify-center sm:max-h-32">
          {props.group.avatars.map((avatar) => (
            <picture
              key={avatar}
              style={{
                width: `${100 / cols}%`,
              }}
            >
              <Image
                src={getSkinHead(avatar)}
                alt={`${t('profile-image-alt')} ${avatar}`}
                width={128}
                height={128}
                className="pointer-events-none aspect-square group-data-[online=false]:grayscale"
              />
            </picture>
          ))}
        </div>
      </div>
      <span>{props.group.groupName}</span>
    </Toggle>
  );
};
