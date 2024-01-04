import { GroupType } from '@/@types/data';
import { GROUPS, PURGATORY_GROUPS } from '@/data/groups';
import { PURGATORY_STREAMERS, STREAMERS } from '@/data/streamers';
import { getStreamersFromGroups } from '@/utils/getStreamersFromGroups';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { OrganizeStateGroups, OrganizeStateStreamers } from '.';

export function getDataFromQuery(
  searchParams: ReadonlyURLSearchParams,
  customGroups: {
    groupName: string;
    simpleGroupName: string;
    members: string[];
    avatars: string[];
    twitchNames: string[];
  }[],
): [OrganizeStateStreamers[], OrganizeStateGroups[]] {
  const streamersOnQuery = searchParams.get('streamers')?.split('/') || [];
  const groupsOnQuery = searchParams.get('groups')?.split('/') || [];
  const chatsOnQuery = searchParams.get('chats')?.split('/') || [];

  //#region Groups

  const groupsWithoutHides = groupsOnQuery.map((g) => g.split('.-')[0]);
  const onlyGroupHides: string[] = [];

  groupsOnQuery.forEach((g) => {
    if (!g.split('.-')[1]) return;

    onlyGroupHides.push(...g.split('.-')[1].split('-'));
  });

  const streamersFromGroups = getStreamersFromGroups(
    groupsWithoutHides,
    customGroups,
  );

  const groupsWithMembers: { name: string; members: string[] }[] =
    streamersFromGroups.reduce(
      (acc, curr) => {
        const existingGroup = acc.find(
          (group) => group.name === curr.groupName,
        );

        if (existingGroup) {
          existingGroup.members.push(curr.twitchName);
        } else {
          acc.push({ name: curr.groupName, members: [curr.twitchName] });
        }

        return acc;
      },
      [] as { name: string; members: string[] }[],
    );

  const fullGroups = [
    ...GROUPS,
    ...PURGATORY_GROUPS,
    ...(customGroups as GroupType[]),
  ];

  const groups: OrganizeStateGroups[] = groupsWithMembers.map((g) => {
    const originalGroup = fullGroups.find(
      (fg) => fg.simpleGroupName === g.name,
    );

    return {
      name: originalGroup?.groupName || g.name,
      simpleName: originalGroup?.simpleGroupName || g.name,
      members:
        originalGroup?.twitchNames.map((m, i) => ({
          name: originalGroup.members[i],
          twitchName: m,
          isHidden: onlyGroupHides.includes(m),
          chatOpened: chatsOnQuery.includes(m),
        })) || [],
    };
  });

  //#endregion

  //#region Streamers

  const streamers: OrganizeStateStreamers[] = streamersOnQuery.map((s) => {
    const streamer = [...STREAMERS, ...PURGATORY_STREAMERS].find(
      (ss) => ss.twitchName === s,
    );

    return {
      twitchName: s,
      name: streamer?.displayName ? streamer.displayName : s,
      chatOpened: chatsOnQuery.includes(s),
    };
  });

  //#endregion

  return [streamers, groups];
}
