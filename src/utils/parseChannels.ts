import { GROUPS } from '@/data/groups';
import { STREAMERS } from '@/data/streamers';

export function getStreamersFromGroup(
  groups: string[],
  MERGED_GROUPS: typeof GROUPS,
) {
  const acceptedGroups = MERGED_GROUPS.map((group) => group.simple_name);

  const filteredGroups = groups.filter((group) =>
    acceptedGroups.includes(group.toLowerCase()),
  );

  let twitchNames: string[] = [];

  filteredGroups.forEach((group) => {
    const names = MERGED_GROUPS.find(
      (g) => g.simple_name === group.toLowerCase(),
    )?.members.map((m) => m.twitch_name);

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
      (group) => group.simple_name === channelOrGroup.toLowerCase(),
    ),
  );

  const channels = channelsAndGroups.filter((channelOrGroup) =>
    STREAMERS.find(
      (group) =>
        group.twitch_name.toLowerCase() === channelOrGroup.toLowerCase(),
    ),
  );

  const acceptedChannels = STREAMERS.map((streamer) =>
    streamer.twitch_name.toLowerCase(),
  );

  const filteredChannels = channels.filter((channel) =>
    acceptedChannels.includes(channel.toLowerCase()),
  );

  const groupsStreamers = getStreamersFromGroup(groups, MERGED_GROUPS);

  const channelsWithoutDuplicates = [...new Set(filteredChannels)];

  const groupsWithoutDuplicates = [...new Set(groupsStreamers)];

  return [channelsWithoutDuplicates, groupsWithoutDuplicates, groups];
}
