import { StreamerType } from '@/@types/data';
import { useSortStreamers } from './sort-streamers-context';
import { Streamer } from './streamer';

type StreamersListProps = {
  streamers: StreamerType[];
  notDefaultStreamers: string[];
};

export function StreamersList(props: StreamersListProps) {
  const { direction, onlineFirst, playingFirst, sortMethod } =
    useSortStreamers();

  function sortStreamers() {
    let streamers = [...props.streamers];

    const sortDir = [0, -1, 1];

    if (sortMethod.value === 'name')
      streamers = streamers.sort(
        (a, b) =>
          a.display_name.localeCompare(b.display_name) *
          (direction.value === 'asc' ? 1 : -1),
      );

    if (sortMethod.value === 'name-lang' && direction.value === 'des')
      streamers = streamers.reverse();

    if (onlineFirst.value)
      streamers = streamers.sort((x, y) =>
        x.is_live === y.is_live
          ? sortDir[0]
          : x.is_live
          ? sortDir[1]
          : sortDir[2],
      );
    if (playingFirst.value)
      streamers = streamers.sort((x, y) =>
        x.is_playing_qsmp === y.is_playing_qsmp
          ? sortDir[0]
          : x.is_playing_qsmp
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
            key={streamer.twitch_name}
            streamer={streamer}
            isDefault={
              !props.notDefaultStreamers.includes(streamer.twitch_name)
            }
            type="qsmp"
          />
        );
      })}
    </div>
  );
}
