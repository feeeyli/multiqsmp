import { SKIN_HEADS } from '@/data/skinHeads';

export function getSkinHead(name: string, force?: boolean) {
  // if (name === 'tazercraft') {
  //   return [SKIN_HEADS.mikethelink, SKIN_HEADS.pactw];
  // }

  const SKIN_HEADS_LOWER: { [streamer: string]: string } = {};

  Object.entries(SKIN_HEADS).forEach(([streamer, skin]) => {
    SKIN_HEADS_LOWER[streamer.toLocaleLowerCase()] = skin;
  });

  const skinHead = SKIN_HEADS_LOWER[name.toLocaleLowerCase()];

  return [
    skinHead
      ? skinHead
      : force
      ? 'https://placehold.co/300x300/281f37/f9fafb.png?text=' +
        name[0].toLocaleUpperCase()
      : '',
  ];
}
