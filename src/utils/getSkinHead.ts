import { SKIN_HEADS } from '@/data/skinHeads';

export function getSkinHead(name: string) {
  const n = name as keyof typeof SKIN_HEADS;

  return SKIN_HEADS[n];
}
