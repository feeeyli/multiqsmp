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
import { EditGroupDialog } from '../edit-group-dialog';
import { useEasterEggsContext } from '@/contexts/easter-eggs-context';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface GroupProps {
  group: GroupType;
  selected: boolean;
  favorite?: boolean;
  custom?: boolean;
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

const teams: {
  'Green Team': 'green';
  'Red Team': 'red';
  'Blue Team': 'blue';
} = {
  'Green Team': 'green',
  'Red Team': 'red',
  'Blue Team': 'blue',
};

export const Group = (props: GroupProps) => {
  const { selectedGroups } = useStreamsSelectorDialogContext();
  const { groups: favoritesList } = useFavoriteListsContext();

  const t = useTranslations('streamers-dialog');
  const [{ cucurucho }] = useEasterEggsContext();

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
      {props.custom && (
        <>
          <EditGroupDialog group={props.group} />
        </>
      )}
      <Toggle
        pressed={props.selected}
        onPressedChange={() =>
          selectedGroups.actions.toggleItem(props.group.simpleGroupName, -1)
        }
        asChild
      >
        <Button
          variant="outline"
          className={cn(
            groupVariant({
              variant: teams[props.group.groupName as keyof typeof teams]
                ? teams[props.group.groupName as keyof typeof teams]
                : 'default',
            }),
          )}
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
                    src={
                      cucurucho
                        ? 'https://i.imgur.com/c1Y9KUp.png'
                        : getSkinHead(avatar)[0]
                    }
                    alt={`${t('profile-image-alt')} ${avatar}`}
                    width={128}
                    height={128}
                    style={{ imageRendering: cucurucho ? 'pixelated' : 'auto' }}
                    className="pointer-events-none aspect-square"
                  />
                </picture>
              ))}
            </div>
          </div>
          <span>{props.group.groupName}</span>
        </Button>
      </Toggle>
    </div>
  );
};
