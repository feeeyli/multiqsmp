import { Button } from '@/components/ui/button';
import { getSkinHead } from '@/utils/getSkinHead';
import { Eye, EyeOff, MessageSquare, MessageSquareDashed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { OrganizeStateGroups } from '..';
import { useOrganize } from '../organize-context';

type GroupMemberListItemProps = {
  member: OrganizeStateGroups['members'][0];
  group: string;
};

export const GroupMemberListItem = (props: GroupMemberListItemProps) => {
  const t = useTranslations('organize-dialog');

  const {
    groupsList: [_, setGroupsList],
    streamersList: [streamersList],
  } = useOrganize();

  return (
    <li
      data-hidden={props.member.isHidden}
      className="group flex items-center gap-3 rounded-md py-2 pr-3 data-[hidden=true]:text-muted-foreground"
    >
      <Button
        size="sm"
        variant="ghost"
        className="h-auto p-1"
        onClick={() =>
          setGroupsList((old) => {
            const groupIndex = old.findIndex(
              (g) => g.simpleName === props.group,
            );
            const memberIndex = old[groupIndex].members.findIndex(
              (m) => m.name === props.member.name,
            );

            old[groupIndex].members[memberIndex].isHidden =
              !old[groupIndex].members[memberIndex].isHidden;

            return old;
          })
        }
      >
        {props.member.isHidden && <Eye size="1rem" />}
        {!props.member.isHidden && <EyeOff size="1rem" />}
      </Button>
      <div className="flex flex-1 items-center gap-2 group-data-[hidden=true]:line-through">
        {getSkinHead(props.member.twitchName).map((head) => (
          <Image
            src={head}
            key={head}
            alt={`${t('profile-image-alt')} ${props.member.name}`}
            width={128}
            height={128}
            className="h-6 w-6 group-data-[hidden=true]:opacity-60"
          />
        ))}
        {props.member.name}
      </div>
      {!streamersList
        .map((s) => s.twitchName)
        .includes(props.member.twitchName) &&
        !props.member.isHidden && (
          <Button
            size="sm"
            variant="ghost"
            className="h-auto p-1"
            onClick={() =>
              setGroupsList((old) => {
                const groupIndex = old.findIndex(
                  (g) => g.simpleName === props.group,
                );
                const memberIndex = old[groupIndex].members.findIndex(
                  (m) => m.name === props.member.name,
                );

                old[groupIndex].members[memberIndex].chatOpened =
                  !old[groupIndex].members[memberIndex].chatOpened;

                return old;
              })
            }
          >
            {!props.member.chatOpened && (
              <MessageSquareDashed size="1rem" className="opacity-60" />
            )}
            {props.member.chatOpened && <MessageSquare size="1rem" />}
          </Button>
        )}
    </li>
  );
};
