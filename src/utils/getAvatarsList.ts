export function getAvatarsList(streamers: string[]) {
  const avatars: string[] = [];

  streamers
    .map((gs) => {
      return gs.toLocaleLowerCase() === 'tazercraft'
        ? ['mikethelink', 'pactw']
        : [gs];
    })
    .forEach((ava) => avatars.push(...ava));

  return avatars;
}
