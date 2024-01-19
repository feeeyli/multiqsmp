import { StreamerType } from '@/@types/data';
import { useTranslations } from '@/hooks/useTranslations';
import { useSortStreamers } from './sort-streamers-context';
import { Streamer } from './streamer';

type StreamersListProps = {
  streamers: (StreamerType & { favorite?: boolean })[];
  title?: string;
  notSort?: boolean;
};

export function StreamersList({
  notSort = false,
  ...props
}: StreamersListProps) {
  const { direction, onlineFirst, playingFirst, sortMethod } =
    useSortStreamers();
  const t = useTranslations('streamers-dialog');

  function sortStreamers() {
    if (notSort)
      return props.streamers.sort((a, b) =>
        a.display_name.localeCompare(b.display_name),
      );

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

  if (props.title)
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <h2 className="font-bold text-primary">
          {t(props.title, { count: sortedStreamers.length })}
        </h2>
        <div className="flex flex-wrap gap-4">
          {sortedStreamers.map((streamer) => {
            return (
              <Streamer
                key={streamer.twitch_name}
                streamer={streamer}
                favorite={streamer.favorite}
                type="qsmp"
              />
            );
          })}
        </div>
      </div>
    );

  return (
    <div className="flex w-full flex-wrap justify-center gap-4">
      {sortedStreamers.map((streamer) => {
        return (
          <Streamer
            key={streamer.twitch_name}
            streamer={streamer}
            favorite={streamer.favorite}
            type="qsmp"
          />
        );
      })}
    </div>
  );
}
