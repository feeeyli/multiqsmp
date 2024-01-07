import { StreamerType } from '@/@types/data';
import { Streamer } from '../../streamer';
import { useStreamsSelectorDialogContext } from '../../streams-selector-dialog-context';
import { useSortStreamers } from './sort-streamers-context';
import { OnlineStreamerType } from './streamers-tab';

type StreamersListProps = {
  streamers: StreamerType[];
  onlineStreamers: OnlineStreamerType[];
};

export function StreamersList(props: StreamersListProps) {
  const { selectedStreamers } = useStreamsSelectorDialogContext();
  const { direction, onlineFirst, playingFirst, sortMethod } =
    useSortStreamers();

  function sortStreamers() {
    let streamers = props.streamers.map((s) => {
      const online = props.onlineStreamers.find(
        (o) => o.twitchName === s.twitchName,
      );

      return {
        ...s,
        isOnline: !!online,
        isPlayingQsmp: !!online?.isPlayingQsmp,
      };
    });

    const sortDir = [0, -1, 1];

    if (sortMethod.value === 'name')
      streamers = streamers.sort(
        (a, b) =>
          a.displayName.localeCompare(b.displayName) *
          (direction.value === 'asc' ? 1 : -1),
      );

    if (sortMethod.value === 'name-lang' && direction.value === 'des')
      streamers = streamers.reverse();

    if (onlineFirst.value)
      streamers = streamers.sort((x, y) =>
        x.isOnline === y.isOnline
          ? sortDir[0]
          : x.isOnline
          ? sortDir[1]
          : sortDir[2],
      );
    if (playingFirst.value)
      streamers = streamers.sort((x, y) =>
        x.isPlayingQsmp === y.isPlayingQsmp
          ? sortDir[0]
          : x.isPlayingQsmp
          ? sortDir[1]
          : sortDir[2],
      );

    return streamers;
  }

  const sortedStreamers = sortStreamers();

  return (
    <div className="flex w-full flex-wrap justify-center gap-4">
      {sortedStreamers.map((streamer) => {
        return (
          <Streamer
            key={streamer.twitchName}
            streamer={streamer}
            selected={selectedStreamers.value.includes(streamer.twitchName)}
            isOnline={streamer.isOnline}
            isPlayingQsmp={streamer.isPlayingQsmp}
          />
        );
      })}
    </div>
  );
}
