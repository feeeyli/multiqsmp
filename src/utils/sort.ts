import { GroupType, StreamerType } from '@/@types/data';

export function sortGroups(array: GroupType[]) {
  return array.sort((a, b) =>
    a.display_name < b.display_name
      ? -1
      : a.display_name > b.display_name
      ? 1
      : 0,
  );
}

export function sortStreamers(array: StreamerType[]) {
  return array.sort((a, b) =>
    a.twitch_name < b.twitch_name ? -1 : a.twitch_name > b.twitch_name ? 1 : 0,
  );
}
