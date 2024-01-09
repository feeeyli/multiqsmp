import { SKIN_HEADS } from '@/data/skinHeads';

export function getSkinHead(name: string) {
  // if (name === 'tazercraft') {
  //   return [SKIN_HEADS.mikethelink, SKIN_HEADS.pactw];
  // }

  const SKIN_HEADS_LOWER: { [streamer: string]: string } = {};

  Object.entries(SKIN_HEADS).forEach(([streamer, skin]) => {
    SKIN_HEADS_LOWER[streamer.toLocaleLowerCase()] = skin;
  });

  return [SKIN_HEADS_LOWER[name.toLocaleLowerCase()]];
}
