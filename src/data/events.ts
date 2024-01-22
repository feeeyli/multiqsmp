import { EventType } from '@/@types/data';
import { getAppVariant } from '@/utils/getAppVariant';
import { FROGG_EVENTS } from './events/frogg';

const eventsVariants = {
  qsmp: [],
  frogg: FROGG_EVENTS,
  purgatory: [],
};

const variant = getAppVariant();

export const EVENTS = eventsVariants[variant] as EventType[];
