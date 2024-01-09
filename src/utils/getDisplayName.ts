import { GroupType } from '@/@types/data';
import { GROUPS as DEFAULT_GROUPS, PURGATORY_GROUPS } from '@/data/groups';
import { STREAMERS } from '@/data/streamers';

const GROUPS = [...DEFAULT_GROUPS, ...PURGATORY_GROUPS];

export function getGroupsDisplayName(
  twitchName: string,
  customGroups: GroupType[] = [],
) {
  const groupDisplayName = [...GROUPS, ...customGroups].find(
    (s) => s.simple_name === twitchName.split('.')[0],
  )?.display_name;

  return groupDisplayName || twitchName;
}

export function getStreamerDisplayName(twitchName: string) {
  const streamerDisplayName = STREAMERS.find(
    (s) => s.twitch_name === twitchName,
  )?.display_name;

  return streamerDisplayName || twitchName;
}
