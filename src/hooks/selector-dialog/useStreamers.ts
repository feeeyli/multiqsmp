import { usePinnedStreamers } from '@/components/dialogs/selector/tabs/pinned-streamers-context';
import { STREAMERS } from '@/data/streamers';
import { useQueryData } from '../useQueryData';

export function useStreamers() {
  const [pinnedStreamers] = usePinnedStreamers();
  const [streamersOnQuery] = useQueryData();

  const streamers = [
    pinnedStreamers,
    streamersOnQuery.filter(
      (streamer) =>
        ![...STREAMERS, ...pinnedStreamers].some(
          (str) => str.twitch_name === streamer.twitch_name,
        ),
    ),
    STREAMERS,
  ]
    .flat()
    .map((s) => ({
      ...s,
      is_live: true,
      is_playing_qsmp: true,
    }));

  return streamers;
}
