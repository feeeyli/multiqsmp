import { GroupType } from '@/@types/data';
import { GROUPS } from '@/data/groups';
import { STREAMERS } from '@/data/streamers';
import { getStreamersFromGroups } from '@/utils/getStreamersFromGroups';
import { useSearchParams } from 'next/navigation';
import { useReadLocalStorage } from 'usehooks-ts';
import { OrganizeStateGroups, OrganizeStateStreamers } from './organize-dialog';

export function useQueryData(): [
  OrganizeStateStreamers[],
  OrganizeStateGroups[],
] {
  const searchParams = useSearchParams();
  const CG = useReadLocalStorage<
    {
      groupName: string;
      simpleGroupName: string;
      members: string[];
      avatars: string[];
      twitchNames: string[];
    }[]
  >('custom-groups');
  const customGroups = CG
    ? CG.map((g) => ({
        display_name: g.groupName,
        simple_name: g.simpleGroupName,
        members: g.members.map((m, i) => ({
          display_name: m,
          twitch_name: g.avatars[i],
        })),
      }))
    : [];

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
          (group) => group.name === curr.group_name,
        );

        if (existingGroup) {
          existingGroup.members.push(curr.twitch_name);
        } else {
          acc.push({ name: curr.group_name, members: [curr.twitch_name] });
        }

        return acc;
      },
      [] as { name: string; members: string[] }[],
    );

  const fullGroups = [...GROUPS, ...(customGroups as GroupType[])];

  const groups: OrganizeStateGroups[] = groupsWithMembers.map((g) => {
    const originalGroup = fullGroups.find((fg) => fg.simple_name === g.name);

    return {
      display_name: originalGroup?.display_name || g.name,
      simple_name: originalGroup?.simple_name || g.name,
      members:
        originalGroup?.members.map((m) => ({
          display_name: m.display_name,
          twitch_name: m.twitch_name,
          is_hidden: onlyGroupHides.includes(m.twitch_name),
          chat_opened: chatsOnQuery.includes(m.twitch_name),
        })) || [],
    };
  });

  //#endregion

  //#region Streamers

  const streamers: OrganizeStateStreamers[] = streamersOnQuery.map((s) => {
    const streamer = [...STREAMERS].find((ss) => ss.twitch_name === s);

    return {
      twitch_name: s,
      display_name: streamer?.display_name || s,
      chat_opened: chatsOnQuery.includes(s),
    };
  });

  //#endregion

  return [streamers, groups];
}
