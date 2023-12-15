import { STREAMERS } from '../data/streamers';
export type StreamerType = {
  twitchName: string;
  displayName: string;
  avatarUrl: string;
  invitation?: number;
};

import { GROUPS } from '../data/groups';
export type GroupType = (typeof GROUPS)[0];
