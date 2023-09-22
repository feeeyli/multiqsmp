// React Imports
import { useContext } from 'react';

// Next Imports
import Image from 'next/image';

// Libs Imports
import { useTranslations } from 'next-intl';

// Types Imports
import { GroupType } from '@/@types/data';

// Icons Imports
import { Heart } from 'lucide-react';

// Components Imports
import { Toggle } from '@/components/ui/toggle';
import { DeleteGroupDialog } from '../delete-group-dialog';
import { Button } from '@/components/ui/button';

// Contexts Import
import { useStreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { useFavoriteListsContext } from './tabs/favorite-lists-context';

// Scripts Imports
import { getSkinHead } from '@/utils/getSkinHead';

interface GroupProps {
  group: GroupType;
  selected: boolean;
  favorite?: boolean;
  custom?: boolean;
}

export const Group = (props: GroupProps) => {
  const { selectedGroups } = useStreamsSelectorDialogContext();
  const { groups: favoritesList } = useFavoriteListsContext();

  const t = useTranslations('streamers-dialog');

  const cols =
    props.group.avatars.length === 1
      ? 1
      : [2, 3, 4].includes(props.group.avatars.length)
      ? 2
      : [5, 6, 8, 9].includes(props.group.avatars.length)
      ? 3
      : 4;

  return (
    /* TODO: ADD ARIA-LABEL (view doc)*/
    <div className="relative">
      <Button
        size="favorite"
        variant="favorite"
        data-favorite={!!props.favorite}
        onClick={() => {
          if (favoritesList.value.includes(props.group.simpleGroupName)) {
            favoritesList.set((old) =>
              old.filter((s) => s !== props.group.simpleGroupName),
            );
          } else {
            favoritesList.set((old) => [...old, props.group.simpleGroupName]);
          }
        }}
      >
        <Heart
          size="1rem"
          className="group-data-[favorite=true]:fill-rose-400"
        />
      </Button>
      {props.custom && <DeleteGroupDialog group={props.group} />}
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
                  src={getSkinHead(avatar)[0]}
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
    </div>
  );
};
