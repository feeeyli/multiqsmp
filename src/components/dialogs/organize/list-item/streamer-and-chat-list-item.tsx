import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { getSkinHead } from '@/utils/getSkinHead';
import { MessageSquare, MessageSquareDashed, X } from 'lucide-react';
import Image from 'next/image';
import { useOrganize } from '../organize-context';
import { OrganizeStateStreamers } from '../organize-dialog';

type StreamerAndChatListItemProps = {
  channel: OrganizeStateStreamers;
};

export const StreamerAndChatListItem = (
  props: StreamerAndChatListItemProps,
) => {
  const t = useTranslations('organize-dialog');

  const {
    streamersList: [, setStreamerList],
  } = useOrganize();

  return (
    <li className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2">
      <Button
        size="sm"
        variant="ghost"
        className="h-auto p-1"
        onClick={() =>
          setStreamerList((old) =>
            old.filter(
              (streamer) => streamer.twitch_name !== props.channel.twitch_name,
            ),
          )
        }
      >
        <X size="1rem" />
      </Button>
      <div className="flex flex-1 items-center gap-2">
        {getSkinHead(props.channel.twitch_name).map((head) => (
          <Image
            src={
              head
                ? head
                : 'https://placehold.co/300x300/281f37/f9fafb.png?text=o_O'
            }
            key={head}
            alt={`${t('profile-image-alt')} ${props.channel.display_name}`}
            width={128}
            height={128}
            className="h-6 w-6"
          />
        ))}
        {props.channel.display_name}
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-auto p-1"
        onClick={() =>
          setStreamerList((old) => {
            const streamerIndex = old.findIndex(
              (s) => s.twitch_name === props.channel.twitch_name,
            );

            old[streamerIndex].chat_opened = !old[streamerIndex].chat_opened;

            return old;
          })
        }
      >
        {!props.channel.chat_opened && (
          <MessageSquareDashed size="1rem" className="opacity-60" />
        )}
        {props.channel.chat_opened && <MessageSquare size="1rem" />}
      </Button>
    </li>
  );
};
