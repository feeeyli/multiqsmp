import { Button } from '@/components/ui/button';
import { getSkinHead } from '@/utils/getSkinHead';
import { MessageSquare, MessageSquareDashed, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { OrganizeStateStreamers } from '..';
import { useOrganize } from '../organize-context';

type StreamerAndChatListItemProps = {
  channel: OrganizeStateStreamers;
};

export const StreamerAndChatListItem = (
  props: StreamerAndChatListItemProps,
) => {
  const t = useTranslations('organize-dialog');

  const {
    streamersList: [_, setStreamerList],
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
              (streamer) => streamer.twitchName !== props.channel.twitchName,
            ),
          )
        }
      >
        <X size="1rem" />
      </Button>
      <div className="flex flex-1 items-center gap-2">
        {getSkinHead(props.channel.twitchName).map((head) => (
          <Image
            src={head}
            key={head}
            alt={`${t('profile-image-alt')} ${props.channel.name}`}
            width={128}
            height={128}
            className="h-6 w-6"
          />
        ))}
        {props.channel.name}
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-auto p-1"
        onClick={() =>
          setStreamerList((old) => {
            const streamerIndex = old.findIndex(
              (s) => s.twitchName === props.channel.twitchName,
            );

            old[streamerIndex].chatOpened = !old[streamerIndex].chatOpened;

            return old;
          })
        }
      >
        {!props.channel.chatOpened && (
          <MessageSquareDashed size="1rem" className="opacity-60" />
        )}
        {props.channel.chatOpened && <MessageSquare size="1rem" />}
      </Button>
    </li>
  );
};
