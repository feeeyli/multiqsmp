import { StreamerType } from '@/@types/data';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useStreamers } from './useStreamers';

export function useQueryStreamers() {
  const DataStreamers = useStreamers();

  const { data: QueryStreamers, isLoading } = useQuery({
    queryKey: ['streamers'],
    queryFn: async () => {
      const { data } = await axios.get<StreamerType[]>('/api/streamers', {
        params: {
          query: DataStreamers.map((streamer) => streamer.twitch_name)
            .join('/')
            .toLocaleLowerCase(),
        },
      });
      return data;
    },
  });

  const Streamers: StreamerType[] =
    isLoading || typeof QueryStreamers === 'undefined'
      ? DataStreamers.map((streamer) => ({
          ...streamer,
          is_live: true,
          is_playing_qsmp: true,
        }))
      : QueryStreamers;

  return { Streamers, isLoading };
}
