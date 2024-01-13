// Data Imports
import { GroupType } from '@/@types/data';
import { GROUPS, PURGATORY_GROUPS } from '@/data/groups';

export function getStreamersFromGroups(
  groupsNames: string[],
  customGroups: GroupType[],
) {
  const mergedGroups = [
    ...new Set([...GROUPS, ...PURGATORY_GROUPS, ...customGroups]),
  ];

  const groupsWithOptionsDone = groupsNames
    .map((gn) => {
      const name = gn.split('.')[0] || '';

      const group = mergedGroups.find((g) => g.simple_name === name);

      if (!group) return '';

      return getStreamersFromGroup(group, gn);
    })
    .filter((item) => item !== '') as {
    group_name: string;
    members: string[];
  }[];

  const streamersFromGroups: {
    group_name: string;
    twitch_name: string;
  }[] = [];

  groupsWithOptionsDone.forEach((group) => {
    streamersFromGroups.push(
      ...group.members.map((g) => ({
        group_name: group.group_name,
        twitch_name: g,
      })),
    );
  });

  return streamersFromGroups;
}

function getStreamersFromGroup(group: GroupType, nameOnQuery: string) {
  const options = nameOnQuery.split('.')[1];

  if (!options)
    return { group_name: group.simple_name, members: group.members };

  const exclusions = options.split('-');

  const groupMembersWithExclusions: string[] = group.members
    .filter((name) => !exclusions.includes(name.twitch_name))
    .map((m) => m.twitch_name);

  return {
    group_name: group.simple_name,
    members: groupMembersWithExclusions.filter((item) => item),
  };
}
/*
group.twitch_names.map((name, index) => )
*/
