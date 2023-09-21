import { GROUPS } from '@/data/groups';
import { STREAMERS } from '@/data/streamers';

export function getStreamersFromGroup(
  groups: string[],
  MERGED_GROUPS: typeof GROUPS,
) {
  const acceptedGroups = MERGED_GROUPS.map((group) => group.simpleGroupName);

  const filteredGroups = groups.filter((group) =>
    acceptedGroups.includes(group.toLowerCase()),
  );

  let twitchNames: string[] = [];

  filteredGroups.forEach((group) => {
    const names = MERGED_GROUPS.find(
      (g) => g.simpleGroupName === group.toLowerCase(),
    )?.twitchNames;

    if (!names) return;

    twitchNames.push(...names);
  });

  return twitchNames;
}

export function parseChannels(
  channelsAndGroups: string[],
  customGroups: typeof GROUPS,
) {
  const MERGED_GROUPS = [...new Set([...GROUPS, ...customGroups])];

  const groups = channelsAndGroups.filter((channelOrGroup) =>
    MERGED_GROUPS.find(
      (group) => group.simpleGroupName === channelOrGroup.toLowerCase(),
    ),
  );

  const channels = channelsAndGroups.filter((channelOrGroup) =>
    STREAMERS.find(
      (group) =>
        group.twitchName.toLowerCase() === channelOrGroup.toLowerCase(),
    ),
  );

  const acceptedChannels = STREAMERS.map((streamer) =>
    streamer.twitchName.toLowerCase(),
  );

  const filteredChannels = channels.filter((channel) =>
    acceptedChannels.includes(channel.toLowerCase()),
  );

  const groupsStreamers = getStreamersFromGroup(groups, MERGED_GROUPS);

  const channelsWithoutDuplicates = [...new Set(filteredChannels)];

  const groupsWithoutDuplicates = [...new Set(groupsStreamers)];

  return [channelsWithoutDuplicates, groupsWithoutDuplicates, groups];
}
