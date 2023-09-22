// Data Imports
import { GroupType } from '@/@types/data';
import { GROUPS } from '@/data/groups';

export function getStreamersFromGroups(
  groupsNames: string[],
  customGroups: GroupType[],
) {
  const mergedGroups = [...new Set([...GROUPS, ...customGroups])];

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
