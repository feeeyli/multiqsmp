'use client';

// Libs Imports
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

// Context Imports
import { useCustomGroupsContext } from '../../contexts/custom-groups-context';
import { StreamPlayerControlsProvider } from './stream-player/stream-player-controls-context';

// Scripts Imports
import { getStreamersFromGroups } from '@/utils/getStreamersFromGroups';
import { useHasMounted } from '@/utils/useHasMounted';

// Components Imports
import { useLayoutMemory } from '@/contexts/layout-memory-context';
import { useSettingsContext } from '@/contexts/settings-context';
import { SwapStreamsProvider } from '@/contexts/swap-points-context';
import { getLayoutKey } from '@/utils/getLayoutKey';
import { getStreamsGridSize } from '@/utils/getStreamsGridSize';
import { ArrowLeftRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { useElementSize, useMediaQuery } from 'usehooks-ts';
import { Chat } from '../chats-list/chat';
import { StreamPlayer } from './stream-player';

interface StreamsListProps {
  resizing: boolean;
  purgatory: boolean;
}

export const StreamsList = (props: StreamsListProps) => {
  const isDesktop = !useMediaQuery('(max-width: 640px)');
  const searchParams = useSearchParams();
  const t = useTranslations('streams-list');
  const [customGroups] = useCustomGroupsContext();
  const hasMounted = useHasMounted();
  const ReactGridLayout = useMemo(() => WidthProvider(RGL), []);
  const [isMoving, setIsMoving] = useState(false);
  const [layoutMemory, setLayoutMemory] = useLayoutMemory();
  const [
    {
      streams: { movableChat },
    },
  ] = useSettingsContext();

  const movingHandles = {
    start() {
      setIsMoving(true);
    },
    stop(lay: Layout[]) {
      setLayoutMemory((old) => {
        const n = { ...old };

        n[getLayoutKey(searchParams, { movableChat })] = lay;

        return n;
      });

      setIsMoving(false);
    },
  };

  // const on

  const [containerRef, containerSize] = useElementSize();

  const streamersOnQuery = searchParams.get('streamers')?.split('/') || [];
  const groupsOnQuery = searchParams.get('groups')?.split('/') || [];
  const chatsOnQuery = searchParams.get('chats')?.split('/') || [];

  const streamersFromGroups = getStreamersFromGroups(
    groupsOnQuery,
    customGroups,
  );

  const mergedStreams = [
    ...new Set([
      ...streamersFromGroups.map((s) => ({
        twitchName: s.twitchName,
        groupName: s.groupName,
        isChat: false,
      })),
      ...streamersOnQuery.map((s) => ({
        twitchName: s,
        groupName: undefined,
        isChat: false,
      })),
    ]),
  ];

  const mergedStreamsWithoutDuplicates = Array.from(
    new Set(mergedStreams.map((item) => item.twitchName)),
  ).map((twitchName) => {
    const itemWithGroupName = mergedStreams.find(
      (item) => item.twitchName === twitchName && item.groupName,
    );
    return (
      itemWithGroupName ||
      mergedStreams.find((item) => item.twitchName === twitchName)
    );
  }) as typeof mergedStreams;

  const listWithChat: {
    twitchName: string;
    groupName?: string;
    isChat: boolean;
  }[] = [
    ...mergedStreamsWithoutDuplicates,
    ...(movableChat ? chatsOnQuery : []).map((c) => ({
      twitchName: c,
      groupName: undefined,
      isChat: true,
    })),
  ];

  const { columns: cols, rows } = getStreamsGridSize(
    listWithChat.length,
    isDesktop,
  );

  const rowsPerScreenHeight = Math.floor(containerSize.height / 36);

  function getGridData(i: number) {
    const isInLastRow =
      Math.floor(i / cols) >=
        (rows === 5
          ? 3
          : rows === 9
          ? 5
          : Math.floor((listWithChat.length - 1) / cols)) && rows !== 1;

    const def = {
      y: Math.floor(i / cols),
      x: (i % cols) * 10,
      w: 10,
      h: Math.ceil(containerSize.height / 36 / rows),
      // Math.ceil(Math.floor(containerSize.height / 36) / rows) -
      // (isInLastRow ? 1 : 0),
    };

    const layout = layoutMemory[getLayoutKey(searchParams, { movableChat })];

    if (layout) {
      const item = layout.find((l) => l.i === String(i));

      if (item) return item;

      return def;
    }

    return def;
  }

  const [layout, setLayout] = useState<Layout[]>([]);

  useEffect(() => {
    if (!hasMounted || containerSize.height === 0) return;

    setLayout(
      listWithChat.map((_, i) => ({ i: String(i), ...getGridData(i) })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, containerSize, hasMounted, layoutMemory]);

  if (!hasMounted) return null;

  return (
    <div
      data-resizing={props.resizing}
      data-has-chat-open={!!searchParams.get('chats')}
      className="streams-list-scrollbar relative h-full flex-1 overflow-auto data-[resizing=true]:pointer-events-none data-[has-chat-open=false]:mr-3"
      ref={containerRef}
    >
      {listWithChat.length > 0 && (
        <SwapStreamsProvider
          layout={{ value: layout, set: setLayout }}
          getLayoutKey={(sp) => getLayoutKey(sp, { movableChat })}
        >
          {
            <ReactGridLayout
              className="grid-layout max-h-full"
              cols={10 * cols}
              // rowHeight={{ 1: 30, 5: 28 }[rows] || 29}
              rowHeight={
                containerSize.height /
                  (Math.ceil(containerSize.height / 36 / rows) * rows) -
                4.1
              }
              resizeHandles={['sw', 'se']}
              draggableHandle=".handle"
              onDragStart={movingHandles.start}
              onDragStop={movingHandles.stop}
              onResizeStart={movingHandles.start}
              onResizeStop={movingHandles.stop}
              onLayoutChange={(lay) => {
                setLayout(lay);
              }}
              layout={layout}
              margin={[4, 4]}
            >
              {listWithChat.map((channel, i) => (
                <div
                  key={i}
                  className="grid-layout-item flex select-none flex-col rounded-sm bg-muted"
                >
                  {!channel.isChat && (
                    <StreamPlayerControlsProvider index={i}>
                      <StreamPlayer
                        channel={channel.twitchName}
                        groupName={channel.groupName}
                        isMoving={isMoving}
                        layout={layout}
                      />
                    </StreamPlayerControlsProvider>
                  )}
                  {channel.isChat && (
                    <Chat chat={channel.twitchName} isMoving={isMoving} />
                  )}
                </div>
              ))}
            </ReactGridLayout>
          }
        </SwapStreamsProvider>
      )}
      {listWithChat.length === 0 && (
        <div className="absolute left-1/2 top-1/2 flex w-[85%] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-12 ">
          <div className="text-center">
            {t('no-streams').split('((button))')[0]}
            <ArrowLeftRight size="1.25rem" className="inline text-primary" />
            {t('no-streams').split('((button))')[1]}
          </div>
        </div>
      )}
    </div>
  );
};
