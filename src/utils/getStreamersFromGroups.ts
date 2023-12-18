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

  const groups = mergedGroups.filter((group) =>
    groupsNames.includes(group.simpleGroupName),
  );

  // const onlyTwitchNames = groups.map(group => {
  //   const toReturn = new Set(group.twitchNames)
  // })

  const streamersFromGroups: string[] = [];

  groups.forEach((group) => {
    streamersFromGroups.push(...group.twitchNames);
  });

  return streamersFromGroups;
}
