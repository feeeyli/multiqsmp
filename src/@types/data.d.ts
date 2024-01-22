export type SimpleStreamerType = {
  display_name: string;
  twitch_name: string;
  avatar_url: string;
  invitation?: number;
};

export type StreamerType = {
  display_name: string;
  twitch_name: string;
  avatar_url: string;
  is_live: boolean;
  is_playing_qsmp?: boolean;
  title?: string;
};

export type GroupType = {
  display_name: string;
  simple_name: string;
  members: {
    display_name: string;
    twitch_name: string;
  }[];
};

export type EventType = {
  name: string;
  time: Date;
  announcements: EventAnnouncement[];
};

export type EventAnnouncement = {
  text: string;
  pictures: string[];
  link: string;
  publisher: {
    picture: string;
    name: string;
    username: string;
  };
};
