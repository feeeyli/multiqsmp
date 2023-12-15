import { SKIN_HEADS } from '@/data/skinHeads';

export function getSkinHead(name: string) {
  // if (name === 'tazercraft') {
  //   return [SKIN_HEADS.mikethelink, SKIN_HEADS.pactw];
  // }

  const n = name as keyof typeof SKIN_HEADS;

  return [SKIN_HEADS[n]];
}
