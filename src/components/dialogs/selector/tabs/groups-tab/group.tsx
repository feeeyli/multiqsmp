import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { GroupType } from '@/@types/data';

import { Eye, EyeOff, Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useStreamsSelector } from '@/components/dialogs/selector/selector-dialog-context';
import { useFavoriteListsContext } from '../favorite-lists-context';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ToggleGroupItem } from '@/components/ui/toggle-group';
import { useEasterEggsContext } from '@/contexts/easter-eggs-context';
import { cn } from '@/lib/utils';
import { getSkinHead } from '@/utils/getSkinHead';
import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import { EditGroupDialog } from '../../../edit-group/edit-group-dialog';

interface GroupProps {
  group: GroupType &
    (GroupType & {
      hidedMembers: {
        display_name: string;
        twitch_name: string;
      }[];
    });
  favorite?: boolean;
  custom?: boolean;
}

const groupVariant = cva(
  'group flex h-auto max-w-[6.25rem] flex-col items-center gap-2 p-2 sm:max-w-[8.25rem] text-foreground',
  {
    variants: {
      variant: {
        default:
          'hover:bg-secondary/30 data-[state=on]:border-primary data-[state=on]:bg-secondary/50',
        squirrel:
          'border bg-squirrel-secondary/20 hover:bg-squirrel-secondary/30 border-squirrel/60 data-[state=on]:bg-squirrel/40',
        crab: 'border bg-crab-secondary/20 hover:bg-crab-secondary/30 border-crab/60 data-[state=on]:bg-crab/40',
        capybara:
          'border bg-capybara-secondary/20 hover:bg-capybara-secondary/30 border-capybara/60 data-[state=on]:bg-capybara/40',
        crow: 'border bg-crow-secondary/20 hover:bg-crow-secondary/30 border-crow/60 data-[state=on]:bg-crow/40',
        goose:
          'border bg-goose-secondary/20 hover:bg-goose-secondary/30 border-goose/60 data-[state=on]:bg-goose/40',
        axolotl:
          'border bg-axolotl-secondary/20 hover:bg-axolotl-secondary/30 border-axolotl/60 data-[state=on]:bg-axolotl/40',
        raccoon:
          'border bg-raccoon-secondary/20 hover:bg-raccoon-secondary/30 border-raccoon/60 data-[state=on]:bg-raccoon/40',
        panda:
          'border bg-panda-secondary/20 hover:bg-panda-secondary/30 border-panda/60 data-[state=on]:bg-panda/40',
        // red: 'bg-red-950/40 hover:bg-red-950/80 text-red-50 hover:text-red-50/80 border-red-900 data-[state=on]:border-red-500 data-[state=on]:bg-red-900/50',
        // blue: 'bg-blue-950/40 hover:bg-blue-950/80 text-blue-50 hover:text-blue-50/80 border-blue-900 data-[state=on]:border-blue-500 data-[state=on]:bg-blue-900/50',
        // green:
        //   'bg-green-950/40 hover:bg-green-950/80 text-green-50 hover:text-green-50/80 border-green-900 data-[state=on]:border-green-500 data-[state=on]:bg-green-900/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const Group = (props: GroupProps) => {
  const { selectedGroups, changedGroups } = useStreamsSelector();
  const { groups: favoritesList } = useFavoriteListsContext();

  const t = useTranslations('streamers-dialog');
  const [{ cucurucho }] = useEasterEggsContext();

  const [hidedGroupMembers, setHidedGroupMembers] = useState<string[]>(
    props.group.hidedMembers.map((hm) => hm.twitch_name),
  );

  useEffect(() => {
    setHidedGroupMembers(props.group.hidedMembers.map((hm) => hm.twitch_name));
  }, [props.group.hidedMembers]);

  function toggleGroupsCustomization(member: string) {
    setHidedGroupMembers((old) => {
      if (old.includes(member)) {
        old = old.filter((m) => m !== member);
      } else {
        old = [...old, member];
      }
      return old;
    });
  }

  const cols =
    props.group.members.length === 1
      ? 1
      : [2, 3, 4].includes(props.group.members.length)
      ? 2
      : [5, 6, 8, 9].includes(props.group.members.length)
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
          if (favoritesList.value.includes(props.group.simple_name)) {
            favoritesList.set((old) =>
              old.filter((s) => s !== props.group.simple_name),
            );
          } else {
            favoritesList.set((old) => [...old, props.group.simple_name]);
          }
        }}
      >
        <Heart
          size="1rem"
          className="group-data-[favorite=true]:fill-secondary"
        />
      </Button>
      {props.custom && (
        <>
          <EditGroupDialog group={props.group} />
        </>
      )}
      <ContextMenu
        onOpenChange={() =>
          setHidedGroupMembers(
            props.group.hidedMembers.map((hm) => hm.twitch_name),
          )
        }
      >
        <ToggleGroupItem
          value={props.group.simple_name}
          onClick={() => {
            if (
              selectedGroups.value.some(
                (grp) => grp.simple_name === props.group.simple_name,
              )
            ) {
              changedGroups.set((old) =>
                old.filter((g) => g !== props.group.simple_name),
              );
            } else {
              changedGroups.set((old) => [...old, props.group.simple_name]);
            }
          }}
          asChild
        >
          <ContextMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                groupVariant({
                  variant: 'default',
                }),
              )}
            >
              <div className="flex h-20 w-20 items-center overflow-hidden rounded-xl sm:h-28 sm:w-28">
                <div className="flex max-h-24 w-full flex-wrap justify-center sm:max-h-32">
                  {props.group.members.map((avatar) => (
                    <picture
                      key={avatar.twitch_name}
                      style={{
                        width: `${100 / cols}%`,
                      }}
                    >
                      <Image
                        src={
                          cucurucho
                            ? 'https://i.imgur.com/c1Y9KUp.png'
                            : getSkinHead(avatar.twitch_name)[0]
                        }
                        alt={`${t('profile-image-alt')} ${avatar.display_name}`}
                        width={128}
                        height={128}
                        style={{
                          imageRendering: cucurucho ? 'pixelated' : 'auto',
                        }}
                        data-hidden={props.group.hidedMembers.some(
                          (hm) => hm.twitch_name === avatar.twitch_name,
                        )}
                        className="pointer-events-none aspect-square data-[hidden=true]:opacity-60 data-[hidden=true]:grayscale"
                      />
                    </picture>
                  ))}
                </div>
              </div>
              <span className="select-none text-wrap">
                {props.group.display_name}
              </span>
            </Button>
          </ContextMenuTrigger>
        </ToggleGroupItem>
        <ContextMenuContent>
          <ContextMenuGroup>
            {props.group.members.map((member) => (
              <ContextMenuCheckboxItem
                key={member.twitch_name}
                checked={!hidedGroupMembers.includes(member.twitch_name)}
                onCheckedChange={() => {
                  toggleGroupsCustomization(member.twitch_name);
                }}
                onSelect={(event) => event.preventDefault()}
                defaultIcon={EyeOff}
                checkedIcon={Eye}
              >
                {member.display_name}
              </ContextMenuCheckboxItem>
            ))}
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem asChild>
            <Button
              onClick={() => {
                if (
                  selectedGroups.value.some(
                    (grp) => grp.simple_name === props.group.simple_name,
                  )
                ) {
                  changedGroups.set((old) =>
                    old.filter((g) => g !== props.group.simple_name),
                  );
                } else {
                  changedGroups.set((old) => [...old, props.group.simple_name]);
                }

                selectedGroups.set((old) => {
                  const groupIndex = old.findIndex(
                    (g) => g.simple_name === props.group.simple_name,
                  );

                  if (groupIndex === -1) {
                    old.push({
                      ...props.group,
                      hidedMembers: props.group.members.filter((m) =>
                        hidedGroupMembers.includes(m.twitch_name),
                      ),
                    });
                  } else {
                    old[groupIndex].hidedMembers = props.group.members.filter(
                      (m) => hidedGroupMembers.includes(m.twitch_name),
                    );
                  }

                  return old;
                });
              }}
              size="sm"
              variant="ghost"
              className="h-8 w-full"
            >
              {t('hide-members')}
            </Button>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
