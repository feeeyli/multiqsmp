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
import { useFavoriteListsContext } from './tabs/favorite-lists-context';

// Scripts Imports
import { getSkinHead } from '@/utils/getSkinHead';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface GroupProps {
  group: GroupType;
  selected: boolean;
  favorite?: boolean;
}

export const Group = (props: GroupProps) => {
  const { selectedGroups } = useContext(StreamsSelectorDialogContext);
  const { groups: favoritesList } = useFavoriteListsContext();

  const t = useTranslations('streamers-dialog');

  const cols = [3, 4].includes(props.group.avatars.length)
    ? 2
    : [5, 6, 8, 9].includes(props.group.avatars.length)
    ? 3
    : 4;

  return (
    /* TODO: ADD ARIA-LABEL (view doc)*/
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
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
        className="group absolute left-3 top-3 z-10 h-auto border border-border bg-muted/30 p-1.5 text-border transition-all hover:border-rose-900 hover:bg-rose-800/50 hover:text-rose-900 data-[favorite=true]:border-rose-900 data-[favorite=true]:bg-rose-700 data-[favorite=true]:text-rose-400"
      >
        <Heart
          size="1rem"
          className="group-data-[favorite=true]:fill-rose-400"
        />
      </Button>
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
