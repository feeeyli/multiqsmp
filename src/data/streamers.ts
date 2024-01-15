import { SimpleStreamerType } from '@/@types/data';
import { getAppVariant } from '@/utils/getAppVariant';
import { FROGG_STREAMERS } from './streamers/frogg';
import { PURGATORY_STREAMERS } from './streamers/purgatory';
import { QSMP_STREAMERS } from './streamers/qsmp';

const streamersVariants = {
  qsmp: QSMP_STREAMERS,
  frogg: FROGG_STREAMERS,
  purgatory: PURGATORY_STREAMERS,
};

const variant = getAppVariant();

export const STREAMERS = streamersVariants[variant] as SimpleStreamerType[];
