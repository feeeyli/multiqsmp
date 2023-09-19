const YOUTUBE_STREAMERS_ID = {
  vegetta777: 'UCam8T03EOFBsNdR0thrFHdQ',
  willyrex: 'UC8rNKrqBxJqL9izOOMxBJtw',
};

export function getStreamUrl(channel: string) {
  if (Object.keys(YOUTUBE_STREAMERS_ID).includes(channel)) {
    return `https://www.youtube.com/embed/live_stream?channel=${
      YOUTUBE_STREAMERS_ID[channel as keyof typeof YOUTUBE_STREAMERS_ID]
    }`;
  }

  return `https://player.twitch.tv/${channel}`;
}
