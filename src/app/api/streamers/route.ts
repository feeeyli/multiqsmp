import { StreamerType } from '@/@types/data';
import { STREAMERS } from '@/data/streamers';

type TwitchResponse = {
  data: {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    tags: string[];
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    is_mature: boolean;
  }[];
};

type UserTwitchResponse = {
  data: {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email: string;
    created_at: string;
  }[];
};

// async function getDefaultStreamers() {
//   const userLogins = STREAMERS.map(
//     (streamer) => `user_login=${streamer.twitch_name}`,
//   ).join('&');

//   const streamsRes = await fetch(
//     `https://api.twitch.tv/helix/streams?${userLogins}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITCH_SECRET}`,
//         'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
//       },
//       next: { revalidate: 60 },
//     },
//   );

//   const { data } = (await streamsRes.json()) as TwitchResponse;

//   return STREAMERS.map((streamer) => {
//     const stream = data.find((s) => s.user_login === streamer.twitch_name);

//     const offline = {
//       display_name: streamer.display_name,
//       twitch_name: streamer.twitch_name,
//       avatar_url: streamer.avatar_url,
//       is_live: false,
//     };

//     if (typeof stream === 'undefined') return offline;

//     return {
//       ...offline,
//       is_live: true,
//       is_playing_qsmp:
//         /(qsmp)|(minecraft)/i.test(stream.tags.join(',') || '') ||
//         stream.game_name === 'Minecraft',
//       title: stream.title,
//       language: stream.language,
//     };
//   });
// }

async function getQueryStreamers(query: string) {
  const userLogins = query
    .split('/')
    .map((streamer) => `user_login=${streamer}`)
    .join('&');

  const streamsRes = await fetch(
    `https://api.twitch.tv/helix/streams?${userLogins}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITCH_SECRET}`,
        'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
      },
      next: { revalidate: 60 },
    },
  );

  const streamersRes = await fetch(
    `https://api.twitch.tv/helix/users?${userLogins.replaceAll(
      'user_login',
      'login',
    )}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITCH_SECRET}`,
        'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
      },
      next: { revalidate: 60 },
    },
  );

  const { data: streamsData } = (await streamsRes.json()) as TwitchResponse;
  const { data: streamersData } =
    (await streamersRes.json()) as UserTwitchResponse;

  const streamers = streamersData.map((streamer) => {
    const stream = streamsData.find((s) => s.user_login === streamer.login);

    const offline = {
      display_name: streamer.display_name,
      twitch_name: streamer.login,
      avatar_url: streamer.profile_image_url,
      is_live: false,
    };

    if (typeof stream === 'undefined') return offline;

    return {
      ...offline,
      is_live: true,
      is_playing_qsmp: STREAMERS.some((s) => s.twitch_name === streamer.login)
        ? /(qsmp)|(minecraft)|(frogg smp)/i.test(
            stream.tags.concat(stream.title).join(',') || '',
          ) || stream.game_name === 'Minecraft'
        : undefined,
      title: stream.title,
      language: stream.language,
    };
  });

  return query
    .split('/')
    .map((s) => streamers.find((str) => str.twitch_name === s)!);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  const getStreamers = query
    ? async () => await getQueryStreamers(query)
    : () => undefined;

  const parsedStreamers: StreamerType[] | undefined = await getStreamers();

  if (typeof parsedStreamers === 'undefined') return Response.error();

  return Response.json(parsedStreamers);
}
