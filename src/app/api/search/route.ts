import { StreamerType } from '@/@types/data';

type TwitchResponse = {
  data: {
    broadcaster_language: string;
    broadcaster_login: string;
    display_name: string;
    game_id: string;
    game_name: string;
    id: string;
    is_live: boolean;
    tag_ids: string[];
    tags: string[];
    thumbnail_url: string;
    title: string;
    started_at: string;
  }[];
};

async function getStreamers(query: string) {
  const res = await fetch(
    `https://api.twitch.tv/helix/search/channels?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITCH_SECRET}`,
        'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
      },
    },
  );

  const { data } = (await res.json()) as TwitchResponse;

  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query)
    return new Response('Query is empty', {
      status: 400,
    });

  const streamersData = await getStreamers(query);

  const parsedStreamers: StreamerType[] = streamersData
    .map((streamer) => ({
      display_name: streamer.display_name,
      twitch_name: streamer.broadcaster_login,
      avatar_url: streamer.thumbnail_url,
      is_live: streamer.is_live,
      title: streamer.title,
    }))
    .sort((x, y) => (x.is_live === y.is_live ? 0 : x.is_live ? -1 : 1));

  return Response.json(parsedStreamers);
}
