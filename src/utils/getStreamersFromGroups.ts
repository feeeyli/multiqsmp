// Data Imports
import { GROUPS } from '@/data/groups';

export function getStreamersFromGroups(groupsNames: string[]) {
  const groups = GROUPS.filter((group) =>
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
