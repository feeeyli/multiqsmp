'use client';

// Libs Imports
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

// Context Imports
import { StreamPlayerControlsProvider } from './stream-player/stream-player-controls-context';
import { useCustomGroupsContext } from '../../contexts/custom-groups-context';

// Scripts Imports
import { getStreamersFromGroups } from '@/utils/getStreamersFromGroups';
import { useHasMounted } from '@/utils/useHasMounted';

// Components Imports
import { StreamPlayer } from './stream-player';
import { ArrowLeftRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useElementSize, useLocalStorage } from 'usehooks-ts';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { getColumns } from '@/utils/getColumns';
import { getStreamsGridSize } from '@/utils/getStreamsGridSize';
import { useSettingsContext } from '@/contexts/settings-context';

interface StreamsListProps {
  resizing: boolean;
  purgatory: boolean;
}

export const StreamsList = (props: StreamsListProps) => {
  const searchParams = useSearchParams();
  const t = useTranslations('streams-list');
  const [customGroups] = useCustomGroupsContext();
  const hasMounted = useHasMounted();
  const ReactGridLayout = useMemo(() => WidthProvider(RGL), []);
  const [isMoving, setIsMoving] = useState(false);
  const [layoutMemory, setLayoutMemory] = useLocalStorage<{
    [url: string]: Layout[];
  }>('layout-memory', {});
  const [
    {
      streams: { movableMode },
    },
  ] = useSettingsContext();

  function getLayoutKey() {
    const streamers = searchParams.get('streamers')?.split('/');
    const groups = searchParams.get('groups')?.split('/');
    const chats = searchParams.get('chats')?.split('/');

    return `${streamers?.join('/') || ''}${streamers && groups ? '/' : ''}${
      groups?.join('/') || ''
    }${chats && groups ? '/' : ''}${chats ? '$chats$' : ''}`;
  }

  const movingHandles = {
    start() {
      setIsMoving(true);
    },
    stop(layout: Layout[]) {
      // console.log('> new layout', layout);
      setLayoutMemory((old) => {
        const n = { ...old };

        n[getLayoutKey()] = layout;

        return n;
      });
      setIsMoving(false);
    },
  };

  // const on

  const [containerRef, containerSize] = useElementSize();

  if (!hasMounted) return null;

  const streamersOnQuery = searchParams.get('streamers')?.split('/') || [];
  const groupsOnQuery = searchParams.get('groups')?.split('/') || [];

  const streamersFromGroups = getStreamersFromGroups(
    groupsOnQuery,
    customGroups,
  );

  const mergedStreams = [
    ...new Set([...streamersOnQuery, ...streamersFromGroups]),
  ];

  const { columns: cols, height } = getStreamsGridSize(
    mergedStreams.length,
    true,
    containerSize,
  );

  function getGridData(i: number) {
    const def = {
      y: Math.floor(i / cols),
      x: (i % cols) * 10,
      w: 10,
      h: Math.floor(height / 39),
    };

    const layout = layoutMemory[getLayoutKey()];

    if (layout) {
      const item = layout.find((l) => l.i === String(i));

      if (item) return item;

      return def;
    }

    return def;
  }

  return (
    <div
      data-resizing={props.resizing}
      data-movable-mode={movableMode}
      className="streams-list-scrollbar relative h-full flex-1 overflow-auto data-[resizing=true]:pointer-events-none data-[movable-mode=true]:mr-3 data-[movable-mode=true]:pr-1"
      ref={containerRef}
    >
      {mergedStreams.length > 0 && (
        <>
          {movableMode && (
            <ReactGridLayout
              className="grid-layout max-h-full"
              cols={10 * cols}
              rowHeight={32}
              resizeHandles={['sw', 'se']}
              draggableHandle=".handle"
              onDragStart={movingHandles.start}
              onDragStop={movingHandles.stop}
              onResizeStart={movingHandles.start}
              onResizeStop={movingHandles.stop}
              margin={[4, 4]}
            >
              {mergedStreams.map((channel, i) => (
                <div
                  key={i}
                  className="grid-layout-item flex select-none flex-col rounded-sm bg-muted"
                  data-grid={getGridData(i)}
                >
                  <div className="handle h-3 w-full cursor-move"></div>
                  <StreamPlayerControlsProvider>
                    <StreamPlayer
                      channel={channel}
                      // containerSize={containerSize}
                      isMoving={isMoving}
                    />
                  </StreamPlayerControlsProvider>
                </div>
              ))}
            </ReactGridLayout>
          )}
          {!movableMode && (
            <div className="flex h-full max-h-screen flex-1 flex-wrap">
              {mergedStreams.map((channel) => (
                <StreamPlayerControlsProvider key={channel}>
                  <StreamPlayer channel={channel} isMoving={isMoving} />
                </StreamPlayerControlsProvider>
              ))}
            </div>
          )}
        </>
      )}
      {mergedStreams.length === 0 && (
        <div className="absolute left-1/2 top-1/2 flex w-[85%] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-12 ">
          <div className="text-center">
            {t('no-streams').split('((button))')[0]}
            <ArrowLeftRight size="1.25rem" className="inline text-primary" />
            {t('no-streams').split('((button))')[1]}
          </div>
          {!props.purgatory && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-cold-purple-200 text-center text-sm [text-wrap:balance]">
                Watch the{' '}
                <Link
                  href="https://twitter.com/QSMPEvents"
                  className="text-[#FFA4CF]"
                  target="_blank"
                >
                  #QSMPPurgatory2{' '}
                </Link>
                here:
              </p>
              <Button
                variant="outline"
                className="purgatory flex h-auto cursor-pointer gap-2 border-primary/10 bg-muted hover:bg-primary/10"
                asChild
              >
                <Link href="/purgatory">
                  <Image
                    src="/icon-purgatory.svg"
                    alt="Logo MultiQSMP Purgatório"
                    width={96}
                    height={72}
                    className="w-6"
                  />
                  MultiQSMP Purgatory
                  {/* <ExternalLink size="1rem" /> */}
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
