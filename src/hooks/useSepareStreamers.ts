import { SimpleStreamerType, StreamerType } from '@/@types/data';
import { STREAMERS } from '@/data/streamers';
import { ReactNode } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';

type ArrayNames = 'new' | 'favorite' | 'default' | 'non-default';

export function useSepareStreamers(): [
  separe: (streamers: StreamerType[]) => {
    name: string;
    streamers: StreamerType[];
  }[],
  render: (
    arrays: {
      name: string;
      streamers: StreamerType[];
    }[],
    separator: (index: number) => ReactNode,
    arrayRender: (streamers: StreamerType[], name: ArrayNames) => ReactNode,
  ) => (ReactNode | StreamerType[])[],
] {
  const favoriteStreamersStorage =
    useReadLocalStorage<string[]>('favorite-streamers');
  const pinnedStreamersStorage =
    useReadLocalStorage<SimpleStreamerType[]>('pinned-streamers');
  const defaultStreamersList = STREAMERS.map(
    (streamer) => streamer.twitch_name,
  );

  function filter(
    streamers: StreamerType[],
    filterArray: string[],
    invert: boolean = false,
  ) {
    const hasPassed = streamers.filter(
      (streamer) =>
        filterArray.some((filter) => streamer.twitch_name === filter) ===
        !invert,
    );

    return [
      hasPassed,
      streamers.filter(
        (streamer) =>
          !hasPassed.some(
            (passed) => passed.twitch_name === streamer.twitch_name,
          ) === !invert,
      ),
    ];
  }

  function render(
    arrays: {
      name: string;
      streamers: StreamerType[];
    }[],
    separator: (index: number) => ReactNode,
    arrayRender: (streamers: StreamerType[], name: ArrayNames) => ReactNode,
  ) {
    const hasSeparator = (next: StreamerType[], ...before: StreamerType[][]) =>
      next.length > 0 && before.some((item) => item.length > 0);

    const withSeparators = arrays.map((array, i) => {
      const itensBefore = arrays.slice(0, i);

      if (itensBefore.length === 0)
        return [arrayRender(array.streamers, array.name as ArrayNames)];

      return hasSeparator(
        array.streamers,
        ...itensBefore.map((item) => item.streamers),
      )
        ? [separator(i), arrayRender(array.streamers, array.name as ArrayNames)]
        : [arrayRender(array.streamers, array.name as ArrayNames)];
    });

    return withSeparators.flat(1);
  }

  function separe(streamers: StreamerType[]) {
    const newParticipants = filter(
      streamers,
      (process.env.NEXT_PUBLIC_NEW_PARTICIPANTS ?? '').split('/'),
    );

    const favoriteStreamers = filter(
      newParticipants[1],
      favoriteStreamersStorage ?? [],
    );

    const pinnedStreamers = filter(
      favoriteStreamers[1],
      (pinnedStreamersStorage ?? []).map((streamer) => streamer.twitch_name),
    );

    const defaultStreamers = filter(pinnedStreamers[1], defaultStreamersList);

    return [
      { name: 'new', streamers: newParticipants[0] },
      { name: 'favorite', streamers: favoriteStreamers[0] },
      {
        name: 'non-default',
        streamers: [...pinnedStreamers[0], ...defaultStreamers[1]],
      },
      { name: 'default', streamers: defaultStreamers[0] },
    ];
  }

  return [separe, render];
}
