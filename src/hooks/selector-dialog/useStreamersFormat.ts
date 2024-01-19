import { StreamerType } from '@/@types/data';
import { useStreamsSelector } from '@/components/dialogs/selector/selector-dialog-context';
import { useSettings } from '@/contexts/settings-context';
import { STREAMERS } from '@/data/streamers';

export function useStreamersFormat(streamers: StreamerType[]) {
  const { selectedStreamers } = useStreamsSelector();
  const [
    {
      streamers: { outro },
    },
  ] = useSettings();

  const notDefaultStreamers = streamers
    .filter((s) => !STREAMERS.some((str) => str.twitch_name === s.twitch_name))
    .map((s) => s.twitch_name);

  const Streamers = streamers.filter((streamer) => {
    if (
      selectedStreamers.value.some(
        (selected) => selected.twitch_name === streamer.twitch_name,
      )
    )
      return true;

    if (
      (outro.hideOffline && !streamer.is_live) ||
      (outro.hideNotPlaying &&
        !streamer.is_playing_qsmp &&
        !notDefaultStreamers.includes(streamer.twitch_name))
    )
      return false;

    return true;
  });

  return Streamers;
}
