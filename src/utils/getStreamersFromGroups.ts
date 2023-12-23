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

      const group = mergedGroups.find((g) => g.simpleGroupName === name);

      if (!group) return '';

      return getStreamersFromGroup(group, gn);
    })
    .filter((item) => item !== '') as {
    groupName: string;
    members: string[];
  }[];

  const groups = mergedGroups.filter((group) =>
    groupsNames.includes(group.simpleGroupName),
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

  if (!options)
    return { groupName: group.simpleGroupName, members: group.twitchNames };

  const [order, ...exclusions] = options.split('-');

  const reorderedGroupMembers = order
    ? order.split('').map((pos) => group.twitchNames[Number(pos) - 1])
    : group.twitchNames;

  const groupMembersWithExclusions: string[] = reorderedGroupMembers.filter(
    (name) => !exclusions.includes(name),
  );

  return {
    groupName: group.simpleGroupName,
    members: groupMembersWithExclusions.filter((item) => item),
  };
}
/*
group.twitchNames.map((name, index) => )
*/
