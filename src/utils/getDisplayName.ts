import { GroupType } from '@/@types/data';
import { GROUPS as DEFAULT_GROUPS, PURGATORY_GROUPS } from '@/data/groups';
import {
  STREAMERS as DEFAULT_STREAMERS,
  PURGATORY_STREAMERS,
} from '@/data/streamers';

const GROUPS = [...DEFAULT_GROUPS, ...PURGATORY_GROUPS];
const STREAMERS = [...DEFAULT_STREAMERS, ...PURGATORY_STREAMERS];

export function getDisplayName(
  twitchName: string,
  customGroups: GroupType[] = [],
) {
  const streamerDisplayName = STREAMERS.find((s) => s.twitchName === twitchName)
    ?.displayName;
  const groupDisplayName = [...GROUPS, ...customGroups].find(
    (s) => s.simpleGroupName === twitchName.split('.')[0],
  )?.groupName;

  return streamerDisplayName || groupDisplayName || twitchName;
}
