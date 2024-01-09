export type SimpleStreamerType = {
  display_name: string;
  twitch_name: string;
  avatar_url: string;
};

export type StreamerType = {
  display_name: string;
  twitch_name: string;
  avatar_url: string;
  is_live: boolean;
  is_playing_qsmp?: boolean;
  title?: string;
};

import { GROUPS } from '../data/groups';
export type GroupType = (typeof GROUPS)[0];
