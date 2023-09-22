import { GroupType } from '@/@types/data';
import { GROUPS } from '@/data/groups';
import { STREAMERS } from '@/data/streamers';

export function getDisplayName(
  twitchName: string,
  customGroups: GroupType[] = [],
) {
  const streamerDisplayName = STREAMERS.find((s) => s.twitchName === twitchName)
    ?.displayName;
  const groupDisplayName = [...GROUPS, ...customGroups].find(
    (s) => s.simpleGroupName === twitchName,
  )?.groupName;

  return streamerDisplayName || groupDisplayName || twitchName;
}
