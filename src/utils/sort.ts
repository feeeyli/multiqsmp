import { GroupType, StreamerType } from '@/@types/data';

export function sortGroups(array: GroupType[]) {
  return array.sort((a, b) =>
    a.groupName < b.groupName ? -1 : a.groupName > b.groupName ? 1 : 0,
  );
}

export function sortStreamers(array: StreamerType[]) {
  return array.sort((a, b) =>
    a.twitchName < b.twitchName ? -1 : a.twitchName > b.twitchName ? 1 : 0,
  );
}
