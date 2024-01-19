import { useSettings } from '@/contexts/settings-context';
import { useSearchParams } from 'next/navigation';
import { useQueryData } from './useQueryData';

type Streams = {
  twitch_name: string;
  group_name?: string;
  is_chat: boolean;
}[];

export function useStreamsList() {
  const [
    {
      streams: { movableChat },
    },
  ] = useSettings();
  const [streamersOnQuery, groupsOnQuery] = useQueryData();
  const searchParams = useSearchParams();
  const chatsOnQuery = searchParams.get('chats')?.split('/') || [];

  const mergedStreams: Streams = Array.from([
    ...groupsOnQuery
      .map((group) =>
        group.members
          .filter((member) => !member.is_hidden)
          .map((member) => ({
            twitch_name: member.twitch_name,
            group_name: group.simple_name,
            is_chat: false,
          })),
      )
      .flat(),
    ...streamersOnQuery.map((s) => ({
      twitch_name: s.twitch_name,
      group_name: undefined,
      is_chat: false,
    })),
  ]);

  const mergedStreamsWithoutDuplicates = Array.from(
    new Set(mergedStreams.map((item) => item.twitch_name)),
  ).map((twitch_name) => {
    const itemWithGroupName = mergedStreams.find(
      (item) => item.twitch_name === twitch_name && item.group_name,
    );
    return (
      itemWithGroupName ||
      mergedStreams.find((item) => item.twitch_name === twitch_name)
    );
  }) as Streams;

  const listWithChat: Streams = [
    ...mergedStreamsWithoutDuplicates,
    ...(movableChat ? chatsOnQuery : []).map((c) => ({
      twitch_name: c,
      group_name: undefined,
      is_chat: true,
    })),
  ];

  return listWithChat;
}
