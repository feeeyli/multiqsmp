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
    groupName: string;
    members: string[];
  }[];

  const groups = mergedGroups.filter((group) =>
    groupsNames.includes(group.simple_name),
  );

  // const onlyTwitchNames = groups.map(group => {
  //   const toReturn = new Set(group.twitchNames)
  // })

  const streamersFromGroups: {
    groupName: string;
    twitchName: string;
  }[] = [];

  groupsWithOptionsDone.forEach((group) => {
    streamersFromGroups.push(
      ...group.members.map((g) => ({
        groupName: group.groupName,
        twitchName: g,
      })),
    );
  });

  return streamersFromGroups;
}

function getStreamersFromGroup(group: GroupType, nameOnQuery: string) {
  const options = nameOnQuery.split('.')[1];

  if (!options) return { groupName: group.simple_name, members: group.members };

  const exclusions = options.split('-');

  const groupMembersWithExclusions: string[] = group.members
    .filter((name) => !exclusions.includes(name.twitch_name))
    .map((m) => m.twitch_name);

  return {
    groupName: group.simple_name,
    members: groupMembersWithExclusions.filter((item) => item),
  };
}
/*
group.twitchNames.map((name, index) => )
*/
