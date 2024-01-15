import { GroupType } from '@/@types/data';
import { getAppVariant } from '@/utils/getAppVariant';
import { PURGATORY_GROUPS } from './groups/purgatory';
import { QSMP_GROUPS } from './groups/qsmp';

const groupsVariants = {
  qsmp: QSMP_GROUPS,
  frogg: [],
  purgatory: PURGATORY_GROUPS,
};

const variant = getAppVariant();

export const GROUPS = groupsVariants[variant] as GroupType[];
