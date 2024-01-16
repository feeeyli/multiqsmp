import { GroupType } from '@/@types/data';

type Groups = GroupType & {
  hidedMembers: {
    display_name: string;
    twitch_name: string;
  }[];
};

export function formatSelectedGroupsDisplay(groups: Groups[]) {
  const modified = groups.map((group) => ({
    ...group,
    members: group.members
      .filter(
        (me) =>
          !group.hidedMembers.some((hm) => hm.twitch_name === me.twitch_name),
      )
      .map((m) => m.display_name),
    hidedMembers: group.hidedMembers.map((m) => m.display_name),
  }));

  return modified.map((group) => {
    if (group.hidedMembers.length === 0) return group.display_name;

    if (group.hidedMembers.length <= 3)
      return `${group.display_name} (-${group.hidedMembers.join(' -')})`;

    return `${group.display_name} (-${group.hidedMembers
      .slice(0, 3)
      .join(' -')} -...)`;
  });
}

/*
selectedGroups.value.map((m) =>
  m.hidedMembers.length === 0
    ? m.display_name
    : m.hidedMembers.length >= 4
    ? `${m.display_name} (${m.members
        .filter(
          (me) =>
            !m.hidedMembers.some(
              (hm) => hm.twitch_name === me.twitch_name,
            ),
        )
        .map((hm) => hm.display_name)
        .join(', ')})`
    : `${m.display_name} (-${m.hidedMembers
        .map((hm) => hm.display_name)
        .join(' -')})`,
)
*/
