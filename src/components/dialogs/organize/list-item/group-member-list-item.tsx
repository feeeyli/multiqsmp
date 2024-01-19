import { Button } from '@/components/ui/button';
import { getSkinHead } from '@/utils/getSkinHead';
import { Eye, EyeOff, MessageSquare, MessageSquareDashed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useOrganize } from '../organize-context';
import { OrganizeStateGroups } from '../organize-dialog';

type GroupMemberListItemProps = {
  member: OrganizeStateGroups['members'][0];
  group: string;
};

export const GroupMemberListItem = (props: GroupMemberListItemProps) => {
  const t = useTranslations('organize-dialog');

  const {
    groupsList: [, setGroupsList],
    streamersList: [streamersList],
  } = useOrganize();

  return (
    <li
      data-hidden={props.member.is_hidden}
      className="group flex items-center gap-3 rounded-md py-2 pr-3 data-[hidden=true]:text-muted-foreground"
    >
      <Button
        size="sm"
        variant="ghost"
        className="h-auto p-1"
        onClick={() =>
          setGroupsList((old) => {
            const groupIndex = old.findIndex(
              (g) => g.simple_name === props.group,
            );
            const memberIndex = old[groupIndex].members.findIndex(
              (m) => m.twitch_name === props.member.twitch_name,
            );

            old[groupIndex].members[memberIndex].is_hidden =
              !old[groupIndex].members[memberIndex].is_hidden;

            return old;
          })
        }
      >
        {props.member.is_hidden && <Eye size="1rem" />}
        {!props.member.is_hidden && <EyeOff size="1rem" />}
      </Button>
      <div className="flex flex-1 items-center gap-2 group-data-[hidden=true]:line-through">
        {getSkinHead(props.member.twitch_name).map((head) => (
          <Image
            src={
              head
                ? head
                : 'https://placehold.co/300x300/281f37/f9fafb.png?text=o_O'
            }
            key={head}
            alt={`${t('profile-image-alt')} ${props.member.twitch_name}`}
            width={128}
            height={128}
            className="h-6 w-6 group-data-[hidden=true]:opacity-60"
          />
        ))}
        {props.member.twitch_name}
      </div>
      {!streamersList
        .map((s) => s.twitch_name)
        .includes(props.member.twitch_name) &&
        !props.member.is_hidden && (
          <Button
            size="sm"
            variant="ghost"
            className="h-auto p-1"
            onClick={() =>
              setGroupsList((old) => {
                const groupIndex = old.findIndex(
                  (g) => g.simple_name === props.group,
                );
                const memberIndex = old[groupIndex].members.findIndex(
                  (m) => m.twitch_name === props.member.twitch_name,
                );

                old[groupIndex].members[memberIndex].chat_opened =
                  !old[groupIndex].members[memberIndex].chat_opened;

                return old;
              })
            }
          >
            {!props.member.chat_opened && (
              <MessageSquareDashed size="1rem" className="opacity-60" />
            )}
            {props.member.chat_opened && <MessageSquare size="1rem" />}
          </Button>
        )}
    </li>
  );
};
